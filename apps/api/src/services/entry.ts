import { randomBytes } from 'node:crypto';
import type { EntryScanResult, EntryTokenDto, OccupancyDto } from '@gibigib/types';
import { ENTRY_QR_PREFIX } from '@gibigib/types';
import { env } from '../config/env';
import type { EntryOutcome } from '../generated/prisma/client';
import { queueDoorOpen } from '../utils/device-state';
import { HttpError } from '../utils/errors';
import { prisma } from '../utils/prisma';
import { getActiveMembership } from './membership';

const TOKEN_TTL_MS = 45_000;
const TOKEN_REUSE_MIN_MS = 20_000;
const ANTI_PASSBACK_MS = env.ENTRY_ANTI_PASSBACK_MINUTES * 60_000;

const DENIED_MESSAGES: Record<Exclude<EntryOutcome, 'GRANTED'>, string> = {
  INVALID_TOKEN: 'Nevažeća ulaznica',
  TOKEN_USED: 'Ulaznica je već iskorištena, otvori aplikaciju za novi QR kod',
  TOKEN_EXPIRED: 'QR kod je istekao, osvježi ga u aplikaciji',
  NO_MEMBERSHIP: 'Članarina nije aktivna',
  MEMBERSHIP_PAUSED: 'Članarina je pauzirana',
  ANTI_PASSBACK: 'Ulaz je već zabilježen, pokušaj ponovno kasnije',
};

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function issueEntryToken(userId: string): Promise<EntryTokenDto> {
  const membership = await getActiveMembership(userId);
  if (!membership) {
    throw new HttpError(403, 'Članarina nije aktivna');
  }
  if (membership.status === 'PAUSED') {
    throw new HttpError(403, 'Članarina je pauzirana');
  }

  const now = Date.now();
  const existing = await prisma.entryToken.findFirst({
    where: { userId, usedAt: null, expiresAt: { gt: new Date(now + TOKEN_REUSE_MIN_MS) } },
    orderBy: { expiresAt: 'desc' },
  });

  const entryToken =
    existing ??
    (await prisma.entryToken.create({
      data: {
        token: randomBytes(16).toString('hex'),
        userId,
        expiresAt: new Date(now + TOKEN_TTL_MS),
      },
    }));

  return { token: entryToken.token, expiresAt: entryToken.expiresAt.toISOString() };
}

async function deny(
  outcome: Exclude<EntryOutcome, 'GRANTED'>,
  entryToken?: { id: string; userId: string },
): Promise<EntryScanResult> {
  await prisma.entryEvent.create({
    data: { outcome, userId: entryToken?.userId, entryTokenId: entryToken?.id },
  });
  return { ok: false, message: DENIED_MESSAGES[outcome] };
}

export async function scanEntryCode(code: string): Promise<EntryScanResult> {
  const raw = code.startsWith(ENTRY_QR_PREFIX) ? code.slice(ENTRY_QR_PREFIX.length) : code;

  const entryToken = await prisma.entryToken.findUnique({
    where: { token: raw },
    include: { user: true },
  });

  if (!entryToken) {
    return deny('INVALID_TOKEN');
  }
  if (entryToken.usedAt) {
    return deny('TOKEN_USED', entryToken);
  }
  if (entryToken.expiresAt.getTime() <= Date.now()) {
    return deny('TOKEN_EXPIRED', entryToken);
  }

  const membership = await getActiveMembership(entryToken.userId);
  if (!membership) {
    return deny('NO_MEMBERSHIP', entryToken);
  }
  if (membership.status === 'PAUSED') {
    return deny('MEMBERSHIP_PAUSED', entryToken);
  }

  const outcome = await prisma.$transaction(async (tx): Promise<EntryOutcome> => {
    // Serialises scans of the same member so two tokens cannot both pass the anti-passback check.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${entryToken.userId}))`;

    const now = new Date();
    if (ANTI_PASSBACK_MS > 0) {
      const recentEntry = await tx.entryEvent.findFirst({
        where: {
          userId: entryToken.userId,
          outcome: 'GRANTED',
          createdAt: { gt: new Date(now.getTime() - ANTI_PASSBACK_MS) },
        },
      });
      if (recentEntry) {
        return 'ANTI_PASSBACK';
      }
    }

    // Consumes the token only if nobody else has, so each code opens the door at most once.
    const consumed = await tx.entryToken.updateMany({
      where: { id: entryToken.id, usedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now },
    });
    if (consumed.count !== 1) {
      return 'TOKEN_USED';
    }

    const checkedInToday = await tx.attendance.findFirst({
      where: { userId: entryToken.userId, checkInAt: { gte: startOfToday() } },
    });
    if (!checkedInToday) {
      const gym = await tx.gym.findFirstOrThrow();
      await tx.attendance.create({
        data: { userId: entryToken.userId, gymId: gym.id, entryTokenId: entryToken.id },
      });
    }

    await tx.entryEvent.create({
      data: { outcome: 'GRANTED', userId: entryToken.userId, entryTokenId: entryToken.id },
    });
    return 'GRANTED';
  });

  if (outcome !== 'GRANTED') {
    return deny(outcome, entryToken);
  }

  queueDoorOpen();

  return {
    ok: true,
    message: 'Ulaz odobren',
    memberName: entryToken.user.firstName,
  };
}

export async function getOccupancy(): Promise<OccupancyDto> {
  const [members, gym] = await Promise.all([
    prisma.attendance.groupBy({
      by: ['userId'],
      where: { checkInAt: { gte: startOfToday() } },
    }),
    prisma.gym.findFirstOrThrow(),
  ]);

  return { count: members.length, capacity: gym.capacity };
}
