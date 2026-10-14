import type { AnalyticsRange, EntriesPageDto, EntryResultFilter } from '@gibigib/types';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  firstValueFrom,
  shareReplay,
  startWith,
  switchMap,
  timer,
} from 'rxjs';
import { ALL_GYMS, gymIdOf } from '../../../shared/domain/scope';
import { pagedList, type PageRequest, type PagedView } from '../../../shared/lib/paged-list';
import { entriesApi, type EntriesCriteria } from './entries-api';

export const PAGE_SIZE = 15;
const LIVE_REFRESH_MS = 15_000;

export type EntriesView = PagedView<EntriesPageDto>;

export const scope$ = new BehaviorSubject<string>(ALL_GYMS);
export const range$ = new BehaviorSubject<AnalyticsRange>('today');
export const result$ = new BehaviorSubject<EntryResultFilter>('all');
const pageRequest$ = new Subject<PageRequest>();
const retry$ = new Subject<void>();

export const selectScope = (scope: string) => scope$.next(scope);
export const selectRange = (range: AnalyticsRange) => range$.next(range);
export const selectResult = (result: EntryResultFilter) => result$.next(result);
export const goToPage = (page: number) => pageRequest$.next({ page, append: false });
export const loadOlder = (page: number) => pageRequest$.next({ page, append: true });
export const retryEntries = () => retry$.next();

const currentCriteria = (): EntriesCriteria => ({
  gymId: gymIdOf(scope$.value),
  range: range$.value,
  result: result$.value,
});

export const isLive = (range: AnalyticsRange, page: number) => range === 'today' && page === 1;

export const entries$ = combineLatest([scope$, range$, result$, retry$.pipe(startWith(undefined))]).pipe(
  switchMap(([scope, range, result]) => {
    const criteria: EntriesCriteria = { gymId: gymIdOf(scope), range, result };
    const fetch = (page: number) => entriesApi.entries({ ...criteria, page, pageSize: PAGE_SIZE });
    return pagedList(pageRequest$, (page) =>
      isLive(range, page) ? timer(0, LIVE_REFRESH_MS).pipe(switchMap(() => fetch(page))) : fetch(page),
    );
  }),
  shareReplay({ bufferSize: 1, refCount: true }),
);

export const exportEntriesCsv = () => firstValueFrom(entriesApi.exportCsv(currentCriteria()));
