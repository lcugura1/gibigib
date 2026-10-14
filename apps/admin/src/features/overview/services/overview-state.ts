import type { OverviewDto, OverviewRange } from '@gibigib/types';
import {
  BehaviorSubject,
  EMPTY,
  Subject,
  catchError,
  combineLatest,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  timer,
} from 'rxjs';
import { overviewApi } from './overview-api';

export const ALL_GYMS = 'all';

const LIVE_POLL_MS = 30_000;

export type Remote<T> = { status: 'ready'; data: T } | { status: 'error' };

export const scope$ = new BehaviorSubject<string>(ALL_GYMS);
export const range$ = new BehaviorSubject<OverviewRange>('30d');
const retry$ = new Subject<void>();

export const selectScope = (scope: string) => scope$.next(scope);
export const selectRange = (range: OverviewRange) => range$.next(range);
export const retryOverview = () => retry$.next();

const gymFilter$ = scope$.pipe(map((scope) => (scope === ALL_GYMS ? undefined : scope)));

export const overview$ = combineLatest([gymFilter$, range$, retry$.pipe(startWith(undefined))]).pipe(
  switchMap(([gymId, range]) =>
    overviewApi.overview({ gymId, range }).pipe(
      map((data): Remote<OverviewDto> => ({ status: 'ready', data })),
      catchError(() => of<Remote<OverviewDto>>({ status: 'error' })),
    ),
  ),
  shareReplay({ bufferSize: 1, refCount: true }),
);

const livePoll$ = timer(0, LIVE_POLL_MS);

export const liveStatus$ = livePoll$.pipe(
  switchMap(() => overviewApi.liveStatus().pipe(catchError(() => EMPTY))),
  shareReplay({ bufferSize: 1, refCount: true }),
);

export const recentEntries$ = combineLatest([gymFilter$, livePoll$]).pipe(
  switchMap(([gymId]) => overviewApi.recentEntries(gymId).pipe(catchError(() => EMPTY))),
  shareReplay({ bufferSize: 1, refCount: true }),
);
