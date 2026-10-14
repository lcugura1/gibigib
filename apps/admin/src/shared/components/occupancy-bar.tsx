import type { CSSProperties } from 'react';
import type { Level } from '../domain/occupancy';
import styles from './occupancy-bar.module.css';

interface OccupancyBarProps {
  share: number;
  level: Level;
  className?: string;
}

export function OccupancyBar({ share, level, className }: OccupancyBarProps) {
  const fill = { '--share': `${Math.min(1, share) * 100}%` } as CSSProperties;
  return (
    <div className={`${styles.bar} ${styles[level]} ${className ?? ''}`}>
      <div className={styles.fill} style={fill} />
    </div>
  );
}
