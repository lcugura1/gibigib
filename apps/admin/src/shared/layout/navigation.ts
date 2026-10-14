import type { IconName } from '../components/icon';

export interface NavItem {
  label: string;
  icon: IconName;
  href: string;
}

export interface NavStatus {
  gymCount: number;
  offlineDevices: number;
}

const OVERVIEW: NavItem = { label: 'Pregled', icon: 'home', href: '/' };
export const GYMS_NAV: NavItem = { label: 'Teretane', icon: 'barbell', href: '/teretane' };
export const MEMBERS_HREF = '/clanovi';
const MEMBERS: NavItem = { label: 'Članovi', icon: 'people', href: MEMBERS_HREF };
export const ENTRIES_HREF = '/ulazi';
const ENTRIES: NavItem = { label: 'Ulazi', icon: 'qr', href: ENTRIES_HREF };
const REVENUE: NavItem = { label: 'Prihodi', icon: 'card', href: '/prihodi' };

export const PRIMARY_NAV: readonly NavItem[] = [OVERVIEW, GYMS_NAV, MEMBERS, ENTRIES, REVENUE];

export const TAB_NAV: readonly NavItem[] = [OVERVIEW, MEMBERS, ENTRIES, REVENUE];

export const DEVICES_HREF = '/uredaji';

export const MANAGEMENT_NAV: readonly NavItem[] = [
  { label: 'Planovi', icon: 'tag', href: '/planovi' },
  { label: 'Događaji', icon: 'calendar', href: '/dogadaji' },
  { label: 'Treneri', icon: 'person', href: '/treneri' },
  { label: 'Uređaji', icon: 'chip', href: DEVICES_HREF },
  { label: 'Dnevnik promjena', icon: 'doc', href: '/dnevnik' },
  { label: 'Postavke', icon: 'gear', href: '/postavke' },
];
