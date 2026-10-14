import type { ComponentPropsWithoutRef } from 'react';
import styles from './section-label.module.css';

export function SectionLabel({ className, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return <h2 className={`${styles.label} ${className ?? ''}`} {...rest} />;
}
