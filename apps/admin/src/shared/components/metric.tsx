import type { ReactNode } from 'react';
import styles from './metric.module.css';

export const metricStyles = styles;

interface MetricValueProps {
  value: ReactNode;
  unit?: ReactNode;
  className?: string;
}

export function MetricValue({ value, unit, className }: MetricValueProps) {
  return (
    <p className={`${styles.value} ${className ?? ''}`}>
      {value}
      {unit !== undefined && <span className={styles.unit}> {unit}</span>}
    </p>
  );
}
