import type { MemberListItemDto } from '@gibigib/types';
import { StatusPill } from '../../../shared/components/status-pill';
import { daysSinceVisit, isInactive } from '../inactivity';

interface InactivePillProps {
  member: MemberListItemDto;
  now: string;
}

export function InactivePill({ member, now }: InactivePillProps) {
  if (!isInactive(member, now)) return null;
  const days = daysSinceVisit(member, now);
  return <StatusPill level="warn">{days === undefined ? 'Bez dolaska' : `Bez dolaska · ${days} d`}</StatusPill>;
}
