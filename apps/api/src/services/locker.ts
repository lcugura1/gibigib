import type { LockerDto } from '@gibigib/types';
import type { Locker } from '../generated/prisma/client';
import { HttpError } from '../utils/errors';
import { prisma } from '../utils/prisma';

function toLockerDto(locker: Locker): LockerDto {
  return {
    number: locker.number,
    status: locker.status,
    updatedAt: locker.updatedAt.toISOString(),
  };
}

export async function listLockers(): Promise<LockerDto[]> {
  const lockers = await prisma.locker.findMany({ orderBy: { number: 'asc' } });
  return lockers.map(toLockerDto);
}

export async function toggleLocker(number: number): Promise<LockerDto> {
  const locker = await prisma.locker.findUnique({ where: { number } });
  if (!locker) {
    throw new HttpError(404, 'Ormarić nije pronađen');
  }

  const updated = await prisma.locker.update({
    where: { id: locker.id },
    data: { status: locker.status === 'LOCKED' ? 'UNLOCKED' : 'LOCKED' },
  });

  return toLockerDto(updated);
}

export function renderLockerPage(locker: LockerDto): string {
  const locked = locker.status === 'LOCKED';
  const statusColor = locked ? '#f87171' : '#4ade80';
  const statusText = locked ? 'Zaključan' : 'Otključan';
  const icon = locked ? '🔒' : '🔓';

  return `<!doctype html>
<html lang="hr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GibiGib — Ormarić ${locker.number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0b0b0f;
      color: #f5f5f7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      padding: 24px;
    }
    main { text-align: center; display: flex; flex-direction: column; gap: 14px; align-items: center; }
    .icon { font-size: 72px; }
    h1 { font-size: 30px; font-weight: 700; }
    .status { font-size: 24px; font-weight: 700; color: ${statusColor}; }
    .hint { font-size: 16px; color: #8e8e93; }
  </style>
</head>
<body>
  <main>
    <div class="icon">${icon}</div>
    <h1>Ormarić ${locker.number}</h1>
    <p class="status">${statusText}</p>
    <p class="hint">Sada možeš zatvoriti ovu stranicu.</p>
  </main>
</body>
</html>`;
}
