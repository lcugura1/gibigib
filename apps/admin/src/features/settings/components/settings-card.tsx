import type { ReactNode } from 'react';
import { SectionLabel } from '../../../shared/components/section-label';
import { useViewport } from '../../../shared/layout/viewport';
import styles from './settings-card.module.css';

interface SettingsCardProps {
  id: string;
  label: string;
  aside?: ReactNode;
  flush?: boolean;
  children: ReactNode;
}

export function SettingsCard({ id, label, aside, flush = false, children }: SettingsCardProps) {
  const phone = useViewport() === 'phone';
  const cardClass = flush ? `${styles.card} ${styles.flush}` : styles.card;
  const head = (
    <div className={styles.head}>
      <SectionLabel id={id}>{label}</SectionLabel>
      {aside}
    </div>
  );

  if (phone) {
    return (
      <section className={styles.section} aria-labelledby={id}>
        {head}
        <div className={cardClass}>{children}</div>
      </section>
    );
  }

  return (
    <section className={cardClass} aria-labelledby={id}>
      {head}
      {children}
    </section>
  );
}
