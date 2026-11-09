import { catchError, map, of, startWith, switchMap, type Observable } from 'rxjs';

export type Remote<T> = { status: 'loading' } | { status: 'ready'; data: T } | { status: 'error' };

const settle = <T>(source$: Observable<T>): Observable<Remote<T>> =>
  source$.pipe(
    map((data): Remote<T> => ({ status: 'ready', data })),
    catchError(() => of<Remote<T>>({ status: 'error' })),
  );

export const remote = <T>(source$: Observable<T>): Observable<Remote<T>> =>
  settle(source$).pipe(startWith<Remote<T>>({ status: 'loading' }));

export const refreshable = <T>(refresh$: Observable<unknown>, fetch: () => Observable<T>): Observable<Remote<T>> =>
  refresh$.pipe(
    startWith(undefined),
    switchMap(() => settle(fetch())),
    startWith<Remote<T>>({ status: 'loading' }),
  );
