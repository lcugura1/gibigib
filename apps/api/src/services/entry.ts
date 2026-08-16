import { randomBytes } from 'node:crypto';
import type { EntryScanResult, EntryTokenDto, OccupancyDto } from '@gibigib/types';
import { ENTRY_QR_PREFIX } from '@gibigib/types';
import { queueDoorOpen } from '../utils/device-state';
import { HttpError } from '../utils/errors';
import { prisma } from '../utils/prisma';
import { getActiveMembership } from './membership';

const TOKEN_TTL_MS = 120_000;
const TOKEN_REUSE_MIN_MS = 30_000;

export async function issueEntryToken(userId: string): Promise<EntryTokenDto> {
  const membership = await getActiveMembership(userId);
  if (!membership) {
    throw new HttpError(403, 'Članarina nije aktivna');
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

export async function scanEntryCode(code: string): Promise<EntryScanResult> {
  const raw = code.startsWith(ENTRY_QR_PREFIX) ? code.slice(ENTRY_QR_PREFIX.length) : code;

  const entryToken = await prisma.entryToken.findUnique({
    where: { token: raw },
    include: { user: true },
  });

  if (!entryToken) {
    return { ok: false, message: 'Nevažeća ulaznica' };
  }
  if (entryToken.usedAt) {
    return { ok: false, message: 'Ulaznica je već iskorištena' };
  }
  if (entryToken.expiresAt.getTime() < Date.now()) {
    return { ok: false, message: 'QR kod je istekao, osvježi ga u aplikaciji' };
  }

  const membership = await getActiveMembership(entryToken.userId);
  if (!membership) {
    return { ok: false, message: 'Članarina nije aktivna' };
  }

  const gym = await prisma.gym.findFirstOrThrow();

  await prisma.$transaction([
    prisma.entryToken.update({ where: { id: entryToken.id }, data: { usedAt: new Date() } }),
    prisma.attendance.create({
      data: { userId: entryToken.userId, gymId: gym.id, entryTokenId: entryToken.id },
    }),
  ]);

  queueDoorOpen();

  return { ok: true, message: 'Ulaz odobren', memberName: entryToken.user.firstName };
}

export async function getOccupancy(): Promise<OccupancyDto> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [count, gym] = await Promise.all([
    prisma.attendance.count({ where: { checkInAt: { gte: startOfDay } } }),
    prisma.gym.findFirstOrThrow(),
  ]);

  return { count, capacity: gym.capacity };
}
