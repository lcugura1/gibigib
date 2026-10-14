import type { ReactNode } from 'react';
import type { Level } from '../domain/occupancy';
import styles from './status-pill.module.css';

interface StatusPillProps {
  level: Level | 'muted';
  solid?: boolean;
  onLight?: boolean;
  children: ReactNode;
}

export function StatusPill({ level, solid = false, onLight = false, children }: StatusPillProps) {
  const variant = solid ? styles.solid : onLight ? styles.onLight : '';
  return <span className={`${styles.pill} ${styles[level]} ${variant}`}>{children}</span>;
}
