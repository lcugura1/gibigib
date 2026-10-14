export const NOW = new Date(2026, 9, 13, 18, 0);

export const GYMS = [
  {
    id: 'v1',
    name: 'Varaždin I',
    city: 'Varaždin',
    address: 'Podravska ulica 14',
    capacity: 120,
    count: 37,
    members: 240,
  },
  {
    id: 'v2',
    name: 'Varaždin II',
    city: 'Varaždin',
    address: 'Ulica Miroslava Krleže 1a',
    capacity: 80,
    count: 21,
    members: 140,
  },
  { id: 'z1', name: 'Zagreb I', city: 'Zagreb', address: 'Lazinska ulica 40', capacity: 150, count: 96, members: 280 },
  {
    id: 'z2',
    name: 'Zagreb II',
    city: 'Zagreb',
    address: 'Zagrebačka cesta 143A',
    capacity: 100,
    count: 88,
    members: 190,
  },
] as const;

export type GymId = (typeof GYMS)[number]['id'];

export const PLANS = [
  { slug: 'mjesecno', name: 'Mjesečno', price: 29.99, durationDays: 30, monthlyPrice: 29.99 },
  { slug: 'grupni', name: 'Grupni program', price: 39.99, durationDays: 30, monthlyPrice: 39.99 },
  { slug: 'godisnji', name: 'Godišnji', price: 250, durationDays: 365, monthlyPrice: 250 / 12 },
  { slug: 'trener', name: '1 na 1 uz trenera', price: 120, durationDays: 30, monthlyPrice: 120 },
] as const;

export const PLAN_MIX: Record<GymId, readonly number[]> = {
  v1: [108, 46, 62, 24],
  v2: [66, 22, 40, 12],
  z1: [124, 56, 72, 28],
  z2: [85, 37, 47, 21],
};

export const at = (month: number, day: number, hour = 0, minute = 0) => new Date(2026, month - 1, day, hour, minute);

export const local = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

export function noise(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const mockState = new URLSearchParams(window.location.search).get('state');
