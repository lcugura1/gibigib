import type { IconName } from '../components/icon';

export interface NavItem {
  label: string;
  icon: IconName;
  href: string;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: 'Pregled', icon: 'home', href: '/' },
  { label: 'Teretane', icon: 'barbell', href: '/teretane' },
  { label: 'Članovi', icon: 'people', href: '/clanovi' },
  { label: 'Ulazi', icon: 'qr', href: '/ulazi' },
  { label: 'Prihodi', icon: 'card', href: '/prihodi' },
];

export const MANAGEMENT_NAV: readonly NavItem[] = [
  { label: 'Planovi', icon: 'tag', href: '/planovi' },
  { label: 'Događaji', icon: 'calendar', href: '/dogadaji' },
  { label: 'Treneri', icon: 'person', href: '/treneri' },
  { label: 'Uređaji', icon: 'chip', href: '/uredaji' },
  { label: 'Dnevnik promjena', icon: 'doc', href: '/dnevnik' },
  { label: 'Postavke', icon: 'gear', href: '/postavke' },
];
