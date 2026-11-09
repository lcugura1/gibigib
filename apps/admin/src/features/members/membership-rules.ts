import type { MemberDetailDto } from '@gibigib/types';
import { daysBetween } from './inactivity';

export type PauseState =
  | { kind: 'paused'; until: string; daysLeft: number }
  | { kind: 'cooldown'; from: string; daysLeft: number }
  | { kind: 'available' }
  | { kind: 'unavailable' };

export const isEnded = (member: MemberDetailDto) =>
  member.membership.status === 'EXPIRED' || member.membership.status === 'CANCELLED';

export function pauseState(member: MemberDetailDto): PauseState {
  const { current, nextAllowedFrom } = member.pause;
  if (isEnded(member)) return { kind: 'unavailable' };
  if (current)
    return { kind: 'paused', until: current.until, daysLeft: Math.max(0, daysBetween(member.asOf, current.until)) };
  if (nextAllowedFrom && nextAllowedFrom > member.asOf) {
    return {
      kind: 'cooldown',
      from: nextAllowedFrom,
      daysLeft: Math.max(1, daysBetween(member.asOf, nextAllowedFrom)),
    };
  }
  return { kind: 'available' };
}

export const daysUntilEnd = (member: MemberDetailDto) => daysBetween(member.asOf, member.membership.endsAt);

export const firstName = (name: string) => name.split(' ')[0] ?? name;
