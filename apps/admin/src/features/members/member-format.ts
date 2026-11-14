import { formatDate, formatDayMonth, formatTime } from '../../shared/lib/format';
import { daysBetween } from './inactivity';

const sameYear = (iso: string, now: string) => new Date(iso).getFullYear() === new Date(now).getFullYear();

export const formatShortDate = (iso: string, now: string) =>
  sameYear(iso, now) ? formatDayMonth(iso) : formatDate(iso);

export function formatLastVisit(iso: string | null, now: string, style: 'table' | 'inline') {
  if (!iso) return 'Nikad';
  if (daysBetween(iso, now) === 0) return style === 'table' ? `Danas, ${formatTime(iso)}` : `danas ${formatTime(iso)}`;
  return formatShortDate(iso, now);
}
