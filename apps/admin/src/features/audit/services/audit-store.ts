import type { AuditEntryDto, AuditKind, MemberListItemDto } from '@gibigib/types';
import { GYMS, NOW, PLANS, at, local, mockNow, noise } from '../../../shared/mock/fixtures';
import { MEMBERS } from '../../members/services/sample-data';

const OWNER = { kind: 'OWNER', name: 'Vlasnik', memberId: null } as const;
const SYSTEM = { kind: 'SYSTEM', name: 'Sustav', memberId: null } as const;
const DAY_MS = 86_400_000;
const HISTORY_DAYS = 365;
const ENTRIES_PER_DAY = 13;

type Actor = AuditEntryDto['actor'];

const memberActor = (member: MemberListItemDto): Actor => ({ kind: 'MEMBER', name: member.name, memberId: member.id });

const memberNamed = (name: string) => MEMBERS.find((member) => member.name === name);

const SEEDS: readonly [Date, Actor, AuditKind, string, string[], string | null][] = [
  [at(10, 13, 17, 58), OWNER, 'DEVICE', 'Ručno otvorena vrata', ['glavni ulaz'], 'v2'],
  [at(10, 13, 17, 42), SYSTEM, 'DEVICE', 'Čitač offline', ['glavni ulaz'], 'v2'],
  [at(10, 13, 14, 20), OWNER, 'MEMBERSHIP', 'Produžena članarina', ['Tomislav Marić', '+30 dana'], 'z1'],
  [at(10, 13, 11, 8), OWNER, 'PLAN', 'Izmijenjen plan', ['Godišnji', 'opis u aplikaciji'], null],
  [at(10, 13, 9, 14), SYSTEM, 'MEMBERSHIP', 'Obnovljena članarina', ['Mateo Kralj', 'Mjesečno'], 'z1'],
  [at(10, 12, 21, 15), SYSTEM, 'PAYMENT', 'Plaćanje neuspjelo', ['Dario Matić', '29,99 €'], 'z2'],
  [at(10, 12, 19, 5), OWNER, 'DEVICE', 'Ručno otvorena vrata', ['glavni ulaz'], 'z1'],
  [at(10, 12, 18, 40), OWNER, 'EVENT', 'Objavljen događaj', ['Novi termini grupnih treninga'], null],
  [at(10, 12, 11, 22), OWNER, 'MEMBERSHIP', 'Otkazana članarina', ['Hrvoje Radić', 'povrat 29,99 €'], 'z1'],
  [
    at(10, 11, 10, 3),
    { kind: 'MEMBER', name: 'Ivan Perić', memberId: memberNamed('Ivan Perić')?.id ?? null },
    'MEMBERSHIP',
    'Pauzirana članarina',
    ['u aplikaciji', '11. 10. – 16. 10.'],
    'z2',
  ],
  [at(10, 10, 16, 45), OWNER, 'TRAINER', 'Dodan trener', ['Petra Novosel'], 'z2'],
  [at(10, 10, 9, 14), SYSTEM, 'MEMBERSHIP', 'Obnovljena članarina', ['Ana Kovač', 'Mjesečno', '+30 dana'], 'v1'],
  [at(10, 9, 19, 30), OWNER, 'DEVICE', 'Ručno otvorena vrata', ['glavni ulaz'], 'v1'],
  [at(10, 8, 12, 0), OWNER, 'SETTINGS', 'Promijenjen kapacitet', ['90 → 100'], 'z2'],
];

const seedEntries: AuditEntryDto[] = SEEDS.map(([date, actor, kind, title, details, gymId], i) => ({
  id: `audit-seed-${i}`,
  at: local(date),
  actor,
  kind,
  title,
  details,
  gymId,
}));

const active = MEMBERS.filter((member) => member.status === 'ACTIVE');
const day = (date: Date) => `${date.getDate()}. ${date.getMonth() + 1}.`;

type Template = (member: MemberListItemDto, seed: number, date: Date) => Omit<AuditEntryDto, 'id' | 'at'>;

const TEMPLATES: readonly [number, Template][] = [
  [
    0.48,
    (m) => ({
      actor: SYSTEM,
      kind: 'MEMBERSHIP',
      title: 'Obnovljena članarina',
      details: [m.name, m.planName],
      gymId: m.homeGymId,
    }),
  ],
  [
    0.1,
    (m) => ({
      actor: memberActor(m),
      kind: 'MEMBERSHIP',
      title: 'Nova članarina',
      details: ['u aplikaciji', m.planName],
      gymId: m.homeGymId,
    }),
  ],
  [
    0.08,
    (m) => ({
      actor: OWNER,
      kind: 'MEMBERSHIP',
      title: 'Produžena članarina',
      details: [m.name, '+30 dana'],
      gymId: m.homeGymId,
    }),
  ],
  [
    0.06,
    (m, _, date) => ({
      actor: memberActor(m),
      kind: 'MEMBERSHIP',
      title: 'Pauzirana članarina',
      details: ['u aplikaciji', `${day(date)} – ${day(new Date(date.getTime() + 5 * DAY_MS))}`],
      gymId: m.homeGymId,
    }),
  ],
  [
    0.05,
    (m) => ({
      actor: SYSTEM,
      kind: 'PAYMENT',
      title: 'Plaćanje neuspjelo',
      details: [m.name, `${(PLANS.find((p) => p.slug === m.planSlug)?.price ?? 29.99).toFixed(2).replace('.', ',')} €`],
      gymId: m.homeGymId,
    }),
  ],
  [
    0.05,
    (m) => ({
      actor: SYSTEM,
      kind: 'PAYMENT',
      title: 'Plaćanje uspjelo',
      details: [m.name, 'ponovni pokušaj'],
      gymId: m.homeGymId,
    }),
  ],
  [
    0.1,
    (_, seed) => ({
      actor: OWNER,
      kind: 'DEVICE',
      title: 'Ručno otvorena vrata',
      details: ['glavni ulaz'],
      gymId: GYMS[Math.floor(noise(seed + 9) * GYMS.length)]?.id ?? null,
    }),
  ],
  [
    0.04,
    (_, seed) => ({
      actor: SYSTEM,
      kind: 'DEVICE',
      title: noise(seed + 4) < 0.5 ? 'Čitač offline' : 'Čitač ponovno online',
      details: ['glavni ulaz'],
      gymId: GYMS[Math.floor(noise(seed + 2) * GYMS.length)]?.id ?? null,
    }),
  ],
  [
    0.03,
    (m) => ({
      actor: OWNER,
      kind: 'MEMBERSHIP',
      title: 'Otkazana članarina',
      details: [m.name],
      gymId: m.homeGymId,
    }),
  ],
  [
    0.01,
    () => ({ actor: OWNER, kind: 'EVENT', title: 'Objavljen događaj', details: ['Obavijest za članove'], gymId: null }),
  ],
];

function generated(index: number, date: Date): AuditEntryDto {
  let roll = noise(index * 7 + 1);
  let template = TEMPLATES[0]?.[1] as Template;
  for (const [weight, candidate] of TEMPLATES) {
    template = candidate;
    if (roll < weight) break;
    roll -= weight;
  }
  const member = active[Math.floor(noise(index * 13 + 5) * active.length)] as MemberListItemDto;
  return { id: `audit-g-${index}`, at: local(date), ...template(member, index, date) };
}

const oldestSeed = new Date(seedEntries.at(-1)?.at ?? local(NOW)).getTime();
const historyStart = NOW.getTime() - HISTORY_DAYS * DAY_MS;
const generatedCount = Math.round(((oldestSeed - historyStart) / DAY_MS) * ENTRIES_PER_DAY);

const history: readonly AuditEntryDto[] = [
  ...seedEntries,
  ...Array.from({ length: generatedCount }, (_, i) =>
    generated(i, new Date(oldestSeed - ((i + 0.5 + noise(i) * 0.4) / generatedCount) * (oldestSeed - historyStart))),
  ),
];

const recorded: AuditEntryDto[] = [];

export interface ChangeRecord {
  kind: AuditKind;
  title: string;
  details: string[];
  gymId: string | null;
}

export function recordChange({ kind, title, details, gymId }: ChangeRecord) {
  recorded.unshift({
    id: `audit-r-${recorded.length + 1}`,
    at: local(mockNow()),
    actor: OWNER,
    kind,
    title,
    details,
    gymId,
  });
}

export const auditEntries = (): readonly AuditEntryDto[] => [...recorded, ...history];
