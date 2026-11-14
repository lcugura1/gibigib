import type { EntryDenialReason } from '@gibigib/types';

export const DENIAL_REASON: Record<EntryDenialReason, string> = {
  EXPIRED: 'Članarina istekla',
  PAUSED: 'Članarina pauzirana',
  CANCELLED: 'Članarina otkazana',
  INVALID_CODE: 'Nevažeći kod',
};
