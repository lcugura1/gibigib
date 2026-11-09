import { formatAmount, formatInteger } from '../../shared/lib/format';

const thousands = new Intl.NumberFormat('hr-HR', { maximumFractionDigits: 1 });

export const formatEuro = (value: number) => `${value < 0 ? '−' : ''}${formatAmount(Math.abs(value))} €`;

export const formatWholeEuro = (value: number) => `${formatInteger(value)} €`;

export function formatAxisEuro(value: number, compact: boolean) {
  if (value === 0) return '0';
  const k = thousands.format(value / 1000);
  return compact ? `${k}k` : `${k} tis.`;
}
