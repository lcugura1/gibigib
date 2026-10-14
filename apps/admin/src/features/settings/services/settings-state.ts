import type { GymSettingsInput, PasswordChange, SettingsDto } from '@gibigib/types';
import { BehaviorSubject, Subject, firstValueFrom, shareReplay } from 'rxjs';
import { refreshLiveStatus } from '../../../shared/live/live-status';
import { refreshable } from '../../../shared/lib/remote';
import { settingsApi } from './settings-api';

const reload$ = new Subject<void>();

export const selectedGym$ = new BehaviorSubject<string | undefined>(undefined);

export const selectGym = (id: string) => selectedGym$.next(id);
export const retrySettings = () => reload$.next();

export const settings$ = refreshable<SettingsDto>(reload$, settingsApi.settings).pipe(
  shareReplay({ bufferSize: 1, refCount: true }),
);

async function run(action: Promise<unknown>) {
  await action;
  reload$.next();
  refreshLiveStatus();
}

export const saveGymSettings = (id: string, input: GymSettingsInput) =>
  run(firstValueFrom(settingsApi.saveGym(id, input)));

export const saveOccupancyWindow = (minutes: number) => run(firstValueFrom(settingsApi.saveOccupancyWindow(minutes)));

export const saveAccountEmail = (email: string) => run(firstValueFrom(settingsApi.saveEmail(email)));

export const changePassword = (change: PasswordChange) => firstValueFrom(settingsApi.changePassword(change));
