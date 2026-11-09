import type { TrainerInput, TrainersDto } from '@gibigib/types';
import { Subject, firstValueFrom, shareReplay } from 'rxjs';
import { refreshable } from '../../../shared/lib/remote';
import { trainersApi } from './trainers-api';

export const NEW_TRAINER = 'novi';

const reload$ = new Subject<void>();

export const retryTrainers = () => reload$.next();

export const trainers$ = refreshable<TrainersDto>(reload$, trainersApi.trainers).pipe(
  shareReplay({ bufferSize: 1, refCount: true }),
);

export async function saveTrainer(id: string | null, input: TrainerInput) {
  const saved = await firstValueFrom(trainersApi.save(id, input));
  reload$.next();
  return saved;
}

export async function removeTrainer(id: string) {
  await firstValueFrom(trainersApi.remove(id));
  reload$.next();
}
