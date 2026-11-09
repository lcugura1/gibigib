import type { CSSProperties, ReactNode } from 'react';
import styles from './skeleton.module.css';

interface SkeletonProps {
  width?: string;
  height: string;
  shape?: 'line' | 'block' | 'pill' | 'circle';
  className?: string;
}

export function Skeleton({ width = '100%', height, shape = 'line', className }: SkeletonProps) {
  const size = { inlineSize: width, blockSize: height } as CSSProperties;
  return <span className={`${styles.bone} ${styles[shape]} ${className ?? ''}`} style={size} />;
}

interface SkeletonCardProps {
  className?: string;
  children: ReactNode;
}

export function SkeletonCard({ className, children }: SkeletonCardProps) {
  return <div className={`${styles.card} ${className ?? ''}`}>{children}</div>;
}
