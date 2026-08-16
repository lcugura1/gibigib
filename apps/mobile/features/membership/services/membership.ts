import type { ActiveMembershipDto, MembershipDto, PurchaseMembershipInput } from '@gibigib/types';
import { authedFetch } from '@/shared/api';

export function fetchActiveMembership() {
  return authedFetch<ActiveMembershipDto>('/memberships/active');
}

export function purchaseMembership(input: PurchaseMembershipInput) {
  return authedFetch<MembershipDto>('/memberships', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
