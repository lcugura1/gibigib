import type { ReactNode } from 'react';
import type { Level } from '../domain/occupancy';
import styles from './status-pill.module.css';

interface StatusPillProps {
  level: Level | 'muted';
  children: ReactNode;
}

export function StatusPill({ level, children }: StatusPillProps) {
  return <span className={`${styles.pill} ${styles[level]}`}>{children}</span>;
}
