import type { EntryLogDto, LiveStatusDto, OverviewDto, OverviewQuery } from '@gibigib/types';
import { defer, of, type Observable } from 'rxjs';
import { sampleEntries, sampleLiveStatus, sampleOverview } from './sample-data';

export interface OverviewApi {
  overview(query: OverviewQuery): Observable<OverviewDto>;
  liveStatus(): Observable<LiveStatusDto>;
  recentEntries(gymId: string | undefined): Observable<EntryLogDto[]>;
}

export const overviewApi: OverviewApi = {
  overview: (query) => defer(() => of(sampleOverview(query))),
  liveStatus: () => defer(() => of(sampleLiveStatus())),
  recentEntries: (gymId) => defer(() => of(sampleEntries(gymId))),
};
