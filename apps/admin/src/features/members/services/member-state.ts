import type { MemberDetailDto, MemberVisitsDto } from '@gibigib/types';
import { Subject, catchError, filter, firstValueFrom, map, of, startWith, switchMap, type Observable } from 'rxjs';
import { NotFoundError } from '../../../shared/mock/respond';
import { memberApi } from './member-api';

export type MemberView =
  { status: 'loading' } | { status: 'notFound' } | { status: 'error' } | { status: 'ready'; member: MemberDetailDto };

export type VisitsView = { status: 'loading' } | { status: 'error' } | { status: 'ready'; visits: MemberVisitsDto };

const refresh$ = new Subject<string>();
const retry$ = new Subject<string>();

export const retryMember = (id: string) => retry$.next(id);

export const memberDetail$ = (id: string): Observable<MemberView> =>
  retry$.pipe(
    filter((target) => target === id),
    startWith(id),
    switchMap(() =>
      refresh$.pipe(
        filter((target) => target === id),
        startWith(id),
        switchMap(() => memberApi.detail(id)),
        map((member): MemberView => ({ status: 'ready', member })),
        catchError((error: unknown) =>
          of<MemberView>(error instanceof NotFoundError ? { status: 'notFound' } : { status: 'error' }),
        ),
        startWith<MemberView>({ status: 'loading' }),
      ),
    ),
  );

export const memberVisits$ = (id: string, month: string): Observable<VisitsView> =>
  refresh$.pipe(
    filter((target) => target === id),
    startWith(id),
    switchMap(() => memberApi.visits(id, month)),
    map((visits): VisitsView => ({ status: 'ready', visits })),
    catchError(() => of<VisitsView>({ status: 'error' })),
    startWith<VisitsView>({ status: 'loading' }),
  );

export async function runMemberAction(id: string, action: Observable<true>) {
  await firstValueFrom(action);
  refresh$.next(id);
}

export const revealMemberOib = (id: string) => firstValueFrom(memberApi.revealOib(id));
