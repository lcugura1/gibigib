import type { MemberListItemDto, MembersPageDto, MembersQuery, MembershipStatus } from '@gibigib/types';
import { GYMS, NOW, PLANS, PLAN_MIX, at, local, noise, type GymId } from '../../../shared/mock/fixtures';
import { daysBetween, INACTIVE_AFTER_DAYS, isInactive } from '../inactivity';

type PlanSlug = (typeof PLANS)[number]['slug'];

interface Seed {
  name: string;
  plan: PlanSlug;
  status: MembershipStatus;
  gym: GymId;
  expires: Date;
  lastVisit: Date;
  visits: number;
}

const today = (hour: number, minute: number) => at(10, 13, hour, minute);

const SEEDS: readonly Seed[] = [
  {
    name: 'Ana Kovač',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'v1',
    expires: at(11, 9),
    lastVisit: today(18, 0),
    visits: 14,
  },
  {
    name: 'Ante Pavlović',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'z1',
    expires: at(10, 30),
    lastVisit: at(9, 21, 19, 10),
    visits: 0,
  },
  {
    name: 'Dario Matić',
    plan: 'mjesecno',
    status: 'EXPIRED',
    gym: 'z2',
    expires: at(10, 12),
    lastVisit: at(10, 9, 18, 40),
    visits: 7,
  },
  {
    name: 'Filip Šarić',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'v2',
    expires: at(10, 28),
    lastVisit: at(9, 29, 7, 5),
    visits: 3,
  },
  {
    name: 'Hrvoje Radić',
    plan: 'mjesecno',
    status: 'CANCELLED',
    gym: 'z1',
    expires: at(10, 10),
    lastVisit: at(9, 30, 20, 15),
    visits: 5,
  },
  {
    name: 'Ivana Horvat',
    plan: 'grupni',
    status: 'ACTIVE',
    gym: 'z2',
    expires: at(10, 16),
    lastVisit: at(10, 11, 18, 30),
    visits: 9,
  },
  {
    name: 'Josip Kovačević',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'z2',
    expires: at(11, 2),
    lastVisit: at(9, 26, 17, 45),
    visits: 2,
  },
  {
    name: 'Lana Tomić',
    plan: 'trener',
    status: 'ACTIVE',
    gym: 'z2',
    expires: at(10, 31),
    lastVisit: today(17, 58),
    visits: 12,
  },
  {
    name: 'Lucija Blažević',
    plan: 'grupni',
    status: 'ACTIVE',
    gym: 'z1',
    expires: at(10, 25),
    lastVisit: at(9, 28, 9, 20),
    visits: 3,
  },
  {
    name: 'Luka Novak',
    plan: 'godisnji',
    status: 'ACTIVE',
    gym: 'z1',
    expires: at(10, 15),
    lastVisit: today(7, 12),
    visits: 18,
  },
  {
    name: 'Maja Knežević',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'v2',
    expires: at(10, 19),
    lastVisit: at(10, 10, 18, 5),
    visits: 8,
  },
  {
    name: 'Marko Babić',
    plan: 'godisnji',
    status: 'PAUSED',
    gym: 'z1',
    expires: new Date(2027, 2, 3),
    lastVisit: at(10, 8, 17, 30),
    visits: 6,
  },
  {
    name: 'Nikolina Vuković',
    plan: 'godisnji',
    status: 'ACTIVE',
    gym: 'v1',
    expires: new Date(2027, 4, 4),
    lastVisit: at(9, 24, 18, 0),
    visits: 1,
  },
  {
    name: 'Petra Jurić',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'v1',
    expires: at(10, 14),
    lastVisit: at(10, 12, 19, 10),
    visits: 11,
  },
  {
    name: 'Sara Božić',
    plan: 'mjesecno',
    status: 'PAUSED',
    gym: 'v1',
    expires: at(11, 6),
    lastVisit: at(10, 2, 8, 0),
    visits: 4,
  },
  {
    name: 'Tomislav Marić',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'z1',
    expires: at(10, 17),
    lastVisit: today(17, 20),
    visits: 16,
  },
  {
    name: 'Iva Šimić',
    plan: 'godisnji',
    status: 'ACTIVE',
    gym: 'v1',
    expires: new Date(2027, 1, 2),
    lastVisit: today(17, 55),
    visits: 15,
  },
  {
    name: 'Mia Golubić',
    plan: 'grupni',
    status: 'ACTIVE',
    gym: 'v1',
    expires: at(10, 27),
    lastVisit: today(17, 48),
    visits: 10,
  },
  {
    name: 'Borna Perković',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'v1',
    expires: at(11, 5),
    lastVisit: today(17, 41),
    visits: 9,
  },
  {
    name: 'Karla Pavić',
    plan: 'grupni',
    status: 'ACTIVE',
    gym: 'v1',
    expires: at(10, 21),
    lastVisit: at(10, 1, 18, 50),
    visits: 5,
  },
  {
    name: 'Matej Lončar',
    plan: 'trener',
    status: 'ACTIVE',
    gym: 'v1',
    expires: at(10, 30),
    lastVisit: at(9, 30, 16, 0),
    visits: 6,
  },
  {
    name: 'Leon Bošnjak',
    plan: 'mjesecno',
    status: 'EXPIRED',
    gym: 'v1',
    expires: at(10, 8),
    lastVisit: at(9, 27, 19, 0),
    visits: 3,
  },
  {
    name: 'Tena Rukavina',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'v1',
    expires: at(11, 3),
    lastVisit: at(9, 21, 8, 15),
    visits: 0,
  },
];

const FEED_SEEDS: readonly Seed[] = [
  {
    name: 'Mateo Kralj',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'z1',
    expires: at(11, 4),
    lastVisit: today(17, 57),
    visits: 13,
  },
  {
    name: 'Karlo Vidović',
    plan: 'grupni',
    status: 'ACTIVE',
    gym: 'z2',
    expires: at(10, 29),
    lastVisit: today(17, 54),
    visits: 10,
  },
  {
    name: 'Nika Petrović',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'z1',
    expires: at(11, 1),
    lastVisit: today(17, 52),
    visits: 12,
  },
  {
    name: 'Tea Babić',
    plan: 'godisnji',
    status: 'ACTIVE',
    gym: 'z2',
    expires: new Date(2027, 3, 18),
    lastVisit: today(17, 51),
    visits: 9,
  },
  {
    name: 'Gabriel Horvat',
    plan: 'mjesecno',
    status: 'ACTIVE',
    gym: 'z2',
    expires: at(10, 26),
    lastVisit: at(10, 11, 19, 5),
    visits: 7,
  },
  {
    name: 'Ivan Jurić',
    plan: 'trener',
    status: 'ACTIVE',
    gym: 'z1',
    expires: at(11, 7),
    lastVisit: today(17, 49),
    visits: 11,
  },
  {
    name: 'Dino Lovrić',
    plan: 'mjesecno',
    status: 'EXPIRED',
    gym: 'v2',
    expires: at(10, 9),
    lastVisit: at(10, 7, 18, 30),
    visits: 4,
  },
];

const FIRST_NAMES = [
  'Ivan',
  'Marija',
  'Josip',
  'Ana',
  'Luka',
  'Petra',
  'Marko',
  'Ivana',
  'Filip',
  'Lucija',
  'Matej',
  'Ema',
  'David',
  'Mia',
  'Karlo',
  'Lana',
  'Antonio',
  'Sara',
  'Nikola',
  'Nika',
  'Tin',
  'Klara',
  'Dominik',
  'Lea',
  'Jakov',
  'Marta',
  'Fran',
  'Dora',
  'Roko',
  'Iva',
  'Borna',
  'Tena',
  'Leon',
  'Karla',
  'Toma',
  'Paula',
];

const LAST_NAMES = [
  'Horvat',
  'Kovačević',
  'Babić',
  'Marić',
  'Jurić',
  'Novak',
  'Kovačić',
  'Knežević',
  'Vuković',
  'Marković',
  'Petrović',
  'Matić',
  'Tomić',
  'Pavlović',
  'Kovač',
  'Božić',
  'Blažević',
  'Grgić',
  'Pavić',
  'Radić',
  'Perić',
  'Šarić',
  'Lovrić',
  'Vidović',
  'Perković',
  'Popović',
  'Bošnjak',
  'Jukić',
  'Brkić',
  'Mikulić',
];

const TOTAL_EXPIRED = 50;
const TOTAL_CANCELLED = 12;
const TOTAL_PAUSED = 9;
const TOTAL_INACTIVE = 31;
const DAY_MS = 86_400_000;

const ASCII: Record<string, string> = { č: 'c', ć: 'c', š: 's', ž: 'z', đ: 'd' };
const toAscii = (text: string) => text.toLowerCase().replace(/[čćšžđ]/g, (char) => ASCII[char] ?? char);
const emailOf = (name: string) => `${toAscii(name).split(' ').join('.')}@gmail.com`;
const plusDays = (days: number, hour = 0) => new Date(NOW.getTime() + days * DAY_MS + hour * 3_600_000);
const pick = <T>(items: readonly T[], seed: number) => items[Math.floor(noise(seed) * items.length)] as T;

function toDto(id: number, seed: Seed): MemberListItemDto {
  const plan = PLANS.find((p) => p.slug === seed.plan) ?? PLANS[0];
  return {
    id: `m${id}`,
    name: seed.name,
    email: emailOf(seed.name),
    planSlug: plan.slug,
    planName: plan.name,
    status: seed.status,
    homeGymId: seed.gym,
    expiresAt: local(seed.expires),
    lastVisitAt: local(seed.lastVisit),
    visits30d: seed.visits,
  };
}

function generatedName(index: number, taken: Set<string>) {
  for (let attempt = 0; ; attempt++) {
    const name = `${pick(FIRST_NAMES, index * 7 + attempt)} ${pick(LAST_NAMES, index * 13 + attempt * 3 + 1)}`;
    if (!taken.has(name)) return name;
  }
}

function activeSlots() {
  return GYMS.flatMap((gym) =>
    PLANS.flatMap((plan, i) =>
      Array.from({ length: PLAN_MIX[gym.id][i] ?? 0 }, () => ({ gym: gym.id, plan: plan.slug })),
    ),
  );
}

function buildMembers(): MemberListItemDto[] {
  const named = [...SEEDS, ...FEED_SEEDS];
  const taken = new Set(named.map((seed) => seed.name));
  const slots = activeSlots();
  const seeds: Seed[] = [...named];
  const counts = (predicate: (seed: Seed) => boolean) => seeds.filter(predicate).length;

  for (const seed of named.filter((s) => s.status === 'ACTIVE' || s.status === 'PAUSED')) {
    const index = slots.findIndex((slot) => slot.gym === seed.gym && slot.plan === seed.plan);
    if (index >= 0) slots.splice(index, 1);
  }

  let paused = counts((s) => s.status === 'PAUSED');
  let inactive = counts(
    (s) => s.status === 'ACTIVE' && daysBetween(local(s.lastVisit), local(NOW)) >= INACTIVE_AFTER_DAYS,
  );

  slots.forEach((slot, i) => {
    const r = noise(i + 101);
    const isPaused = paused < TOTAL_PAUSED && i % 90 === 45;
    const isInactiveMember = !isPaused && inactive < TOTAL_INACTIVE && i % 27 === 13;
    if (isPaused) paused++;
    if (isInactiveMember) inactive++;
    const daysAgo = isInactiveMember ? 14 + Math.floor(r * 30) : Math.floor(r * 12);
    const term = slot.plan === 'godisnji' ? 30 + Math.floor(noise(i + 7) * 330) : 1 + Math.floor(noise(i + 7) * 30);
    seeds.push({
      name: generatedName(i, taken),
      plan: slot.plan,
      status: isPaused ? 'PAUSED' : 'ACTIVE',
      gym: slot.gym,
      expires: plusDays(term),
      lastVisit: plusDays(-daysAgo, daysAgo === 0 ? -1 - Math.floor(r * 10) : 0),
      visits: isInactiveMember ? 0 : 2 + Math.floor(noise(i + 3) * 18),
    });
    taken.add(seeds[seeds.length - 1]?.name ?? '');
  });

  const ended = (status: MembershipStatus, total: number, offset: number) => {
    for (let i = counts((s) => s.status === status); i < total; i++) {
      const seedIndex = offset + i;
      const expiredDaysAgo = 1 + Math.floor(noise(seedIndex) * 60);
      seeds.push({
        name: generatedName(seedIndex, taken),
        plan: pick(PLANS, seedIndex + 5).slug,
        status,
        gym: pick(GYMS, seedIndex + 9).id,
        expires: plusDays(-expiredDaysAgo),
        lastVisit: plusDays(-expiredDaysAgo - 1 - Math.floor(noise(seedIndex + 2) * 10)),
        visits: Math.floor(noise(seedIndex + 4) * 6),
      });
      taken.add(seeds[seeds.length - 1]?.name ?? '');
    }
  };
  ended('EXPIRED', TOTAL_EXPIRED, 5000);
  ended('CANCELLED', TOTAL_CANCELLED, 7000);

  return seeds.map((seed, i) => toDto(i + 1, seed));
}

export const MEMBERS = buildMembers();

const STATUS_ORDER: Record<MembershipStatus, number> = { ACTIVE: 0, PAUSED: 1, EXPIRED: 2, CANCELLED: 3 };
const GYM_ORDER = GYMS.map((gym) => gym.id as string);
const collator = new Intl.Collator('hr-HR', { sensitivity: 'base' });
const normalize = (text: string) => toAscii(text.trim());

const COMPARE: Record<MembersQuery['sort'], (a: MemberListItemDto, b: MemberListItemDto) => number> = {
  name: (a, b) => collator.compare(a.name, b.name),
  plan: (a, b) => collator.compare(a.planName, b.planName),
  status: (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  homeGym: (a, b) => GYM_ORDER.indexOf(a.homeGymId) - GYM_ORDER.indexOf(b.homeGymId),
  expiresAt: (a, b) => a.expiresAt.localeCompare(b.expiresAt),
  lastVisit: (a, b) => (a.lastVisitAt ?? '').localeCompare(b.lastVisitAt ?? ''),
  visits30d: (a, b) => a.visits30d - b.visits30d,
};

const now = local(NOW);

export function sampleMembers(query: MembersQuery): MembersPageDto {
  const search = normalize(query.search ?? '');
  const matches = MEMBERS.filter(
    (member) =>
      (!search || normalize(member.name).includes(search) || member.email.includes(search)) &&
      (!query.status || member.status === query.status) &&
      (!query.planSlug || member.planSlug === query.planSlug) &&
      (!query.gymId || member.homeGymId === query.gymId),
  );
  const inactive = matches.filter((member) => isInactive(member, now));
  const rows = query.inactiveOnly ? inactive : matches;
  const sign = query.direction === 'asc' ? 1 : -1;
  const compare = COMPARE[query.sort];
  const sorted = [...rows].sort((a, b) => sign * compare(a, b) || collator.compare(a.name, b.name));
  const start = (query.page - 1) * query.pageSize;

  return {
    asOf: now,
    items: sorted.slice(start, start + query.pageSize),
    page: query.page,
    pageSize: query.pageSize,
    total: rows.length,
    inactiveCount: inactive.length,
    activeMembers: MEMBERS.filter((member) => member.status === 'ACTIVE' || member.status === 'PAUSED').length,
    allMembers: MEMBERS.length,
  };
}

const CSV_STATUS: Record<MembershipStatus, string> = {
  ACTIVE: 'Aktivna',
  PAUSED: 'Pauzirana',
  EXPIRED: 'Istekla',
  CANCELLED: 'Otkazana',
};

const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

export function sampleMembersCsv(query: MembersQuery) {
  const { items } = sampleMembers({ ...query, page: 1, pageSize: MEMBERS.length });
  const gymName = (id: string) => GYMS.find((gym) => gym.id === id)?.name ?? '';
  const header = [
    'Ime i prezime',
    'E-adresa',
    'Plan',
    'Status',
    'Matična teretana',
    'Ističe',
    'Zadnji dolazak',
    'Dolasci (30 d)',
  ];
  const rows = items.map((m) => [
    m.name,
    m.email,
    m.planName,
    CSV_STATUS[m.status],
    gymName(m.homeGymId),
    m.expiresAt.slice(0, 10),
    m.lastVisitAt?.slice(0, 16).replace('T', ' ') ?? '',
    m.visits30d,
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n');
}
