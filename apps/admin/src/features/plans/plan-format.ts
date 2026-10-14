import type { PlanDto } from '@gibigib/types';
import { formatAmount, formatDays, formatInteger, pluralize } from '../../shared/lib/format';

export const formatPlanPrice = (price: number | null) => (price === null ? 'Na upit' : `${formatAmount(price)} €`);

export const formatPlanDuration = (days: number | null) => (days === null ? 'Po dogovoru' : formatDays(days));

export const membershipsNoun = (count: number) =>
  pluralize(count, { one: 'aktivna članarina', few: 'aktivne članarine', other: 'aktivnih članarina' });

export const formatMemberships = (count: number) => `${formatInteger(count)} ${membershipsNoun(count)}`;

export const popularSlug = (plans: readonly PlanDto[]) =>
  plans.reduce<PlanDto | undefined>(
    (top, plan) => (!top || plan.activeMembers > top.activeMembers ? plan : top),
    undefined,
  )?.slug;

export function planSummary(plan: PlanDto) {
  if (plan.pauseMaxDays > 0) {
    return `Pauza do ${formatDays(plan.pauseMaxDays)}, zatim ${formatDays(plan.pauseCooldownDays)} razmaka`;
  }
  return plan.description;
}
