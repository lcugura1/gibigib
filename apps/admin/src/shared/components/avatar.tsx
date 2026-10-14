import { initials } from '../lib/format';
import styles from './avatar.module.css';

interface AvatarProps {
  name: string;
  onLight?: boolean;
}

export function Avatar({ name, onLight = false }: AvatarProps) {
  return (
    <span className={onLight ? `${styles.avatar} ${styles.light}` : styles.avatar} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
