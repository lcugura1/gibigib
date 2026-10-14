import type { ReactNode } from 'react';
import styles from './metric.module.css';

export const metricStyles = styles;

interface MetricValueProps {
  value: ReactNode;
  unit?: ReactNode;
}

export function MetricValue({ value, unit }: MetricValueProps) {
  return (
    <p className={styles.value}>
      {value}
      {unit !== undefined && <span className={styles.unit}> {unit}</span>}
    </p>
  );
}
