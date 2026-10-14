import type { ReactNode } from 'react';
import styles from './delta.module.css';

interface DeltaProps {
  value: string;
  good: boolean;
  children: ReactNode;
  className?: string;
}

export function Delta({ value, good, children, className }: DeltaProps) {
  return (
    <p className={`${styles.row} ${className ?? ''}`}>
      <span className={`${styles.value} ${good ? styles.good : styles.bad}`}>{value}</span>
      <span>{children}</span>
    </p>
  );
}
