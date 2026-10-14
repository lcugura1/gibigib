import type { ReactNode } from 'react';
import { ButtonLink } from '../components/button';
import glassStyles from '../components/glass.module.css';
import { Icon } from '../components/icon';
import { Link } from 'react-router';
import { openMoreSheet } from './more-sheet-state';
import { MemberSearch, ProfileButton } from './page-header';
import styles from './management-header.module.css';
import { useViewport } from './viewport';

interface ManagementHeaderProps {
  title: string;
  subtitle: ReactNode;
  action?: { label: string; to: string };
  phoneAction?: ReactNode;
  search?: boolean;
}

export function ManagementHeader({ title, subtitle, action, phoneAction, search = false }: ManagementHeaderProps) {
  const phone = useViewport() === 'phone';
  const titles = (
    <div className={styles.titles}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );

  if (phone) {
    return (
      <header className={styles.phone}>
        <div className={styles.topBar}>
          <button type="button" className={glassStyles.glass} aria-label="Natrag: Upravljanje" onClick={openMoreSheet}>
            <Icon name="chevronLeft" />
          </button>
          <p className={styles.section}>Upravljanje</p>
          {phoneAction ??
            (action ? (
              <Link className={glassStyles.glass} to={action.to} aria-label={action.label}>
                <Icon name="plus" />
              </Link>
            ) : (
              <span />
            ))}
        </div>
        {titles}
      </header>
    );
  }

  return (
    <header className={styles.header}>
      {titles}
      {search && <MemberSearch className={styles.search} />}
      {action && (
        <ButtonLink variant="outline" size="small" to={action.to}>
          <Icon name="plus" />
          {action.label}
        </ButtonLink>
      )}
      <ProfileButton />
    </header>
  );
}
