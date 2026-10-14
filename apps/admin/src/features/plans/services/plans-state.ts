import type { PlanInput, PlansDto } from '@gibigib/types';
import { Subject, firstValueFrom, shareReplay } from 'rxjs';
import { refreshable } from '../../../shared/lib/remote';
import { plansApi } from './plans-api';

export const NEW_PLAN = 'novi';

const reload$ = new Subject<void>();

export const retryPlans = () => reload$.next();

export const plans$ = refreshable<PlansDto>(reload$, plansApi.plans).pipe(
  shareReplay({ bufferSize: 1, refCount: true }),
);

export async function savePlan(slug: string | null, input: PlanInput) {
  const saved = await firstValueFrom(plansApi.save(slug, input));
  reload$.next();
  return saved;
}

export async function setPlanVisible(slug: string, visible: boolean) {
  await firstValueFrom(plansApi.setVisible(slug, visible));
  reload$.next();
}
