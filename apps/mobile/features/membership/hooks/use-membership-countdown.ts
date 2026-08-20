import { useEffect, useState } from 'react';
import { useMembership } from '@/features/membership/context/membership';

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

export function formatTimeLeft(endDate: string, now: number): string | null {
  const diff = new Date(endDate).getTime() - now;
  if (diff <= 0) return null;
  if (diff >= DAY_MS) return `${Math.round(diff / DAY_MS)}d`;
  if (diff >= HOUR_MS) return `${Math.floor(diff / HOUR_MS)}h`;
  return `${Math.max(1, Math.floor(diff / MINUTE_MS))}m`;
}

function pluralHr(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function formatExpiryLong(endDate: string, now: number): string | null {
  const start = new Date(now);
  const end = new Date(endDate);
  if (end.getTime() <= start.getTime()) return null;

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const anchor = new Date(start);
  anchor.setMonth(anchor.getMonth() + months);
  if (anchor.getTime() > end.getTime()) {
    months -= 1;
    anchor.setMonth(anchor.getMonth() - 1);
  }

  let rest = end.getTime() - anchor.getTime();
  const days = Math.floor(rest / DAY_MS);
  rest -= days * DAY_MS;
  const hours = Math.floor(rest / HOUR_MS);

  const parts: string[] = [];
  if (months > 0) parts.push(`${months} ${pluralHr(months, 'mjesec', 'mjeseca', 'mjeseci')}`);
  if (days > 0) parts.push(`${days} ${pluralHr(days, 'dan', 'dana', 'dana')}`);
  if (hours > 0) parts.push(`${hours} ${pluralHr(hours, 'sat', 'sata', 'sati')}`);
  if (parts.length === 0) return 'manje od sat vremena';
  return parts.join(', ');
}

export function useMembershipCountdown() {
  const { membership } = useMembership();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), MINUTE_MS);
    return () => clearInterval(id);
  }, []);

  const label = membership ? formatTimeLeft(membership.endDate, now) : null;
  const longLabel = membership ? formatExpiryLong(membership.endDate, now) : null;

  return { membership, label, longLabel };
}
