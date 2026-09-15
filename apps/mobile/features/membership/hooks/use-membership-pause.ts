import { useEffect, useMemo, useState } from 'react';
import {
  MEMBERSHIP_PAUSE_COOLDOWN_DAYS,
  MEMBERSHIP_PAUSE_MAX_DAYS,
  type MembershipDto,
} from '@gibigib/types';
import { useMembership } from '@/features/membership/context/membership';
import {
  formatExpiryLong,
  formatTimeLeft,
  pluralHr,
} from '@/features/membership/hooks/use-membership-countdown';

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

const MONTHS_HR_GENITIVE = [
  'siječnja',
  'veljače',
  'ožujka',
  'travnja',
  'svibnja',
  'lipnja',
  'srpnja',
  'kolovoza',
  'rujna',
  'listopada',
  'studenoga',
  'prosinca',
];

export function formatDayMonth(date: Date) {
  return `${date.getDate()}. ${MONTHS_HR_GENITIVE[date.getMonth()]}`;
}

export function formatTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDayMonthTime(date: Date) {
  return `${formatDayMonth(date)} u ${formatTime(date)}`;
}

export function formatDays(days: number) {
  return `${days} ${pluralHr(days, 'dan', 'dana', 'dana')}`;
}

export type MembershipPauseState = {
  pausable: boolean;
  paused: boolean;
  canPause: boolean;
  lastPauseStartedAt: Date | null;
  nextPauseAt: Date | null;
  pauseEndsAt: Date | null;
  remainingDays: number;
  timeLeftLabel: string | null;
  remainingLabel: string | null;
  pausedLabel: string | null;
  endDateAfterFullPause: Date | null;
  endDateIfResumedNow: Date | null;
  pauseEndsIfPausedNow: Date;
};

export function derivePauseState(membership: MembershipDto | null, now: number): MembershipPauseState {
  const lastPause = membership?.lastPause ?? null;
  const endDate = membership ? new Date(membership.endDate).getTime() : null;
  const startedAt = lastPause ? new Date(lastPause.startedAt).getTime() : null;
  const endsAt = lastPause ? new Date(lastPause.endsAt).getTime() : null;
  const paused = membership?.status === 'PAUSED' && !!lastPause && !lastPause.endedAt;
  const nextPauseAt = startedAt != null ? startedAt + MEMBERSHIP_PAUSE_COOLDOWN_DAYS * DAY_MS : null;
  const pausable = !!membership?.pausable;
  const canPause = pausable && !paused && (nextPauseAt == null || nextPauseAt <= now);

  const base = {
    pausable,
    paused,
    canPause,
    lastPauseStartedAt: startedAt != null ? new Date(startedAt) : null,
    nextPauseAt: nextPauseAt != null ? new Date(nextPauseAt) : null,
    pauseEndsIfPausedNow: new Date(now + MEMBERSHIP_PAUSE_MAX_DAYS * DAY_MS),
  };

  if (!paused || endDate == null || startedAt == null || endsAt == null || !lastPause) {
    return {
      ...base,
      pauseEndsAt: null,
      remainingDays: 0,
      timeLeftLabel: null,
      remainingLabel: null,
      pausedLabel: null,
      endDateAfterFullPause: null,
      endDateIfResumedNow: null,
    };
  }

  const remainingMs = Math.max(endsAt - now, 0);
  const pausedMs = Math.min(Math.max(now - startedAt, 0), endsAt - startedAt);

  return {
    ...base,
    pauseEndsAt: new Date(endsAt),
    remainingDays: Math.min(Math.max(Math.ceil(remainingMs / DAY_MS), 1), MEMBERSHIP_PAUSE_MAX_DAYS),
    timeLeftLabel: formatTimeLeft(lastPause.endsAt, now),
    remainingLabel: formatExpiryLong(lastPause.endsAt, now),
    pausedLabel: formatExpiryLong(new Date(startedAt + pausedMs).toISOString(), startedAt),
    endDateAfterFullPause: new Date(endDate + (endsAt - startedAt)),
    endDateIfResumedNow: new Date(endDate + pausedMs),
  };
}

export function useMembershipPause() {
  const { membership } = useMembership();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), MINUTE_MS);
    return () => clearInterval(id);
  }, [membership]);

  return useMemo(() => derivePauseState(membership, now), [membership, now]);
}
