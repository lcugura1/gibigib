import type { ReactNode } from 'react';
import styles from './segmented-control.module.css';

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
  count?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'regular' | 'small';
  fill?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'regular',
  fill = false,
  className,
}: SegmentedControlProps<T>) {
  const classes = [styles.track, styles[size], fill ? styles.fill : '', className ?? ''].join(' ');
  return (
    <div className={classes} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.option}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined && <span className={styles.count}>{option.count}</span>}
        </button>
      ))}
    </div>
  );
}
