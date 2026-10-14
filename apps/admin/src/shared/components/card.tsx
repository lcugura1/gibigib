import type { ComponentPropsWithoutRef } from 'react';
import styles from './card.module.css';

export type CardVariant = 'dark' | 'flat' | 'light';

export const cardClass = (variant: CardVariant = 'dark') =>
  variant === 'dark' ? styles.card : `${styles.card} ${styles[variant]}`;

interface CardProps extends ComponentPropsWithoutRef<'section'> {
  variant?: CardVariant;
}

export function Card({ variant, className, ...rest }: CardProps) {
  return <section className={`${cardClass(variant)} ${className ?? ''}`} {...rest} />;
}
