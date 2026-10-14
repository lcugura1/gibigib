import type {
  AttentionItemDto,
  EntryLogDto,
  LiveStatusDto,
  OverviewDto,
  OverviewQuery,
  AnalyticsRange,
} from '@gibigib/types';
import { GYMS, NOW, PLANS, PLAN_MIX, at, local, noise, type GymId } from '../../../shared/mock/fixtures';

const EARLY_MORNING = new Date(2026, 9, 13, 6, 5);

const clock = (empty: boolean) => (empty ? EARLY_MORNING : NOW);

const MEMBER_DELTA: Record<AnalyticsRange, Record<GymId, number>> = {
  today: { v1: 1, v2: 0, z1: 1, z2: 0 },
  '7d': { v1: 3, v2: -1, z1: 5, z2: 2 },
  '30d': { v1: 6, v2: -4, z1: 15, z2: 6 },
  '12m': { v1: 31, v2: -6, z1: 62, z2: 31 },
};

const REVENUE_DELTA: Record<GymId | 'all', number> = { v1: 3.2, v2: -1.8, z1: 6.0, z2: 4.4, all: 4.1 };

const CHURN: Record<GymId | 'all', readonly [value: number, delta: number]> = {
  v1: [2.1, -0.4],
  v2: [3.4, 0.6],
  z1: [2.2, -0.5],
  z2: [2.6, -0.2],
  all: [2.4, -0.3],
};

const ARRIVALS_DELTA: Record<AnalyticsRange, number> = { today: 2.4, '7d': 3.1, '30d': 5.6, '12m': 8.2 };

const WEEKDAY_FACTOR = [1.1, 1.05, 1, 1, 0.85, 0.6, 0.45];
const SEASON = [1.18, 1.12, 1.06, 1.0, 0.95, 0.86, 0.78, 0.74, 0.98, 1.05, 1.04, 0.9];
const FIRST_HOUR = 6;
const LAST_HOUR = 23;

const ATTENTION_TOTALS = { expiring: 12, inactive: 31, paused: 9, failedPayment: 3 };

const ATTENTION: readonly AttentionItemDto[] = [
  {
    kind: 'expiring',
    memberId: 'm1',
    name: 'Petra Jurić',
    gymId: 'v1',
    planName: 'Mjesečno',
    expiresAt: local(at(10, 14)),
  },
  {
    kind: 'expiring',
    memberId: 'm2',
    name: 'Luka Novak',
    gymId: 'z1',
    planName: 'Godišnji',
    expiresAt: local(at(10, 15)),
  },
  {
    kind: 'expiring',
    memberId: 'm3',
    name: 'Ivana Horvat',
    gymId: 'z2',
    planName: 'Grupni program',
    expiresAt: local(at(10, 16)),
  },
  {
    kind: 'expiring',
    memberId: 'm4',
    name: 'Tomislav Marić',
    gymId: 'z1',
    planName: 'Mjesečno',
    expiresAt: local(at(10, 17)),
  },
  {
    kind: 'expiring',
    memberId: 'm5',
    name: 'Maja Knežević',
    gymId: 'v2',
    planName: 'Mjesečno',
    expiresAt: local(at(10, 19)),
  },
  { kind: 'inactive', memberId: 'm6', name: 'Ante Pavlović', gymId: 'z1', planName: 'Mjesečno', daysSinceVisit: 22 },
  { kind: 'inactive', memberId: 'm7', name: 'Nikolina Vuković', gymId: 'v1', planName: 'Godišnji', daysSinceVisit: 19 },
  { kind: 'inactive', memberId: 'm8', name: 'Josip Kovačević', gymId: 'z2', planName: 'Mjesečno', daysSinceVisit: 17 },
  {
    kind: 'inactive',
    memberId: 'm9',
    name: 'Lucija Blažević',
    gymId: 'z1',
    planName: 'Grupni program',
    daysSinceVisit: 15,
  },
  { kind: 'inactive', memberId: 'm10', name: 'Filip Šarić', gymId: 'v2', planName: 'Mjesečno', daysSinceVisit: 14 },
  {
    kind: 'paused',
    memberId: 'm11',
    name: 'Sara Božić',
    gymId: 'v1',
    planName: 'Mjesečno',
    pausedUntil: local(at(10, 18)),
  },
  {
    kind: 'paused',
    memberId: 'm12',
    name: 'Ivan Perić',
    gymId: 'z2',
    planName: 'Mjesečno',
    pausedUntil: local(at(10, 16)),
  },
  {
    kind: 'paused',
    memberId: 'm13',
    name: 'Marko Babić',
    gymId: 'z1',
    planName: 'Godišnji',
    pausedUntil: local(at(10, 20)),
  },
  {
    kind: 'paused',
    memberId: 'm14',
    name: 'Ema Grgić',
    gymId: 'z1',
    planName: 'Mjesečno',
    pausedUntil: local(at(10, 22)),
  },
  {
    kind: 'failedPayment',
    memberId: 'm15',
    name: 'Dario Matić',
    gymId: 'z2',
    planName: 'Mjesečno',
    amount: 29.99,
    failedAt: local(at(10, 12)),
    reason: 'declined',
  },
  {
    kind: 'failedPayment',
    memberId: 'm16',
    name: 'Karla Pavić',
    gymId: 'v1',
    planName: 'Grupni program',
    amount: 39.99,
    failedAt: local(at(10, 11)),
    reason: 'declined',
  },
  {
    kind: 'failedPayment',
    memberId: 'm17',
    name: 'Hrvoje Radić',
    gymId: 'z1',
    planName: 'Mjesečno',
    amount: 29.99,
    failedAt: local(at(10, 10)),
    reason: 'cardExpired',
  },
];

const late = (id: string, hour: number, minute: number, memberName: string, gymId: GymId): EntryLogDto => ({
  id,
  at: local(at(10, 12, hour, minute)),
  memberId: null,
  memberName,
  gymId,
  device: 'Čitač · glavni ulaz',
  approved: true,
  denialReason: null,
});

const LATE_ENTRIES: readonly EntryLogDto[] = [
  late('l1', 22, 47, 'Mateo Kralj', 'z1'),
  late('l2', 22, 31, 'Lana Tomić', 'z2'),
  late('l3', 22, 12, 'Iva Šimić', 'v1'),
];

export function hourlyProfile(hour: number, weekday: number) {
  if (weekday < 5) {
    const f =
      0.12 +
      0.75 * Math.exp(-((hour - 7.8) ** 2) / 2.2) +
      1.0 * Math.exp(-((hour - 18.4) ** 2) / 3.4) +
      0.28 * Math.exp(-((hour - 12.5) ** 2) / 3);
    return weekday === 4 && hour >= 16 ? f * 0.8 : f;
  }
  const f = 0.08 + 0.7 * Math.exp(-((hour - 10.5) ** 2) / 5) + 0.32 * Math.exp(-((hour - 17) ** 2) / 4);
  return weekday === 6 ? f * 0.75 : f;
}

const HOURS = Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, i) => FIRST_HOUR + i);
const PROFILE_SUM = HOURS.reduce((sum, hour) => sum + hourlyProfile(hour, 0), 0);
const mondayIndex = (date: Date) => (date.getDay() + 6) % 7;
const daysAgo = (days: number) => new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - days);

function arrivalBuckets(range: AnalyticsRange, now: Date): Date[] {
  switch (range) {
    case 'today':
      return Array.from({ length: now.getHours() - FIRST_HOUR + 1 }, (_, i) => at(10, 13, FIRST_HOUR + i));
    case '12m':
      return Array.from({ length: 12 }, (_, i) => new Date(NOW.getFullYear(), NOW.getMonth() - 11 + i, 1));
    case '7d':
    case '30d': {
      const days = range === '7d' ? 7 : 30;
      return Array.from({ length: days }, (_, i) => daysAgo(days - 1 - i));
    }
  }
}

function arrivalsFor(members: number, range: AnalyticsRange, buckets: readonly Date[]) {
  const base = members * 0.42;
  return buckets.map((bucket, i) => {
    if (range === 'today') {
      const hour = bucket.getHours();
      return Math.round(((base * 1.05 * hourlyProfile(hour, 1)) / PROFILE_SUM) * (0.9 + 0.2 * noise(hour + members)));
    }
    if (range === '12m') {
      return Math.round(base * 26 * (SEASON[bucket.getMonth()] ?? 1) * (0.96 + 0.08 * noise(i + members)));
    }
    return Math.round(base * (WEEKDAY_FACTOR[mondayIndex(bucket)] ?? 1) * (0.92 + 0.16 * noise(i * 7 + members)));
  });
}

function trendHistory(value: number, delta: number, seed: number) {
  return Array.from({ length: 7 }, (_, i) =>
    i === 6 ? value : value - (delta * (6 - i)) / 6 + (noise(i + seed) - 0.5) * Math.max(2, Math.abs(delta) / 4),
  );
}

function attentionGroup(kind: AttentionItemDto['kind'], gymId: string | undefined) {
  const items = ATTENTION.filter((item) => item.kind === kind && (!gymId || item.gymId === gymId));
  return { total: gymId ? items.length : ATTENTION_TOTALS[kind], items };
}

export function sampleOverview({ gymId, range }: OverviewQuery, empty = false): OverviewDto {
  const noArrivalsYet = empty && range === 'today';
  const gyms = GYMS.filter((gym) => !gymId || gym.id === gymId);
  const key = (gymId as GymId | undefined) ?? 'all';
  const members = gyms.reduce((sum, gym) => sum + gym.members, 0);
  const memberDelta = noArrivalsYet ? 0 : gyms.reduce((sum, gym) => sum + MEMBER_DELTA[range][gym.id], 0);
  const mix = PLANS.map((_, i) => gyms.reduce((sum, gym) => sum + (PLAN_MIX[gym.id][i] ?? 0), 0));
  const revenue = Math.round(mix.reduce((sum, count, i) => sum + count * (PLANS[i]?.monthlyPrice ?? 0), 0));
  const revenueDelta = REVENUE_DELTA[key];
  const [churn, churnDelta] = CHURN[key];
  const buckets = arrivalBuckets(range, clock(empty));

  return {
    activeMembers: { value: members, delta: memberDelta, history: trendHistory(members, memberDelta, members) },
    monthlyRevenue: {
      value: revenue,
      delta: revenueDelta,
      history: [0.86, 0.89, 0.9, 0.93, 0.92, 0.96, 1].map(
        (f, i) => revenue * f * (1 + revenueDelta / 100 - 0.04) + (noise(i) - 0.5) * revenue * 0.01,
      ),
    },
    churn: {
      month: local(new Date(NOW.getFullYear(), NOW.getMonth(), 1)),
      value: churn,
      delta: churnDelta,
      history: [3.1, 2.9, 3.0, 2.6, 2.8].map((v) => v + churn - 2.4).concat([churn - churnDelta, churn]),
    },
    arrivals: {
      buckets: buckets.map(local),
      series: gyms.map((gym) => ({
        gymId: gym.id,
        values: noArrivalsYet ? buckets.map(() => 0) : arrivalsFor(gym.members, range, buckets),
      })),
      deltaPercent: ARRIVALS_DELTA[range],
    },
    planMix: PLANS.map((plan, i) => ({ slug: plan.slug, name: plan.name, count: mix[i] ?? 0 })),
    peakHours: {
      firstHour: FIRST_HOUR,
      byWeekday: WEEKDAY_FACTOR.map((factor, weekday) =>
        HOURS.map((hour) =>
          noArrivalsYet
            ? 0
            : gyms.reduce(
                (sum, gym) =>
                  sum +
                  ((gym.members * 0.42 * factor * hourlyProfile(hour, weekday)) / PROFILE_SUM) *
                    (0.9 + 0.2 * noise(weekday * 31 + hour + gym.members)),
                0,
              ),
        ),
      ),
    },
    attention: {
      expiring: attentionGroup('expiring', gymId),
      inactive: attentionGroup('inactive', gymId),
      paused: attentionGroup('paused', gymId),
      failedPayment: attentionGroup('failedPayment', gymId),
    },
  };
}

export function sampleLiveStatus(empty = false): LiveStatusDto {
  return {
    windowMinutes: 60,
    updatedAt: local(clock(empty)),
    gyms: GYMS.map(({ id, name, capacity, count }) => ({ id, name, capacity, count: empty ? 0 : count })),
    offlineDevices: empty ? [] : [{ gymId: 'v2', kind: 'reader', offlineSince: local(at(10, 13, 17, 42)) }],
  };
}

export function sampleLateEntries(gymId: string | undefined): EntryLogDto[] {
  return LATE_ENTRIES.filter((entry) => !gymId || entry.gymId === gymId);
}
