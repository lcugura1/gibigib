import type { LiveStatusDto } from '@gibigib/types';
import {
  EMPTY,
  Subject,
  catchError,
  defer,
  map,
  merge,
  of,
  shareReplay,
  switchMap,
  timer,
  type Observable,
} from 'rxjs';
import { sampleLiveStatus } from '../../features/overview/services/sample-data';
import type { NavStatus } from '../layout/navigation';
import { mockState } from '../mock/fixtures';

export const LIVE_POLL_MS = 30_000;

const fetchLiveStatus = (): Observable<LiveStatusDto> => defer(() => of(sampleLiveStatus(mockState === 'empty')));

export const livePoll$ = timer(0, LIVE_POLL_MS);

const liveRefresh$ = new Subject<void>();

export const refreshLiveStatus = () => liveRefresh$.next();

export const liveStatus$ = merge(livePoll$, liveRefresh$).pipe(
  switchMap(() => fetchLiveStatus().pipe(catchError(() => EMPTY))),
  shareReplay({ bufferSize: 1, refCount: true }),
);

export const navStatus$ = liveStatus$.pipe(
  map((live): NavStatus => ({ gymCount: live.gyms.length, offlineDevices: live.offlineDevices.length })),
);
