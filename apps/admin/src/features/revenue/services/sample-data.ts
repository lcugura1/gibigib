import type {
  AnalyticsRange,
  MemberListItemDto,
  PaymentLogDto,
  PaymentStatus,
  PaymentsPageDto,
  PaymentsQuery,
  RevenueDto,
  RevenueQuery,
} from '@gibigib/types';
import { GYMS, NOW, PLANS, PLAN_MIX, at, local, noise, type GymId } from '../../../shared/mock/fixtures';
import { stripeAccount } from '../../../shared/mock/stripe-account';
import { MEMBERS } from '../../members/services/sample-data';

type PlanSlug = (typeof PLANS)[number]['slug'];

const MONTHS = 12;
const GROWTH = [0.84, 0.85, 0.88, 0.9, 0.91, 0.92, 0.93, 0.92, 0.9, 0.91, 0.96, 1];
const ALL_MEMBERS = GYMS.reduce((sum, gym) => sum + gym.members, 0);

const NEW_MEMBERS: Record<AnalyticsRange, [value: number, delta: number]> = {
  today: [1, 0],
  '7d': [6, 1],
  '30d': [22, 3],
  '12m': [214, 31],
};

const RENEWALS: Record<AnalyticsRange, [value: number, deltaPercent: number]> = {
  today: [1, 0],
  '7d': [121, 1.8],
  '30d': [528, 3.2],
  '12m': [6118, 9.6],
};

const REVENUE_DELTA: Record<AnalyticsRange, number> = { today: 8, '7d': 2.6, '30d': 4.1, '12m': 14.2 };
const GYM_REVENUE_OFFSET: Record<GymId, number> = { v1: -0.9, v2: -5.9, z1: 1.9, z2: 0.3 };
const PER_MEMBER_DELTA: Record<AnalyticsRange, number> = { today: 0, '7d': 0.05, '30d': 0.35, '12m': 1.2 };
const RENEWAL_RATE: Record<GymId | 'all', number> = { v1: 93, v2: 90, z1: 92, z2: 91, all: 92 };

const scopedGyms = (gymId: string | undefined) => GYMS.filter((gym) => !gymId || gym.id === gymId);

const memberShare = (gymId: string | undefined) =>
  scopedGyms(gymId).reduce((sum, gym) => sum + gym.members, 0) / ALL_MEMBERS;

const planMrr = (gymId: GymId, planIndex: number) =>
  (PLAN_MIX[gymId][planIndex] ?? 0) * (PLANS[planIndex]?.monthlyPrice ?? 0);

const round2 = (value: number) => Math.round(value * 100) / 100;

function monthValue(gymIndex: number, planIndex: number, month: number) {
  const gym = GYMS[gymIndex];
  if (!gym) return 0;
  const jitter = month === MONTHS - 1 ? 1 : 0.97 + 0.06 * Math.abs(Math.sin(month * 3 + planIndex + gymIndex * 7));
  return round2(planMrr(gym.id, planIndex) * (GROWTH[month] ?? 1) * jitter);
}

const monthStarts = () =>
  Array.from({ length: MONTHS }, (_, i) => local(new Date(NOW.getFullYear(), NOW.getMonth() - (MONTHS - 1) + i, 1)));

function trendHistory(value: number, deltaPercent: number) {
  const start = value / (1 + deltaPercent / 100);
  return Array.from(
    { length: 7 },
    (_, i) => start + ((value - start) * i) / 6 + (noise(i + value) - 0.5) * value * 0.02,
  );
}

export function sampleRevenue({ gymId, range }: RevenueQuery): RevenueDto {
  const share = memberShare(gymId);
  const [newMembers, newDelta] = NEW_MEMBERS[range];
  const scopedNew = Math.round(newMembers * share);

  if (!stripeAccount.connected) return { stripe: 'disconnected', newMembers: scopedNew };

  const gyms = scopedGyms(gymId);
  const gymIndexes = gyms.map((gym) => GYMS.indexOf(gym));
  const byPlan = PLANS.map((plan, p) => ({
    key: plan.slug,
    values: Array.from({ length: MONTHS }, (_, m) =>
      round2(gymIndexes.reduce((sum, g) => sum + monthValue(g, p, m), 0)),
    ),
  }));
  const byGym = gyms.map((gym, i) => ({
    key: gym.id,
    values: Array.from({ length: MONTHS }, (_, m) =>
      round2(PLANS.reduce((sum, _, p) => sum + monthValue(gymIndexes[i] ?? 0, p, m), 0)),
    ),
  }));

  const mrr = gyms.reduce((sum, gym) => sum + PLANS.reduce((s, _, p) => s + planMrr(gym.id, p), 0), 0);
  const members = gyms.reduce((sum, gym) => sum + gym.members, 0);
  const total12m = byPlan.reduce((sum, s) => sum + s.values.reduce((a, b) => a + b, 0), 0);
  const todayPaid = paidToday(gymId).reduce((sum, p) => sum + p.amount, 0);
  const revenueByRange: Record<AnalyticsRange, number> = {
    today: todayPaid,
    '7d': (mrr * 7 * 1.04) / 30,
    '30d': mrr,
    '12m': total12m,
  };
  const revenueDelta = REVENUE_DELTA[range] + (gymId ? (GYM_REVENUE_OFFSET[gymId as GymId] ?? 0) : 0);
  const [renewals, renewalDelta] = RENEWALS[range];
  const scopedRenewals =
    range === 'today' ? Math.max(0, paidToday(gymId).length - scopedNew) : Math.round(renewals * share);
  const perMember = mrr / members;

  return {
    stripe: 'connected',
    asOf: local(NOW),
    revenue: {
      value: revenueByRange[range],
      delta: revenueDelta,
      history: trendHistory(revenueByRange[range], revenueDelta),
    },
    perMember: {
      value: perMember,
      delta: PER_MEMBER_DELTA[range],
      history: trendHistory(perMember, (PER_MEMBER_DELTA[range] / perMember) * 100),
    },
    newMembers: {
      value: scopedNew,
      delta: Math.round(newDelta * share),
      history: trendHistory(Math.max(scopedNew, 1), 15).map((v, i) => (i === 4 ? v * 1.25 : v)),
    },
    renewals: {
      value: scopedRenewals,
      delta: renewalDelta,
      rate: RENEWAL_RATE[(gymId as GymId | undefined) ?? 'all'],
      history: trendHistory(Math.max(scopedRenewals, 1), renewalDelta),
    },
    monthly: { months: monthStarts(), byPlan, byGym },
    breakdown: {
      month: local(new Date(NOW.getFullYear(), NOW.getMonth(), 1)),
      planSlugs: PLANS.map((plan) => plan.slug),
      rows: gyms.map((gym) => ({ gymId: gym.id, byPlan: PLANS.map((_, p) => round2(planMrr(gym.id, p))) })),
    },
  };
}

const memberByName = new Map(MEMBERS.map((member) => [member.name, member]));

const PAYMENT_SEEDS: readonly [Date, string, PlanSlug, string, PaymentStatus][] = [
  [at(10, 13, 17, 42), 'Mateo Kralj', 'mjesecno', 'Apple Pay', 'PAID'],
  [at(10, 13, 16, 10), 'Ivana Horvat', 'grupni', 'Kartica ·· 1881', 'PENDING'],
  [at(10, 13, 9, 3), 'Lana Tomić', 'trener', 'Google Pay', 'PAID'],
  [at(10, 12, 21, 15), 'Dario Matić', 'mjesecno', 'Kartica ·· 0442', 'FAILED'],
  [at(10, 12, 18, 40), 'Iva Šimić', 'godisnji', 'Apple Pay', 'PAID'],
  [at(10, 12, 11, 22), 'Hrvoje Radić', 'mjesecno', 'Kartica ·· 7310', 'REFUNDED'],
  [at(10, 11, 19, 57), 'Karla Pavić', 'grupni', 'Kartica ·· 5120', 'FAILED'],
  [at(10, 11, 8, 31), 'Borna Perković', 'mjesecno', 'Google Pay', 'PAID'],
  [at(10, 10, 9, 14), 'Ana Kovač', 'mjesecno', 'Apple Pay', 'PAID'],
  [at(10, 10, 7, 2), 'Nika Petrović', 'godisnji', 'Kartica ·· 9034', 'PAID'],
];

const OPEN_SEEDS: readonly [Date, PaymentStatus][] = [
  [at(10, 9, 20, 11), 'PENDING'],
  [at(10, 8, 12, 47), 'FAILED'],
  [at(10, 8, 7, 55), 'PENDING'],
  [at(10, 7, 18, 30), 'PENDING'],
];

const planOf = (slug: string) => PLANS.find((plan) => plan.slug === slug) ?? PLANS[0];

const activeMembers = MEMBERS.filter(
  (m) => m.status === 'ACTIVE' && !PAYMENT_SEEDS.some(([, name]) => name === m.name),
);

const METHODS = ['Apple Pay', 'Google Pay', 'Kartica'] as const;

function methodFor(seed: number) {
  const method = METHODS[Math.floor(noise(seed) * METHODS.length)] ?? 'Kartica';
  return method === 'Kartica' ? `Kartica ·· ${String(Math.floor(noise(seed + 1) * 9000) + 1000)}` : method;
}

function payment(
  id: string,
  date: Date,
  member: MemberListItemDto | undefined,
  name: string,
  slug: string,
  method: string,
  status: PaymentStatus,
): PaymentLogDto {
  const price = planOf(slug).price;
  return {
    id,
    at: local(date),
    memberId: member?.id ?? null,
    memberName: name,
    gymId: member?.homeGymId ?? 'v1',
    planSlug: slug,
    method,
    status,
    amount: status === 'REFUNDED' ? -price : price,
  };
}

const ALL_SEEDS: readonly PaymentLogDto[] = [
  ...PAYMENT_SEEDS.map(([date, name, slug, method, status], i) =>
    payment(`pay-${i}`, date, memberByName.get(name), name, slug, method, status),
  ),
  ...OPEN_SEEDS.map(([date, status], i) => {
    const member = activeMembers[(i * 37 + 11) % activeMembers.length];
    return payment(
      `pay-open-${i}`,
      date,
      member,
      member?.name ?? '',
      member?.planSlug ?? 'mjesecno',
      methodFor(i * 13),
      status,
    );
  }),
];

const paymentSeeds = (gymId: string | undefined) => ALL_SEEDS.filter((p) => !gymId || p.gymId === gymId);

const paidToday = (gymId: string | undefined) =>
  paymentSeeds(gymId).filter((p) => p.status === 'PAID' && new Date(p.at) >= rangeStart('today'));

const DAY_MS = 86_400_000;
const RANGE_DAYS: Record<Exclude<AnalyticsRange, 'today'>, number> = { '7d': 7, '30d': 30, '12m': 365 };

function rangeStart(range: AnalyticsRange) {
  return range === 'today' ? at(10, 13) : new Date(NOW.getTime() - RANGE_DAYS[range] * DAY_MS);
}

function generated(index: number, count: number, from: number, to: number, gymId: string | undefined): PaymentLogDto {
  const pool = activeMembers.filter((m) => !gymId || m.homeGymId === gymId);
  const member = pool[Math.floor(noise(index * 7 + 3) * pool.length)];
  const date = new Date(to - ((index + noise(index)) / count) * (to - from));
  return payment(
    `pay-g-${gymId ?? 'all'}-${index}`,
    date,
    member,
    member?.name ?? '',
    member?.planSlug ?? 'mjesecno',
    methodFor(index * 5),
    'PAID',
  );
}

export function samplePayments(query: PaymentsQuery): PaymentsPageDto {
  const start = rangeStart(query.range);
  const seeds = paymentSeeds(query.gymId).filter((p) => new Date(p.at) >= start);
  const pending = seeds.filter((p) => p.status === 'PENDING');
  const failed = seeds.filter((p) => p.status === 'FAILED');
  const share = memberShare(query.gymId);
  const expected = Math.round((NEW_MEMBERS[query.range][0] + RENEWALS[query.range][0]) * share);
  const total =
    query.range === 'today' ? seeds.length : Math.max(seeds.length, expected + pending.length + failed.length);
  const oldest = seeds.at(-1);
  const to = oldest ? new Date(oldest.at).getTime() : NOW.getTime();
  const extra = total - seeds.length;
  const itemAt = (index: number) =>
    seeds[index] ?? generated(index - seeds.length, extra, start.getTime(), to, query.gymId);

  const first = (query.page - 1) * query.pageSize;
  const selected = query.status === 'pending' ? pending : query.status === 'failed' ? failed : null;
  const length = selected ? selected.length : total;
  const items = selected
    ? selected.slice(first, first + query.pageSize)
    : Array.from({ length: Math.max(0, Math.min(query.pageSize, total - first)) }, (_, i) => itemAt(first + i));

  return {
    items,
    page: query.page,
    pageSize: query.pageSize,
    total: length,
    counts: { all: total, pending: pending.length, failed: failed.length },
  };
}

const PAYMENT_CSV: Record<PaymentStatus, string> = {
  PAID: 'Plaćeno',
  PENDING: 'Na čekanju',
  FAILED: 'Neuspjelo',
  REFUNDED: 'Povrat',
};

const csvCell = (value: string) => `"${value.replaceAll('"', '""')}"`;

export function samplePaymentsCsv(query: Omit<PaymentsQuery, 'page' | 'pageSize'>) {
  const { items } = samplePayments({ ...query, page: 1, pageSize: Number.MAX_SAFE_INTEGER });
  const gymName = (id: string) => GYMS.find((gym) => gym.id === id)?.name ?? '';
  const header = ['Datum', 'Član', 'Teretana', 'Plan', 'Način', 'Status', 'Iznos (EUR)'];
  const rows = items.map((p) => [
    p.at.replace('T', ' ').slice(0, 16),
    p.memberName,
    gymName(p.gymId),
    planOf(p.planSlug).name,
    p.method,
    PAYMENT_CSV[p.status],
    p.amount.toFixed(2).replace('.', ','),
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n');
}
