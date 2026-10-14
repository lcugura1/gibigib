import type { DevicesDto } from '@gibigib/types';
import { Subject, merge, shareReplay, timer } from 'rxjs';
import { LIVE_POLL_MS } from '../../../shared/live/live-status';
import { refreshable } from '../../../shared/lib/remote';
import { doorOpenings$ } from '../../gyms/services/gym-state';
import { devicesApi } from './devices-api';

const retry$ = new Subject<void>();

export const retryDevices = () => retry$.next();

export const devices$ = refreshable<DevicesDto>(
  merge(timer(LIVE_POLL_MS, LIVE_POLL_MS), retry$, doorOpenings$),
  devicesApi.devices,
).pipe(shareReplay({ bufferSize: 1, refCount: true }));
