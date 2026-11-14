import { useId } from 'react';
import styles from './sparkline.module.css';

const HEIGHT = 52;
const TOP = 10;
const BOTTOM = 46;

function linePath(values: readonly number[]) {
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const last = Math.max(1, values.length - 1);
  return values
    .map((value, i) => {
      const x = ((i / last) * 100).toFixed(1);
      const y = (BOTTOM - ((value - min) / span) * (BOTTOM - TOP)).toFixed(1);
      return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join('');
}

interface SparklineProps {
  values: readonly number[];
  className?: string;
}

export function Sparkline({ values, className }: SparklineProps) {
  const fillId = useId();
  const line = linePath(values);
  return (
    <svg
      className={`${styles.spark} ${className ?? ''}`}
      viewBox={`0 0 100 ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop className={styles.stop} offset="0" stopOpacity="0.28" />
          <stop className={styles.stop} offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path fill={`url(#${fillId})`} d={`${line}L100 ${HEIGHT}L0 ${HEIGHT}Z`} />
      <path className={styles.line} d={line} />
    </svg>
  );
}
