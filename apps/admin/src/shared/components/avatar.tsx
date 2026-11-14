import { initials } from '../lib/format';
import styles from './avatar.module.css';

interface AvatarProps {
  name: string;
  onLight?: boolean;
  size?: 'regular' | 'large' | 'hero';
}

export function Avatar({ name, onLight = false, size = 'regular' }: AvatarProps) {
  const classes = [styles.avatar, onLight ? styles.light : '', size === 'regular' ? '' : styles[size]].join(' ');
  return (
    <span className={classes} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
