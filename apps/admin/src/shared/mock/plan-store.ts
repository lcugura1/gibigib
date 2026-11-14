import type { PlanInput } from '@gibigib/types';
import { BehaviorSubject } from 'rxjs';
import { PLANS, PLAN_MIX } from './fixtures';

export interface PlanRecord extends PlanInput {
  slug: string;
}

const DESCRIPTIONS: Record<string, string> = {
  mjesecno: 'Neograničen ulaz u sve četiri teretane. Pauza do 7 dana.',
  grupni: 'Grupni treninzi uz ulaz u teretanu',
  godisnji: 'Jednokratno plaćanje · uštedi 109,88 €',
  trener: 'Individualni treninzi, cijena po dogovoru',
};

const ON_REQUEST = new Set(['trener']);

export const planRecords$ = new BehaviorSubject<readonly PlanRecord[]>(
  PLANS.map((plan) => ({
    slug: plan.slug,
    name: plan.name,
    price: ON_REQUEST.has(plan.slug) ? null : plan.price,
    durationDays: ON_REQUEST.has(plan.slug) ? null : plan.durationDays,
    pauseMaxDays: plan.slug === 'mjesecno' ? 7 : 0,
    pauseCooldownDays: plan.slug === 'mjesecno' ? 30 : 0,
    description: DESCRIPTIONS[plan.slug] ?? '',
    visible: true,
  })),
);

export function planActiveMembers(slug: string) {
  const index = PLANS.findIndex((plan) => plan.slug === slug);
  return index < 0 ? 0 : Object.values(PLAN_MIX).reduce((sum, mix) => sum + (mix[index] ?? 0), 0);
}
