import { catchError, map, of, startWith, type Observable } from 'rxjs';

export type Remote<T> = { status: 'loading' } | { status: 'ready'; data: T } | { status: 'error' };

export const remote = <T>(source$: Observable<T>): Observable<Remote<T>> =>
  source$.pipe(
    map((data): Remote<T> => ({ status: 'ready', data })),
    catchError(() => of<Remote<T>>({ status: 'error' })),
    startWith<Remote<T>>({ status: 'loading' }),
  );
