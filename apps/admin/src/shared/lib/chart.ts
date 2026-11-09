import type { CSSProperties } from 'react';

const TICK_COUNT = 4;

export function niceStep(max: number) {
  const raw = max / TICK_COUNT;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((k) => k * magnitude).find((step) => step >= raw) ?? raw;
}

export function niceTicks(max: number) {
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step) };
}

export const position = (fraction: number) => ({ '--at': `${(fraction * 100).toFixed(2)}%` }) as CSSProperties;
