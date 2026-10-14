import type { AnalyticsRange } from '@gibigib/types';
import {
  BehaviorSubject,
  EMPTY,
  catchError,
  Subject,
  concat,
  filter,
  firstValueFrom,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  timer,
} from 'rxjs';
import { remote } from '../../../shared/lib/remote';
import { livePoll$ } from '../../../shared/live/live-status';
import { gymApi } from './gym-api';

const DOOR_UNLOCK_MS = 5_000;

export const range$ = new BehaviorSubject<AnalyticsRange>('30d');
export const selectRange = (range: AnalyticsRange) => range$.next(range);

const retry$ = new Subject<string>();
export const retryGym = (gymId: string) => retry$.next(gymId);
const retries = (gymId: string) =>
  retry$.pipe(
    filter((id) => id === gymId),
    startWith(gymId),
  );

export const gymDetail$ = (gymId: string) =>
  retries(gymId).pipe(
    switchMap(() =>
      livePoll$.pipe(
        switchMap(() => gymApi.detail(gymId)),
        remote,
      ),
    ),
  );

export const gymAnalytics$ = (gymId: string) =>
  retries(gymId).pipe(
    switchMap(() => range$),
    switchMap((range) => remote(gymApi.analytics(gymId, range))),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

export const gymEntries$ = (gymId: string) =>
  livePoll$.pipe(switchMap(() => gymApi.recentEntries(gymId).pipe(catchError(() => EMPTY))));

const doorOpened$ = new Subject<string>();

export const doorUnlocked$ = (gymId: string) =>
  doorOpened$.pipe(
    filter((id) => id === gymId),
    switchMap(() => concat(of(true), timer(DOOR_UNLOCK_MS).pipe(map(() => false)))),
    startWith(false),
  );

export async function openDoor(gymId: string) {
  await firstValueFrom(gymApi.openDoor(gymId));
  doorOpened$.next(gymId);
}
