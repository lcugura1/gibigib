import type { ComponentPropsWithoutRef } from 'react';
import { Link, type LinkProps } from 'react-router';
import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'outline' | 'text' | 'danger';

interface ButtonStyle {
  variant?: ButtonVariant;
  size?: 'regular' | 'small';
  block?: boolean;
}

export const buttonClass = ({ variant = 'primary', size = 'regular', block = false }: ButtonStyle, extra?: string) =>
  [styles.button, styles[variant], styles[size], block ? styles.block : '', extra ?? ''].join(' ');

type ButtonProps = ButtonStyle & ComponentPropsWithoutRef<'button'>;

export function Button({ variant, size, block, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, block }, className)} {...rest} />;
}

type ButtonLinkProps = ButtonStyle & LinkProps;

export function ButtonLink({ variant, size, block, className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClass({ variant, size, block }, className)} {...rest} />;
}
