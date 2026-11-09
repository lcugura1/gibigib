import { catchError, map, of, scan, startWith, switchMap, type Observable } from 'rxjs';

export interface PageRequest {
  page: number;
  append: boolean;
}

export interface Page {
  items: readonly unknown[];
  page: number;
}

export type PagedView<P extends Page> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; page: P; items: P['items']; loadingMore: boolean; loadMoreFailed: boolean };

type PageEvent<P> =
  | { kind: 'loading'; append: boolean }
  | { kind: 'data'; append: boolean; page: P }
  | { kind: 'error'; append: boolean };

function reduce<P extends Page>(view: PagedView<P>, event: PageEvent<P>): PagedView<P> {
  const appending = event.append && view.status === 'ready';
  switch (event.kind) {
    case 'loading':
      return appending ? { ...view, loadingMore: true, loadMoreFailed: false } : { status: 'loading' };
    case 'error':
      return appending ? { ...view, loadingMore: false, loadMoreFailed: true } : { status: 'error' };
    case 'data':
      return {
        status: 'ready',
        page: event.page,
        items: appending ? [...view.items, ...event.page.items] : event.page.items,
        loadingMore: false,
        loadMoreFailed: false,
      };
  }
}

export function pagedList<P extends Page>(
  requests$: Observable<PageRequest>,
  fetchPage: (page: number) => Observable<P>,
): Observable<PagedView<P>> {
  return requests$.pipe(
    startWith<PageRequest>({ page: 1, append: false }),
    switchMap(({ page, append }) =>
      fetchPage(page).pipe(
        map((data): PageEvent<P> => ({ kind: 'data', append, page: data })),
        catchError(() => of<PageEvent<P>>({ kind: 'error', append })),
        startWith<PageEvent<P>>({ kind: 'loading', append }),
      ),
    ),
    scan<PageEvent<P>, PagedView<P>>(reduce, { status: 'loading' }),
  );
}
