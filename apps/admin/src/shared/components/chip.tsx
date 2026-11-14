import type { CSSProperties, ReactNode } from 'react';
import styles from './chip.module.css';

interface ChipProps {
  color: string;
  active: boolean;
  meta?: ReactNode;
  onToggle: () => void;
  className?: string;
  children: ReactNode;
}

export function Chip({ color, active, meta, onToggle, className, children }: ChipProps) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${className ?? ''}`}
      style={{ '--tag': color } as CSSProperties}
      aria-pressed={active}
      onClick={onToggle}
    >
      <span className={styles.dot} />
      {children}
      {meta !== undefined && <span className={styles.meta}>{meta}</span>}
    </button>
  );
}
