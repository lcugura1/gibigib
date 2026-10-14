import type { CatalogDto } from '@gibigib/types';
import { map, shareReplay } from 'rxjs';
import { GYMS } from '../mock/fixtures';
import { planRecords$ } from '../mock/plan-store';
import { useObservable } from '../lib/use-observable';

const EMPTY_CATALOG: CatalogDto = { gyms: [], plans: [] };

export const catalog$ = planRecords$.pipe(
  map((plans): CatalogDto => ({
    gyms: GYMS.map(({ id, name, address }) => ({ id, name, address })),
    plans: plans.map(({ slug, name, price, durationDays }) => ({
      slug,
      name,
      price: price ?? 0,
      durationDays: durationDays ?? 30,
      selfService: price !== null,
    })),
  })),
  shareReplay(1),
);

export const useCatalog = () => useObservable(catalog$, EMPTY_CATALOG);
