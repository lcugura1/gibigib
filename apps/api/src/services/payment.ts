import type { FastifyBaseLogger } from 'fastify';
import Stripe from 'stripe';
import type { CreatePaymentInput, PaymentDto, PaymentIntentDto } from '@gibigib/types';
import { env } from '../config/env';
import type { MembershipProgram, Payment, Prisma } from '../generated/prisma/client';
import { HttpError } from '../utils/errors';
import { prisma } from '../utils/prisma';
import { grantMembership, revokeMembershipTime } from './membership';

const CURRENCY = 'eur';
const UNAVAILABLE_MESSAGE = 'Plaćanje trenutno nije dostupno. Pokušaj ponovno kasnije.';

let client: Stripe | null = null;

function stripe() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new HttpError(503, UNAVAILABLE_MESSAGE);
  }
  client ??= new Stripe(env.STRIPE_SECRET_KEY);
  return client;
}

function toPaymentDto(payment: Payment & { program: MembershipProgram }): PaymentDto {
  return {
    id: payment.id,
    status: payment.status,
    amountCents: payment.amountCents,
    currency: payment.currency,
    program: { slug: payment.program.slug, name: payment.program.name },
    createdAt: payment.createdAt.toISOString(),
    paidAt: payment.paidAt?.toISOString() ?? null,
    refundedAt: payment.refundedAt?.toISOString() ?? null,
  };
}

// The price comes from the database, never from the app, and the membership is granted only by
// the webhook once Stripe confirms the money arrived.
export async function createPayment(
  userId: string,
  input: CreatePaymentInput,
  log: FastifyBaseLogger,
): Promise<PaymentIntentDto> {
  if (!env.STRIPE_PUBLISHABLE_KEY) {
    throw new HttpError(503, UNAVAILABLE_MESSAGE);
  }
  const stripeClient = stripe();

  const program = await prisma.membershipProgram.findFirst({
    where: { slug: input.programSlug, isActive: true },
  });
  if (!program) {
    throw new HttpError(404, 'Program nije pronađen');
  }

  const payment = await prisma.payment.create({
    data: { userId, programId: program.id, amountCents: program.priceCents, currency: CURRENCY },
  });

  let intent: Stripe.PaymentIntent;
  try {
    intent = await stripeClient.paymentIntents.create(
      {
        amount: payment.amountCents,
        currency: CURRENCY,
        automatic_payment_methods: { enabled: true },
        description: `GibiGib – ${program.name}`,
        metadata: { paymentId: payment.id, userId, programSlug: program.slug },
      },
      { idempotencyKey: `payment-${payment.id}` },
    );
  } catch (err) {
    log.error({ err, paymentId: payment.id }, 'Stripe refused to create a PaymentIntent');
    await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } });
    throw new HttpError(502, UNAVAILABLE_MESSAGE);
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { stripePaymentIntentId: intent.id },
  });

  if (!intent.client_secret) {
    throw new HttpError(502, UNAVAILABLE_MESSAGE);
  }

  return {
    paymentId: payment.id,
    clientSecret: intent.client_secret,
    publishableKey: env.STRIPE_PUBLISHABLE_KEY,
    amountCents: payment.amountCents,
    currency: payment.currency,
  };
}

export async function getPayment(userId: string, paymentId: string): Promise<PaymentDto> {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, userId },
    include: { program: true },
  });
  if (!payment) {
    throw new HttpError(404, 'Plaćanje nije pronađeno');
  }
  return toPaymentDto(payment);
}

export async function listPayments(userId: string): Promise<PaymentDto[]> {
  const payments = await prisma.payment.findMany({
    where: { userId, status: { in: ['SUCCEEDED', 'REFUNDED'] } },
    orderBy: { createdAt: 'desc' },
    include: { program: true },
  });
  return payments.map(toPaymentDto);
}

async function findPayment(tx: Prisma.TransactionClient, intentId: string) {
  return tx.payment.findUnique({
    where: { stripePaymentIntentId: intentId },
    include: { program: true },
  });
}

async function lockMember(tx: Prisma.TransactionClient, userId: string) {
  // Same per-member lock as entry scans, so membership changes for one member run one at a time.
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}))`;
}

async function handleSucceeded(tx: Prisma.TransactionClient, intent: Stripe.PaymentIntent) {
  const payment = await findPayment(tx, intent.id);
  if (!payment) return;

  if (intent.amount_received !== payment.amountCents || intent.currency !== payment.currency) {
    throw new Error(`Payment ${payment.id} amount does not match its PaymentIntent ${intent.id}`);
  }

  await lockMember(tx, payment.userId);
  const now = new Date();
  // FAILED is included because a member can retry with another card on the same PaymentIntent.
  const claimed = await tx.payment.updateMany({
    where: { id: payment.id, status: { in: ['PENDING', 'FAILED'] } },
    data: { status: 'SUCCEEDED', paidAt: now },
  });
  if (claimed.count !== 1) return;

  const membership = await grantMembership(tx, payment.userId, payment.program, now);
  await tx.payment.update({ where: { id: payment.id }, data: { membershipId: membership.id } });
}

async function handleRefunded(tx: Prisma.TransactionClient, charge: Stripe.Charge) {
  // Partial refunds are recorded only in Stripe; staff decide what happens to the membership.
  if (!charge.refunded) return;
  const intentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
  if (!intentId) return;

  const payment = await findPayment(tx, intentId);
  if (!payment) return;

  await lockMember(tx, payment.userId);
  const now = new Date();
  const refunded = await tx.payment.updateMany({
    where: { id: payment.id, status: 'SUCCEEDED' },
    data: { status: 'REFUNDED', refundedAt: now },
  });
  if (refunded.count === 1 && payment.membershipId) {
    await revokeMembershipTime(tx, payment.membershipId, payment.program.durationDays, now);
  }
}

async function handleEvent(tx: Prisma.TransactionClient, event: Stripe.Event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      return handleSucceeded(tx, event.data.object);
    case 'payment_intent.payment_failed':
      await tx.payment.updateMany({
        where: { stripePaymentIntentId: event.data.object.id, status: 'PENDING' },
        data: { status: 'FAILED' },
      });
      return;
    case 'payment_intent.canceled':
      await tx.payment.updateMany({
        where: { stripePaymentIntentId: event.data.object.id, status: { in: ['PENDING', 'FAILED'] } },
        data: { status: 'CANCELED' },
      });
      return;
    case 'charge.refunded':
      return handleRefunded(tx, event.data.object);
  }
}

// Verifies Stripe's signature over the raw body, then handles each event exactly once: the event
// id is stored in the same transaction, so a retried delivery finds it and changes nothing.
export async function handleStripeWebhook(rawBody: Buffer, signature: string | undefined) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new HttpError(503, UNAVAILABLE_MESSAGE);
  }
  if (!signature) {
    throw new HttpError(400, 'Nedostaje Stripe potpis');
  }

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    throw new HttpError(400, 'Neispravan Stripe potpis');
  }

  await prisma.$transaction(async (tx) => {
    const seen = await tx.stripeEvent.createMany({
      data: [{ id: event.id, type: event.type }],
      skipDuplicates: true,
    });
    if (seen.count === 0) return;
    await handleEvent(tx, event);
  });
}
