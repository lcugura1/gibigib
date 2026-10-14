import { z } from 'zod';
import { membershipProgramSlugSchema } from './membership';

export const createPaymentSchema = z.object({
  programSlug: membershipProgramSlugSchema,
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

// What the app needs to open Stripe's payment sheet for one payment.
export const paymentIntentDtoSchema = z.object({
  paymentId: z.string(),
  clientSecret: z.string(),
  publishableKey: z.string(),
  amountCents: z.number().int().positive(),
  currency: z.string(),
});

export type PaymentIntentDto = z.infer<typeof paymentIntentDtoSchema>;

export const paymentStatusSchema = z.enum(['PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REFUNDED']);

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const paymentDtoSchema = z.object({
  id: z.string(),
  status: paymentStatusSchema,
  amountCents: z.number().int(),
  currency: z.string(),
  program: z.object({ slug: z.string(), name: z.string() }),
  createdAt: z.string(),
  paidAt: z.string().nullable(),
  refundedAt: z.string().nullable(),
});

export type PaymentDto = z.infer<typeof paymentDtoSchema>;
