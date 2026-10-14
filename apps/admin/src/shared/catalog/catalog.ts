import type { CatalogDto } from '@gibigib/types';
import { combineLatest, map, shareReplay } from 'rxjs';
import { gymRecords$ } from '../mock/gym-store';
import { planRecords$ } from '../mock/plan-store';
import { useObservable } from '../lib/use-observable';

const EMPTY_CATALOG: CatalogDto = { gyms: [], plans: [] };

export const catalog$ = combineLatest([gymRecords$, planRecords$]).pipe(
  map(([gyms, plans]): CatalogDto => ({
    gyms: gyms.map(({ id, name, street }) => ({ id, name, address: street })),
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
