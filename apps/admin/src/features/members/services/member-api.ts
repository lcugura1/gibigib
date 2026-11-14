import type { ExtendMembershipRequest, MemberDetailDto, MemberVisitsDto, PauseMembershipRequest } from '@gibigib/types';
import type { Observable } from 'rxjs';
import { respond } from '../../../shared/mock/respond';
import {
  cancelMembership,
  extendMembership,
  memberDetail,
  memberVisits,
  pauseMembership,
  resumeMembership,
  revealOib,
} from './member-store';

export interface MemberApi {
  detail(id: string): Observable<MemberDetailDto>;
  visits(id: string, month: string): Observable<MemberVisitsDto>;
  revealOib(id: string): Observable<string>;
  extend(id: string, request: ExtendMembershipRequest): Observable<true>;
  pause(id: string, request: PauseMembershipRequest): Observable<true>;
  resume(id: string): Observable<true>;
  cancel(id: string): Observable<true>;
}

const done = (action: () => void) => () => {
  action();
  return true as const;
};

export const memberApi: MemberApi = {
  detail: (id) => respond(() => memberDetail(id)),
  visits: (id, month) => respond(() => memberVisits(id, month)),
  revealOib: (id) => respond(() => revealOib(id)),
  extend: (id, request) => respond(done(() => extendMembership(id, request))),
  pause: (id, request) => respond(done(() => pauseMembership(id, request.days))),
  resume: (id) => respond(done(() => resumeMembership(id))),
  cancel: (id) => respond(done(() => cancelMembership(id))),
};
