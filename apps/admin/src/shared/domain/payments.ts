import type { AdminPaymentStatus } from '@gibigib/types';
import type { Level } from './occupancy';

export const PAYMENT_STATUS: Record<AdminPaymentStatus, { label: string; level: Level | 'muted' }> = {
  PAID: { label: 'Plaćeno', level: 'ok' },
  PENDING: { label: 'Na čekanju', level: 'warn' },
  FAILED: { label: 'Neuspjelo', level: 'danger' },
  REFUNDED: { label: 'Povrat', level: 'muted' },
};
