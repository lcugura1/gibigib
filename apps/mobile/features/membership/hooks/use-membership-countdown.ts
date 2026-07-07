import { useEffect, useState } from 'react';
import { getActiveMembership } from '@/features/membership/services/membership';
import type { ActiveMembership } from '@/features/membership/types/membership';

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

export function useMembershipCountdown() {
  const [membership, setMembership] = useState<ActiveMembership | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let active = true;
    getActiveMembership()
      .then((data) => {
        if (active) setMembership(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), MINUTE_MS);
    return () => clearInterval(id);
  }, []);

  const label = membership ? formatTimeLeft(membership.endDate, now) : null;

  return { membership, label };
}
