import type { ReactNode } from 'react';
import { Icon, type IconName } from './icon';
import styles from './empty-state.module.css';

interface EmptyStateProps {
  title?: string;
  icon?: IconName;
  action?: { label: string; onClick: () => void };
  size?: 'large' | 'small';
  className?: string;
  children?: ReactNode;
}

export function EmptyState({ title, icon, action, size = 'large', className, children }: EmptyStateProps) {
  return (
    <div className={`${styles.empty} ${styles[size]} ${className ?? ''}`}>
      {icon && (
        <span className={styles.icon}>
          <Icon name={icon} />
        </span>
      )}
      {title && <h3 className={styles.title}>{title}</h3>}
      {children && <p className={styles.text}>{children}</p>}
      {action && (
        <button type="button" className={styles.action} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
