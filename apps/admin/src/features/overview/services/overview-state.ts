import type { AnalyticsRange } from '@gibigib/types';
import {
  BehaviorSubject,
  EMPTY,
  Subject,
  catchError,
  combineLatest,
  map,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { ALL_GYMS, gymIdOf } from '../../../shared/domain/scope';
import { remote } from '../../../shared/lib/remote';
import { livePoll$ } from '../../../shared/live/live-status';
import { overviewApi } from './overview-api';

export const scope$ = new BehaviorSubject<string>(ALL_GYMS);
export const range$ = new BehaviorSubject<AnalyticsRange>('30d');
const retry$ = new Subject<void>();

export const selectScope = (scope: string) => scope$.next(scope);
export const selectRange = (range: AnalyticsRange) => range$.next(range);
export const retryOverview = () => retry$.next();

const gymFilter$ = scope$.pipe(map(gymIdOf));

export const overview$ = combineLatest([gymFilter$, range$, retry$.pipe(startWith(undefined))]).pipe(
  switchMap(([gymId, range]) => remote(overviewApi.overview({ gymId, range }))),
  shareReplay({ bufferSize: 1, refCount: true }),
);

export const recentEntries$ = combineLatest([gymFilter$, livePoll$]).pipe(
  switchMap(([gymId]) => overviewApi.recentEntries(gymId).pipe(catchError(() => EMPTY))),
  shareReplay({ bufferSize: 1, refCount: true }),
);
