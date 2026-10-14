import { Skeleton } from './skeleton';
import styles from './list-skeleton.module.css';

const ROWS = 8;
const NAME_WIDTHS = ['55%', '45%', '62%', '50%', '58%', '40%', '52%', '47%'];

export function ListSkeleton({ variant }: { variant: 'table' | 'cards' }) {
  return (
    <ul className={`${styles.list} ${styles[variant]}`} aria-hidden="true">
      {Array.from({ length: ROWS }, (_, i) => (
        <li key={i} className={styles.row}>
          <Skeleton width="2.75rem" height="2.75rem" shape="circle" />
          <span className={styles.text}>
            <Skeleton width={NAME_WIDTHS[i]} height="0.75rem" />
            <Skeleton width="80%" height="0.625rem" />
            {variant === 'cards' && <Skeleton width="70%" height="0.625rem" className={styles.stats} />}
          </span>
          <Skeleton width="4rem" height="1.5rem" shape="block" />
        </li>
      ))}
    </ul>
  );
}
