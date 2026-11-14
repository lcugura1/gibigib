import type { MembersPageDto, MembersQuery } from '@gibigib/types';
import type { Observable } from 'rxjs';
import { respond } from '../../../shared/mock/respond';
import { sampleMembers, sampleMembersCsv } from './sample-data';

export type MembersCriteria = Omit<MembersQuery, 'page' | 'pageSize'>;

export interface MembersApi {
  members(query: MembersQuery): Observable<MembersPageDto>;
  exportCsv(criteria: MembersCriteria): Observable<string>;
}

export const membersApi: MembersApi = {
  members: (query) => respond(() => sampleMembers(query)),
  exportCsv: (criteria) => respond(() => sampleMembersCsv({ ...criteria, page: 1, pageSize: 1 })),
};
