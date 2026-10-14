import type {
  ExtendMembershipRequest,
  MemberDetailDto,
  MemberListItemDto,
  MemberVisitsDto,
  PaymentStatus,
} from '@gibigib/types';
import { GYMS, NOW, PLANS, local, noise } from '../../../shared/mock/fixtures';
import { daysBetween } from '../inactivity';
import { MEMBERS } from './sample-data';

const MAX_PAUSE_DAYS = 7;
const PAUSE_COOLDOWN_DAYS = 30;
const DAY_MS = 86_400_000;
const now = local(NOW);
const OWNER = 'Vlasnik';
const SYSTEM = 'Sustav';

const addDays = (iso: string, days: number) => local(new Date(new Date(iso).getTime() + days * DAY_MS));
const dateOnly = (iso: string) => `${iso.slice(0, 10)}T00:00:00`;
const formatDay = (iso: string) => {
  const date = new Date(iso);
  return `${date.getDate()}. ${date.getMonth() + 1}.`;
};

interface MemberRecord {
  detail: Omit<MemberDetailDto, 'asOf'>;
  visitDays: Map<string, number[]>;
}

const ANA: Omit<MemberDetailDto, 'asOf' | 'id' | 'name' | 'email' | 'homeGymId'> = {
  oibLast3: '418',
  birthDate: '1994-03-14T00:00:00',
  memberSince: '2021-09-02T00:00:00',
  membership: {
    status: 'ACTIVE',
    planSlug: 'mjesecno',
    planName: 'Mjesečno',
    price: 29.99,
    durationDays: 30,
    autoRenew: true,
    startsAt: '2026-10-10T00:00:00',
    endsAt: '2026-11-09T00:00:00',
    paymentMethod: 'Apple Pay',
  },
  pause: {
    maxDays: MAX_PAUSE_DAYS,
    cooldownDays: PAUSE_COOLDOWN_DAYS,
    current: null,
    nextAllowedFrom: '2026-10-15T00:00:00',
    history: [
      { from: '2026-09-10T00:00:00', until: '2026-09-15T00:00:00', days: 5 },
      { from: '2026-04-02T00:00:00', until: '2026-04-09T00:00:00', days: 7 },
    ],
  },
  visits: {
    last30Days: 14,
    byGym30Days: [
      { gymId: 'v1', count: 11 },
      { gymId: 'v2', count: 2 },
      { gymId: 'z1', count: 1 },
      { gymId: 'z2', count: 0 },
    ],
  },
  payments: [
    {
      id: 'p1',
      date: '2026-10-10T00:00:00',
      description: 'Mjesečno · obnova',
      method: 'Apple Pay',
      status: 'PAID',
      amount: 29.99,
    },
    {
      id: 'p2',
      date: '2026-09-10T00:00:00',
      description: 'Mjesečno · obnova',
      method: 'Kartica ·· 4242',
      status: 'PAID',
      amount: 29.99,
    },
    {
      id: 'p3',
      date: '2026-07-12T00:00:00',
      description: 'Mjesečno · ponovni pokušaj',
      method: 'Kartica ·· 4242',
      status: 'PAID',
      amount: 29.99,
    },
    {
      id: 'p4',
      date: '2026-07-11T00:00:00',
      description: 'Mjesečno · obnova',
      method: 'Kartica ·· 4242',
      status: 'FAILED',
      amount: 29.99,
    },
    {
      id: 'p5',
      date: '2026-06-11T00:00:00',
      description: 'Mjesečno · obnova',
      method: 'Kartica ·· 4242',
      status: 'PAID',
      amount: 29.99,
    },
  ],
  changeLog: [
    {
      id: 'c1',
      at: '2026-10-10T00:00:00',
      title: 'Obnovljena članarina',
      detail: 'Mjesečno · +30 dana',
      actor: 'Sustav · plaćanje Apple Pay',
    },
    {
      id: 'c2',
      at: '2026-09-15T00:00:00',
      title: 'Nastavljena članarina',
      detail: 'pauza 5 dana dodana na kraj',
      actor: 'Sustav · kraj pauze',
    },
    {
      id: 'c3',
      at: '2026-09-10T00:00:00',
      title: 'Pauzirana članarina',
      detail: '10. 9. – 15. 9.',
      actor: 'Ana Kovač · u aplikaciji',
    },
    { id: 'c4', at: '2026-07-12T00:00:00', title: 'Plaćanje uspjelo', detail: 'ponovni pokušaj', actor: SYSTEM },
    { id: 'c5', at: '2021-09-02T00:00:00', title: 'Novi član', detail: 'Mjesečno', actor: 'Vlasnik · Varaždin I' },
  ],
};

const ANA_VISITS: Record<string, number[]> = { '2026-10': [1, 2, 5, 6, 7, 9, 12, 13] };

const FAILED_PAYMENT_MEMBERS = new Set(['Dario Matić', 'Karla Pavić', 'Hrvoje Radić']);
const METHODS = ['Kartica ·· 4242', 'Apple Pay', 'Google Pay', 'Kartica ·· 1881'];

const seedOf = (id: string) => Number(id.slice(1));
const monthKey = (iso: string) => iso.slice(0, 7);
const planOf = (slug: string) => PLANS.find((plan) => plan.slug === slug) ?? PLANS[0];

function generatedDetail(member: MemberListItemDto): MemberRecord['detail'] {
  const seed = seedOf(member.id);
  const plan = planOf(member.planSlug);
  const startsAt = addDays(dateOnly(member.expiresAt), -plan.durationDays);
  const memberSince = addDays(startsAt, -Math.floor(noise(seed + 11) * 1500));
  const method = METHODS[Math.floor(noise(seed + 3) * METHODS.length)] ?? 'Kartica ·· 4242';
  const homeShare = 0.7 + noise(seed + 5) * 0.25;
  const home = Math.round(member.visits30d * homeShare);
  const others = GYMS.filter((gym) => gym.id !== member.homeGymId);
  const rest = member.visits30d - home;
  const byGym30Days = GYMS.map((gym) => ({
    gymId: gym.id,
    count:
      gym.id === member.homeGymId
        ? home
        : others[0]?.id === gym.id
          ? Math.ceil(rest / 2)
          : others[1]?.id === gym.id
            ? Math.floor(rest / 2)
            : 0,
  }));
  const renewals = plan.durationDays === 365 ? 1 : 4;
  const failed = FAILED_PAYMENT_MEMBERS.has(member.name);
  const payments = Array.from({ length: renewals }, (_, i) => {
    const status: PaymentStatus = failed && i === 0 ? 'FAILED' : 'PAID';
    return {
      id: `${member.id}-p${i}`,
      date: addDays(startsAt, -i * plan.durationDays),
      description: `${plan.name} · obnova`,
      method,
      status,
      amount: plan.price,
    };
  });
  const paused = member.status === 'PAUSED';
  const pauseFrom = paused
    ? addDays(dateOnly(now), -2)
    : addDays(dateOnly(now), -60 - Math.floor(noise(seed + 9) * 90));
  const pauseDays = paused ? MAX_PAUSE_DAYS : 3 + Math.floor(noise(seed + 13) * 5);
  const pauseUntil = addDays(pauseFrom, pauseDays);
  const hadPause = paused || noise(seed + 17) > 0.6;
  const history = hadPause ? [{ from: pauseFrom, until: pauseUntil, days: pauseDays }] : [];
  const cooldownEnds = hadPause && !paused ? addDays(pauseUntil, PAUSE_COOLDOWN_DAYS) : null;

  return {
    id: member.id,
    name: member.name,
    email: member.email,
    oibLast3: String(100 + Math.floor(noise(seed + 21) * 900)),
    birthDate: local(
      new Date(
        1970 + Math.floor(noise(seed + 23) * 36),
        Math.floor(noise(seed + 25) * 12),
        1 + Math.floor(noise(seed + 27) * 28),
      ),
    ),
    memberSince,
    homeGymId: member.homeGymId,
    membership: {
      status: member.status,
      planSlug: plan.slug,
      planName: plan.name,
      price: plan.price,
      durationDays: plan.durationDays,
      autoRenew: member.status === 'ACTIVE' || member.status === 'PAUSED',
      startsAt,
      endsAt: dateOnly(member.expiresAt),
      paymentMethod: method,
    },
    pause: {
      maxDays: MAX_PAUSE_DAYS,
      cooldownDays: PAUSE_COOLDOWN_DAYS,
      current: paused ? { from: pauseFrom, until: pauseUntil } : null,
      nextAllowedFrom: cooldownEnds && cooldownEnds > now ? cooldownEnds : null,
      history,
    },
    visits: { last30Days: member.visits30d, byGym30Days },
    payments,
    changeLog: [
      ...payments.map((payment, i) => ({
        id: `${member.id}-c${i}`,
        at: payment.date,
        title: payment.status === 'FAILED' ? 'Plaćanje nije uspjelo' : 'Obnovljena članarina',
        detail:
          payment.status === 'FAILED'
            ? `${plan.name} · ${payment.method}`
            : `${plan.name} · +${plan.durationDays} dana`,
        actor: SYSTEM,
      })),
      ...history.map((pause, i) => ({
        id: `${member.id}-h${i}`,
        at: pause.from,
        title: 'Pauzirana članarina',
        detail: `${formatDay(pause.from)} – ${formatDay(pause.until)}`,
        actor: `${member.name} · u aplikaciji`,
      })),
      { id: `${member.id}-new`, at: memberSince, title: 'Novi član', detail: plan.name, actor: OWNER },
    ].sort((a, b) => b.at.localeCompare(a.at)),
  };
}

const records = new Map<string, MemberRecord>();

function recordOf(id: string): MemberRecord | undefined {
  const cached = records.get(id);
  if (cached) return cached;
  const member = MEMBERS.find((m) => m.id === id);
  if (!member) return undefined;
  const isAna = member.name === 'Ana Kovač';
  const detail = isAna
    ? { ...ANA, id: member.id, name: member.name, email: member.email, homeGymId: member.homeGymId }
    : generatedDetail(member);
  const record: MemberRecord = {
    detail,
    visitDays: new Map(isAna ? Object.entries(ANA_VISITS) : []),
  };
  records.set(id, record);
  return record;
}

function generatedVisitDays(member: MemberListItemDto, month: string) {
  const [year, monthIndex] = month.split('-').map(Number) as [number, number];
  const daysInMonth = new Date(year, monthIndex, 0).getDate();
  const lastDay = month === monthKey(now) ? NOW.getDate() : daysInMonth;
  const perDay = Math.min(0.9, member.visits30d / 30);
  const days = Array.from({ length: lastDay }, (_, i) => i + 1).filter(
    (day) => noise(seedOf(member.id) * 31 + year * 12 + monthIndex * 37 + day) < perDay,
  );
  const lastVisit = member.lastVisitAt;
  if (lastVisit && monthKey(lastVisit) === month) {
    const lastVisitDay = new Date(lastVisit).getDate();
    return [...days.filter((day) => day < lastVisitDay), lastVisitDay];
  }
  return days;
}

export function memberDetail(id: string): MemberDetailDto | undefined {
  const record = recordOf(id);
  return record && { asOf: now, ...structuredClone(record.detail) };
}

export function memberVisits(id: string, month: string): MemberVisitsDto | undefined {
  const record = recordOf(id);
  const member = MEMBERS.find((m) => m.id === id);
  if (!record || !member) return undefined;
  const outsideMembership = month < monthKey(record.detail.memberSince) || month > monthKey(now);
  if (outsideMembership) return { month, days: [] };
  const days = record.visitDays.get(month) ?? generatedVisitDays(member, month);
  record.visitDays.set(month, days);
  return { month, days: [...days] };
}

function update(id: string, change: (detail: MemberRecord['detail']) => void, log: { title: string; detail: string }) {
  const record = recordOf(id);
  const member = MEMBERS.find((m) => m.id === id);
  if (!record || !member) throw new Error(`Unknown member ${id}`);
  change(record.detail);
  record.detail.changeLog.unshift({ id: `${id}-${record.detail.changeLog.length + 1}`, at: now, actor: OWNER, ...log });
  Object.assign(member, {
    status: record.detail.membership.status,
    planSlug: record.detail.membership.planSlug,
    planName: record.detail.membership.planName,
    expiresAt: record.detail.membership.endsAt,
  });
}

export function extendMembership(id: string, request: ExtendMembershipRequest) {
  update(
    id,
    (detail) => {
      const membership = detail.membership;
      const base = membership.endsAt > now ? membership.endsAt : dateOnly(now);
      if (request.mode === 'days') {
        membership.endsAt = addDays(base, request.days);
      } else {
        const plan = planOf(request.planSlug);
        Object.assign(membership, {
          planSlug: plan.slug,
          planName: plan.name,
          price: plan.price,
          durationDays: plan.durationDays,
          endsAt: addDays(base, plan.durationDays),
        });
        detail.payments.unshift({
          id: `${id}-pay-${detail.payments.length + 1}`,
          date: now,
          description: `${plan.name} · promjena plana`,
          method: membership.paymentMethod,
          status: 'PENDING',
          amount: plan.price,
        });
      }
      if (membership.status !== 'PAUSED') membership.status = 'ACTIVE';
    },
    request.mode === 'days'
      ? { title: 'Produljena članarina', detail: `+${request.days} dana` }
      : {
          title: 'Promijenjen plan',
          detail: `${planOf(request.planSlug).name} · +${planOf(request.planSlug).durationDays} dana`,
        },
  );
}

export function pauseMembership(id: string, days: number) {
  const from = dateOnly(now);
  const until = addDays(from, days);
  update(
    id,
    (detail) => {
      detail.membership.status = 'PAUSED';
      detail.membership.endsAt = addDays(detail.membership.endsAt, days);
      detail.pause.current = { from, until };
      detail.pause.history.unshift({ from, until, days });
    },
    { title: 'Pauzirana članarina', detail: `${formatDay(from)} – ${formatDay(until)}` },
  );
}

export function resumeMembership(id: string) {
  const today = dateOnly(now);
  update(
    id,
    (detail) => {
      const current = detail.pause.current;
      if (!current) return;
      const unused = Math.max(0, daysBetween(today, current.until));
      const used = Math.max(1, daysBetween(current.from, today));
      detail.membership.status = 'ACTIVE';
      detail.membership.endsAt = addDays(detail.membership.endsAt, -unused);
      detail.pause.current = null;
      detail.pause.nextAllowedFrom = addDays(today, PAUSE_COOLDOWN_DAYS);
      const latest = detail.pause.history[0];
      if (latest) Object.assign(latest, { until: today, days: used });
    },
    { title: 'Nastavljena članarina', detail: 'pauza prekinuta ranije' },
  );
}

export function cancelMembership(id: string) {
  update(
    id,
    (detail) => {
      detail.membership.status = 'CANCELLED';
      detail.membership.autoRenew = false;
      detail.membership.endsAt = dateOnly(now);
      detail.pause.current = null;
    },
    { title: 'Otkazana članarina', detail: 'prestaje odmah' },
  );
}

export function revealOib(id: string) {
  const record = recordOf(id);
  if (!record) throw new Error(`Unknown member ${id}`);
  const digits = Array.from({ length: 8 }, (_, i) => Math.floor(noise(seedOf(id) * 7 + i) * 10)).join('');
  return `${digits}${record.detail.oibLast3}`;
}
