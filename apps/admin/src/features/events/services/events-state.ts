import type { EventInput, EventStatus, EventsDto } from '@gibigib/types';
import { BehaviorSubject, Subject, firstValueFrom, shareReplay } from 'rxjs';
import { refreshable } from '../../../shared/lib/remote';
import { eventsApi } from './events-api';

export const NEW_EVENT = 'nova';

export type EventFilter = 'all' | EventStatus;

const reload$ = new Subject<void>();

export const filter$ = new BehaviorSubject<EventFilter>('all');

export const selectFilter = (filter: EventFilter) => filter$.next(filter);
export const retryEvents = () => reload$.next();

export const events$ = refreshable<EventsDto>(reload$, eventsApi.events).pipe(
  shareReplay({ bufferSize: 1, refCount: true }),
);

export async function saveEvent(id: string | null, input: EventInput, status: EventStatus) {
  const saved = await firstValueFrom(eventsApi.save(id, input, status));
  reload$.next();
  return saved;
}

export async function removeEvent(id: string) {
  await firstValueFrom(eventsApi.remove(id));
  reload$.next();
}
