import type { AnalyticsRange, EntryLogDto, GymDetailDto, OverviewDto } from '@gibigib/types';
import type { Observable } from 'rxjs';
import { GYMS } from '../../../shared/mock/fixtures';
import { recordChange } from '../../audit/services/audit-store';
import { respond } from '../../../shared/mock/respond';
import { sampleRecentEntries } from '../../entries/services/sample-data';
import { sampleOverview } from '../../overview/services/sample-data';
import { sampleGymDetail } from './sample-data';

const RECENT_ENTRIES = 6;

export interface GymApi {
  detail(gymId: string): Observable<GymDetailDto>;
  analytics(gymId: string, range: AnalyticsRange): Observable<OverviewDto>;
  recentEntries(gymId: string): Observable<EntryLogDto[]>;
  openDoor(gymId: string): Observable<true>;
}

const known = (gymId: string) => GYMS.some((gym) => gym.id === gymId);

const forGym = <T>(gymId: string, produce: () => T) => respond(() => (known(gymId) ? produce() : undefined));

export const gymApi: GymApi = {
  detail: (gymId) => respond(() => sampleGymDetail(gymId)),
  analytics: (gymId, range) => forGym(gymId, () => sampleOverview({ gymId, range })),
  recentEntries: (gymId) => forGym(gymId, () => sampleRecentEntries(gymId, RECENT_ENTRIES)),
  openDoor: (gymId) =>
    forGym(gymId, () => {
      recordChange({ kind: 'DEVICE', title: 'Ručno otvorena vrata', details: ['glavni ulaz'], gymId });
      return true as const;
    }),
};
