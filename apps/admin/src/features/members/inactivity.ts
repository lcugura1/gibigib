import type { MemberListItemDto } from '@gibigib/types';

export const INACTIVE_AFTER_DAYS = 14;

const DAY_MS = 86_400_000;

const dayStart = (iso: string) => {
  const date = new Date(iso);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

export const daysBetween = (fromIso: string, toIso: string) =>
  Math.round((dayStart(toIso) - dayStart(fromIso)) / DAY_MS);

export const daysSinceVisit = (member: MemberListItemDto, now: string) =>
  member.lastVisitAt ? daysBetween(member.lastVisitAt, now) : undefined;

export function isInactive(member: MemberListItemDto, now: string) {
  if (member.status !== 'ACTIVE') return false;
  const days = daysSinceVisit(member, now);
  return days === undefined || days >= INACTIVE_AFTER_DAYS;
}
