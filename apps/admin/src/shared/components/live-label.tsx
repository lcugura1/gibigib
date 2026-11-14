import type { ReactNode } from 'react';
import styles from './live-label.module.css';

export function LiveLabel({ live, children }: { live: boolean; children: ReactNode }) {
  return (
    <span className={styles.label}>
      {live && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
