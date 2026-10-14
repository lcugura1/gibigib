import type { CatalogDto } from '@gibigib/types';
import { catchError, defer, of, retry, shareReplay, type Observable } from 'rxjs';
import { GYMS, PLANS } from '../mock/fixtures';
import { useObservable } from '../lib/use-observable';

const EMPTY_CATALOG: CatalogDto = { gyms: [], plans: [] };

const fetchCatalog = (): Observable<CatalogDto> =>
  defer(() =>
    of({
      gyms: GYMS.map(({ id, name, address }) => ({ id, name, address })),
      plans: PLANS.map(({ slug, name, price, durationDays }) => ({
        slug,
        name,
        price,
        durationDays,
        selfService: slug !== 'trener',
      })),
    }),
  );

export const catalog$ = fetchCatalog().pipe(
  retry({ count: 3, delay: 1000 }),
  catchError(() => of(EMPTY_CATALOG)),
  shareReplay(1),
);

export const useCatalog = () => useObservable(catalog$, EMPTY_CATALOG);
