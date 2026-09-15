import type { MembershipDto, PurchaseMembershipInput } from '@gibigib/types';
import {
  MEMBERSHIP_PAUSE_COOLDOWN_DAYS,
  MEMBERSHIP_PAUSE_MAX_DAYS,
  PAUSABLE_PROGRAM_SLUG,
} from '@gibigib/types';
import type { Membership, MembershipPause, MembershipProgram } from '../generated/prisma/client';
import { HttpError } from '../utils/errors';
import { prisma } from '../utils/prisma';

const DAY_MS = 86_400_000;
const FAKE_PAYMENT_DELAY_MS = 700;
const PAUSE_MAX_MS = MEMBERSHIP_PAUSE_MAX_DAYS * DAY_MS;
const PAUSE_COOLDOWN_MS = MEMBERSHIP_PAUSE_COOLDOWN_DAYS * DAY_MS;

const membershipInclude = {
  program: true,
  pauses: { orderBy: { startedAt: 'desc' }, take: 1 },
} as const;

type MembershipWithRelations = Membership & {
  program: MembershipProgram;
  pauses: MembershipPause[];
};

function toMembershipDto(membership: MembershipWithRelations): MembershipDto {
  const lastPause = membership.pauses[0];

  return {
    id: membership.id,
    status: membership.status,
    startDate: membership.startDate.toISOString(),
    endDate: membership.endDate.toISOString(),
    program: {
      slug: membership.program.slug,
      name: membership.program.name,
      durationDays: membership.program.durationDays,
    },
    pausable: membership.program.slug === PAUSABLE_PROGRAM_SLUG,
    lastPause: lastPause
      ? {
          id: lastPause.id,
          startedAt: lastPause.startedAt.toISOString(),
          endsAt: lastPause.endsAt.toISOString(),
          endedAt: lastPause.endedAt?.toISOString() ?? null,
        }
      : null,
  };
}

async function endPause(
  membership: MembershipWithRelations,
  pause: MembershipPause,
  endedAt: Date,
): Promise<MembershipWithRelations> {
  return prisma.$transaction(async (tx) => {
    const closed = await tx.membershipPause.updateMany({
      where: { id: pause.id, endedAt: null },
      data: { endedAt },
    });

    // A concurrent request may have closed the pause already; only that one may extend the end date.
    if (closed.count === 1) {
      const pausedMs = endedAt.getTime() - pause.startedAt.getTime();
      await tx.membership.update({
        where: { id: membership.id },
        data: {
          status: 'ACTIVE',
          endDate: new Date(membership.endDate.getTime() + pausedMs),
        },
      });
    }

    return tx.membership.findUniqueOrThrow({
      where: { id: membership.id },
      include: membershipInclude,
    });
  });
}

async function findCurrentMembership(userId: string) {
  const now = new Date();
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      OR: [{ status: 'ACTIVE', endDate: { gt: now } }, { status: 'PAUSED' }],
    },
    orderBy: { endDate: 'desc' },
    include: membershipInclude,
  });

  if (!membership) {
    return null;
  }

  const pause = membership.pauses[0];
  const settled =
    membership.status === 'PAUSED' && pause && !pause.endedAt && pause.endsAt <= now
      ? await endPause(membership, pause, pause.endsAt)
      : membership;

  return settled.status === 'PAUSED' || settled.endDate > now ? settled : null;
}

export async function getActiveMembership(userId: string): Promise<MembershipDto | null> {
  const membership = await findCurrentMembership(userId);
  return membership ? toMembershipDto(membership) : null;
}

export async function pauseMembership(userId: string): Promise<MembershipDto> {
  const membership = await findCurrentMembership(userId);

  if (!membership) {
    throw new HttpError(404, 'Nemaš aktivnu članarinu');
  }
  if (membership.program.slug !== PAUSABLE_PROGRAM_SLUG) {
    throw new HttpError(403, 'Pauza je dostupna samo za mjesečnu članarinu');
  }
  if (membership.status === 'PAUSED') {
    throw new HttpError(409, 'Članarina je već pauzirana');
  }

  const now = new Date();
  const lastPause = membership.pauses[0];
  if (lastPause && now.getTime() < lastPause.startedAt.getTime() + PAUSE_COOLDOWN_MS) {
    throw new HttpError(409, 'Pauza trenutno nije dostupna');
  }

  const paused = await prisma.$transaction(async (tx) => {
    const switched = await tx.membership.updateMany({
      where: { id: membership.id, status: 'ACTIVE' },
      data: { status: 'PAUSED' },
    });

    if (switched.count === 0) {
      throw new HttpError(409, 'Članarina je već pauzirana');
    }

    await tx.membershipPause.create({
      data: {
        membershipId: membership.id,
        startedAt: now,
        endsAt: new Date(now.getTime() + PAUSE_MAX_MS),
      },
    });

    return tx.membership.findUniqueOrThrow({
      where: { id: membership.id },
      include: membershipInclude,
    });
  });

  return toMembershipDto(paused);
}

export async function resumeMembership(userId: string): Promise<MembershipDto> {
  const membership = await findCurrentMembership(userId);
  const pause = membership?.pauses[0];

  if (!membership || membership.status !== 'PAUSED' || !pause || pause.endedAt) {
    throw new HttpError(409, 'Članarina nije pauzirana');
  }

  return toMembershipDto(await endPause(membership, pause, new Date()));
}

export async function purchaseMembership(
  userId: string,
  input: PurchaseMembershipInput,
): Promise<MembershipDto> {
  const program = await prisma.membershipProgram.findFirst({
    where: { slug: input.programSlug, isActive: true },
  });

  if (!program) {
    throw new HttpError(404, 'Program nije pronađen');
  }

  await new Promise((resolve) => setTimeout(resolve, FAKE_PAYMENT_DELAY_MS));

  const now = new Date();
  const current = await findCurrentMembership(userId);
  const currentPause = current?.pauses[0];
  const active =
    current?.status === 'PAUSED' && currentPause
      ? await endPause(current, currentPause, now)
      : current;

  const membership = active
    ? await prisma.membership.update({
        where: { id: active.id },
        data: {
          programId: program.id,
          endDate: new Date(active.endDate.getTime() + program.durationDays * DAY_MS),
        },
        include: membershipInclude,
      })
    : await prisma.membership.create({
        data: {
          userId,
          programId: program.id,
          startDate: now,
          endDate: new Date(now.getTime() + program.durationDays * DAY_MS),
        },
        include: membershipInclude,
      });

  return toMembershipDto(membership);
}
