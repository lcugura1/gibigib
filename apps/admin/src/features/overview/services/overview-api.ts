import type { EntryLogDto, OverviewDto, OverviewQuery } from '@gibigib/types';
import { NEVER, defer, of, throwError, type Observable } from 'rxjs';
import { mockState } from '../../../shared/mock/fixtures';
import { sampleRecentEntries } from '../../entries/services/sample-data';
import { sampleLateEntries, sampleOverview } from './sample-data';

export interface OverviewApi {
  overview(query: OverviewQuery): Observable<OverviewDto>;
  recentEntries(gymId: string | undefined): Observable<EntryLogDto[]>;
}

const empty = mockState === 'empty';
const RECENT_ENTRIES = 7;

function mockOverview(query: OverviewQuery): Observable<OverviewDto> {
  if (mockState === 'loading') return NEVER;
  if (mockState === 'error') return throwError(() => new Error('Mock server unavailable'));
  return defer(() => of(sampleOverview(query, empty)));
}

export const overviewApi: OverviewApi = {
  overview: mockOverview,
  recentEntries: (gymId) =>
    defer(() => of(empty ? sampleLateEntries(gymId) : sampleRecentEntries(gymId, RECENT_ENTRIES))),
};
