import type { PlanInput, PlansDto } from '@gibigib/types';
import { recordChange } from '../../audit/services/audit-store';
import type { Observable } from 'rxjs';
import { GYMS } from '../../../shared/mock/fixtures';
import { planActiveMembers, planRecords$, type PlanRecord } from '../../../shared/mock/plan-store';
import { formatPlanDuration, formatPlanPrice } from '../plan-format';
import { respond } from '../../../shared/mock/respond';
import { slugify } from '../../../shared/lib/text';

export interface PlansApi {
  plans(): Observable<PlansDto>;
  save(slug: string | null, input: PlanInput): Observable<string>;
  setVisible(slug: string, visible: boolean): Observable<true>;
}

function uniqueSlug(name: string) {
  const base = slugify(name) || 'plan';
  const taken = new Set(planRecords$.value.map((plan) => plan.slug));
  let slug = base;
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
  return slug;
}

function changedFields(before: PlanRecord, after: PlanInput) {
  const changes: string[] = [];
  if (before.name !== after.name) changes.push(`naziv ${before.name} → ${after.name}`);
  if (before.price !== after.price)
    changes.push(`cijena ${formatPlanPrice(before.price)} → ${formatPlanPrice(after.price)}`);
  if (before.durationDays !== after.durationDays)
    changes.push(`trajanje ${formatPlanDuration(before.durationDays)} → ${formatPlanDuration(after.durationDays)}`);
  if (before.pauseMaxDays !== after.pauseMaxDays || before.pauseCooldownDays !== after.pauseCooldownDays)
    changes.push('pravila pauze');
  if (before.description !== after.description) changes.push('opis u aplikaciji');
  if (before.visible !== after.visible) changes.push(after.visible ? 'prikazan u aplikaciji' : 'skriven iz aplikacije');
  return changes;
}

function samplePlans(): PlansDto {
  const plans = planRecords$.value.map((plan) => ({ ...plan, activeMembers: planActiveMembers(plan.slug) }));
  return {
    plans,
    activeMemberships: plans.reduce((sum, plan) => sum + plan.activeMembers, 0),
    gymCount: GYMS.length,
  };
}

export const plansApi: PlansApi = {
  plans: () => respond(samplePlans),
  save: (slug, input) =>
    respond(() => {
      const target = slug ?? uniqueSlug(input.name);
      const records = planRecords$.value;
      const before = records.find((plan) => plan.slug === slug);
      recordChange(
        before
          ? {
              kind: 'PLAN',
              title: 'Izmijenjen plan',
              details: [before.name, ...changedFields(before, input)],
              gymId: null,
            }
          : { kind: 'PLAN', title: 'Dodan plan', details: [input.name, formatPlanPrice(input.price)], gymId: null },
      );
      planRecords$.next(
        slug
          ? records.map((plan) => (plan.slug === slug ? { ...input, slug } : plan))
          : [...records, { ...input, slug: target }],
      );
      return target;
    }),
  setVisible: (slug, visible) =>
    respond(() => {
      const plan = planRecords$.value.find((record) => record.slug === slug);
      if (!plan) return undefined;
      planRecords$.next(planRecords$.value.map((record) => (record.slug === slug ? { ...record, visible } : record)));
      recordChange({
        kind: 'PLAN',
        title: visible ? 'Plan prikazan u aplikaciji' : 'Plan skriven iz aplikacije',
        details: [plan.name],
        gymId: null,
      });
      return true as const;
    }),
};
