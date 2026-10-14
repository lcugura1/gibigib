import type { ActiveMembershipDto, MembershipDto } from '@gibigib/types';
import { authedFetch } from '@/shared/api';

export function fetchActiveMembership() {
  return authedFetch<ActiveMembershipDto>('/memberships/active');
}

export function pauseMembership() {
  return authedFetch<MembershipDto>('/memberships/active/pause', { method: 'POST' });
}

export function resumeMembership() {
  return authedFetch<MembershipDto>('/memberships/active/resume', { method: 'POST' });
}
