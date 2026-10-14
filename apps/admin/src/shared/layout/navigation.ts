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
export const REVENUE_HREF = '/prihodi';
const REVENUE: NavItem = { label: 'Prihodi', icon: 'card', href: REVENUE_HREF };

export const PRIMARY_NAV: readonly NavItem[] = [OVERVIEW, GYMS_NAV, MEMBERS, ENTRIES, REVENUE];

export const TAB_NAV: readonly NavItem[] = [OVERVIEW, MEMBERS, ENTRIES, REVENUE];

export const PLANS_HREF = '/planovi';
export const EVENTS_HREF = '/dogadaji';
export const TRAINERS_HREF = '/treneri';
export const DEVICES_HREF = '/uredaji';
export const AUDIT_HREF = '/dnevnik';
export const SETTINGS_HREF = '/postavke';
export const LOGIN_HREF = '/prijava';
export const LOGIN_RETURN_PARAM = 'povratak';

export const MANAGEMENT_NAV: readonly NavItem[] = [
  { label: 'Planovi', icon: 'tag', href: PLANS_HREF },
  { label: 'Događaji', icon: 'calendar', href: EVENTS_HREF },
  { label: 'Treneri', icon: 'person', href: TRAINERS_HREF },
  { label: 'Uređaji', icon: 'chip', href: DEVICES_HREF },
  { label: 'Dnevnik promjena', icon: 'doc', href: AUDIT_HREF },
  { label: 'Postavke', icon: 'gear', href: SETTINGS_HREF },
];
