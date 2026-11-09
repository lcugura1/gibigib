import type {
  AnalyticsRange,
  EntriesPageDto,
  EntriesQuery,
  EntryDenialReason,
  EntryLogDto,
  MemberListItemDto,
} from '@gibigib/types';
import { GYMS, NOW, noise } from '../../../shared/mock/fixtures';
import { MEMBERS } from '../../members/services/sample-data';
import { sampleOverview } from '../../overview/services/sample-data';

const DEVICE = 'Čitač · glavni ulaz';
const DAY_MS = 86_400_000;
const OPENING_HOUR = 6;
const TODAY_DENIED_AT = new Set([40, 120]);
const DENIED_SHARE = 0.027;

const pad = (n: number) => String(n).padStart(2, '0');
const stamp = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
const todayAt = (hour: number, minute: number, second: number) =>
  new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), hour, minute, second);

const FEED: readonly [hour: number, minute: number, second: number, name: string, reason: EntryDenialReason | null][] =
  [
    [18, 0, 12, 'Ana Kovač', null],
    [17, 59, 48, 'Marko Babić', 'PAUSED'],
    [17, 59, 31, 'Marko Babić', 'PAUSED'],
    [17, 58, 5, 'Lana Tomić', null],
    [17, 57, 40, 'Mateo Kralj', null],
    [17, 55, 22, 'Iva Šimić', null],
    [17, 54, 9, 'Karlo Vidović', null],
    [17, 53, 37, 'Leon Bošnjak', 'EXPIRED'],
    [17, 52, 51, 'Nika Petrović', null],
    [17, 51, 14, 'Tea Babić', null],
    [17, 50, 2, 'Gabriel Horvat', 'INVALID_CODE'],
    [17, 49, 33, 'Ivan Jurić', null],
    [17, 48, 27, 'Mia Golubić', null],
    [17, 41, 58, 'Borna Perković', null],
    [17, 40, 16, 'Dino Lovrić', 'EXPIRED'],
  ];

const memberByName = new Map(MEMBERS.map((member) => [member.name, member]));

const SEEDS: readonly EntryLogDto[] = FEED.map(([hour, minute, second, name, reason], i) => {
  const member = memberByName.get(name);
  return {
    id: `feed-${i}`,
    at: stamp(todayAt(hour, minute, second)),
    memberId: member?.id ?? null,
    memberName: name,
    gymId: member?.homeGymId ?? 'v1',
    device: DEVICE,
    approved: reason === null,
    denialReason: reason,
  };
});

const byStatus = (status: MemberListItemDto['status'], gymId?: string) =>
  MEMBERS.filter((m) => m.status === status && (!gymId || m.homeGymId === gymId));

const DENIAL_WEIGHTS: readonly [EntryDenialReason, number][] = [
  ['EXPIRED', 0.4],
  ['PAUSED', 0.25],
  ['INVALID_CODE', 0.2],
  ['CANCELLED', 0.15],
];

const DENIAL_STATUS: Record<EntryDenialReason, MemberListItemDto['status']> = {
  EXPIRED: 'EXPIRED',
  PAUSED: 'PAUSED',
  CANCELLED: 'CANCELLED',
  INVALID_CODE: 'ACTIVE',
};

function pickReason(seed: number): EntryDenialReason {
  let roll = noise(seed);
  for (const [reason, weight] of DENIAL_WEIGHTS) {
    if (roll < weight) return reason;
    roll -= weight;
  }
  return 'EXPIRED';
}

function spanMs(range: AnalyticsRange) {
  switch (range) {
    case 'today':
      return (NOW.getHours() - OPENING_HOUR) * 3_600_000;
    case '7d':
      return 7 * DAY_MS;
    case '30d':
      return 30 * DAY_MS;
    case '12m':
      return 365 * DAY_MS;
  }
}

const isDenied = (range: AnalyticsRange, index: number) =>
  range === 'today' ? TODAY_DENIED_AT.has(index) : noise(index * 3 + 7) < DENIED_SHARE;

function gymFor(index: number, gymId: string | undefined) {
  if (gymId) return gymId;
  const total = GYMS.reduce((sum, gym) => sum + gym.members, 0);
  let roll = noise(index * 5 + 1) * total;
  for (const gym of GYMS) {
    if (roll < gym.members) return gym.id;
    roll -= gym.members;
  }
  return GYMS[0].id;
}

function generated(range: AnalyticsRange, index: number, total: number, gymId: string | undefined): EntryLogDto {
  const gym = gymFor(index, gymId);
  const denied = isDenied(range, index);
  const reason = denied ? (range === 'today' ? 'EXPIRED' : pickReason(index)) : null;
  const pool = byStatus(reason ? DENIAL_STATUS[reason] : 'ACTIVE', gym);
  const fallback = byStatus('ACTIVE', gym);
  const candidates = pool.length > 0 ? pool : fallback;
  const member = candidates[Math.floor(noise(index * 11 + 3) * candidates.length)] as MemberListItemDto;
  const at = new Date(NOW.getTime() - (index / total) * spanMs(range) - Math.floor(noise(index) * 40) * 1000);
  return {
    id: `${range}-${gym}-${index}`,
    at: stamp(at),
    memberId: member.id,
    memberName: member.name,
    gymId: gym,
    device: DEVICE,
    approved: !denied,
    denialReason: reason,
  };
}

function totalEntries(range: AnalyticsRange, gymId: string | undefined) {
  const { series } = sampleOverview({ gymId, range }).arrivals;
  return series.reduce((sum, s) => sum + s.values.reduce((a, b) => a + b, 0), 0);
}

function entryAt(range: AnalyticsRange, gymId: string | undefined, seeds: readonly EntryLogDto[], total: number) {
  return (index: number) => seeds[index] ?? generated(range, index, total, gymId);
}

const WEEK_UNIQUE_SHARE = 0.92;

export function sampleEntries(query: EntriesQuery): EntriesPageDto {
  const seeds = SEEDS.filter((entry) => !query.gymId || entry.gymId === query.gymId);
  const total = Math.max(seeds.length, totalEntries(query.range, query.gymId));
  const at = entryAt(query.range, query.gymId, seeds, total);
  const denialOf = (index: number) =>
    index < seeds.length ? seeds[index]?.denialReason : isDenied(query.range, index) ? 'denied' : null;

  const deniedIndexes: number[] = [];
  const approvedIndexes: number[] = [];
  for (let i = 0; i < total; i++) (denialOf(i) ? deniedIndexes : approvedIndexes).push(i);

  const start = (query.page - 1) * query.pageSize;
  const selected = query.result === 'denied' ? deniedIndexes : query.result === 'approved' ? approvedIndexes : null;
  const length = selected ? selected.length : total;
  const indexes = selected
    ? selected.slice(start, start + query.pageSize)
    : Array.from({ length: Math.max(0, Math.min(query.pageSize, total - start)) }, (_, i) => start + i);

  const deniedEntries = deniedIndexes.map(at);
  const reasons = new Map<EntryDenialReason, number>();
  for (const entry of deniedEntries)
    if (entry.denialReason) reasons.set(entry.denialReason, (reasons.get(entry.denialReason) ?? 0) + 1);
  const top = [...reasons.entries()].sort((a, b) => b[1] - a[1])[0];
  const activeMembers = MEMBERS.filter(
    (m) => (m.status === 'ACTIVE' || m.status === 'PAUSED') && (!query.gymId || m.homeGymId === query.gymId),
  ).length;
  const approvedCount = approvedIndexes.length;
  const uniqueMembers =
    query.range === 'today'
      ? new Set(
          Array.from({ length: total }, (_, i) => at(i))
            .filter((e) => e.approved)
            .map((e) => e.memberId),
        ).size
      : Math.min(Math.round(activeMembers * WEEK_UNIQUE_SHARE), approvedCount);

  return {
    asOf: stamp(NOW),
    items: indexes.map(at),
    page: query.page,
    pageSize: query.pageSize,
    total: length,
    counts: { all: total, approved: approvedCount, denied: deniedIndexes.length },
    summary: {
      deltaPercent: sampleOverview({ gymId: query.gymId, range: query.range }).arrivals.deltaPercent,
      topDenial: top ? { reason: top[0], count: top[1] } : null,
      uniqueMembers,
      activeMembers,
    },
  };
}

export function sampleRecentEntries(gymId: string | undefined, count: number): EntryLogDto[] {
  return sampleEntries({ gymId, range: 'today', result: 'all', page: 1, pageSize: count }).items;
}

const CSV_RESULT = { true: 'Odobren', false: 'Odbijen' } as const;

const DENIAL_CSV: Record<EntryDenialReason, string> = {
  EXPIRED: 'Članarina istekla',
  PAUSED: 'Članarina pauzirana',
  CANCELLED: 'Članarina otkazana',
  INVALID_CODE: 'Nevažeći kod',
};

const csvCell = (value: string) => `"${value.replaceAll('"', '""')}"`;

export function sampleEntriesCsv(query: Omit<EntriesQuery, 'page' | 'pageSize'>) {
  const { items } = sampleEntries({ ...query, page: 1, pageSize: Number.MAX_SAFE_INTEGER });
  const gymName = (id: string) => GYMS.find((gym) => gym.id === id)?.name ?? '';
  const header = ['Vrijeme', 'Član', 'Teretana', 'Uređaj', 'Rezultat', 'Razlog'];
  const rows = items.map((entry) => [
    entry.at.replace('T', ' '),
    entry.memberName,
    gymName(entry.gymId),
    entry.device,
    CSV_RESULT[String(entry.approved) as 'true' | 'false'],
    entry.denialReason ? DENIAL_CSV[entry.denialReason] : '',
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n');
}
