import type { MembershipStatus } from '@gibigib/types';
import type { Level } from '../../shared/domain/occupancy';

export const STATUS_LABEL: Record<MembershipStatus, string> = {
  ACTIVE: 'Aktivna',
  PAUSED: 'Pauzirana',
  EXPIRED: 'Istekla',
  CANCELLED: 'Otkazana',
};

export const STATUS_LEVEL: Record<MembershipStatus, Level | 'muted'> = {
  ACTIVE: 'ok',
  PAUSED: 'warn',
  EXPIRED: 'muted',
  CANCELLED: 'danger',
};

export const STATUS_OPTIONS = (Object.keys(STATUS_LABEL) as MembershipStatus[]).map((status) => ({
  value: status,
  label: STATUS_LABEL[status],
}));
