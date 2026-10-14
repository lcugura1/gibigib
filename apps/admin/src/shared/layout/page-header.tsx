import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import glassStyles from '../components/glass.module.css';
import { Icon } from '../components/icon';
import { SearchField } from '../components/search-field';
import { useObservable } from '../lib/use-observable';
import { Brand } from './brand';
import { memberSearch$, setMemberSearch } from './member-search';
import { MEMBERS_HREF } from './navigation';
import styles from './page-header.module.css';
import { useViewport } from './viewport';

interface PageHeaderProps {
  title: string;
  subtitle: ReactNode;
  phoneAction?: ReactNode;
}

export function ProfileButton() {
  return (
    <button className={styles.profile} type="button" aria-label="Profil vlasnika">
      <Icon name="person" />
    </button>
  );
}

export function PageHeader({ title, subtitle, phoneAction }: PageHeaderProps) {
  const viewport = useViewport();
  const search = useObservable(memberSearch$, memberSearch$.value);
  const navigate = useNavigate();
  const onMembers = useLocation().pathname === MEMBERS_HREF;
  const titles = (
    <div className={styles.titles}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );

  if (viewport === 'phone') {
    return (
      <header className={styles.phone}>
        <div className={styles.topBar}>
          <Brand className={styles.brand} />
          {!onMembers && (
            <Link className={glassStyles.glass} to={MEMBERS_HREF} aria-label="Pretraži članove">
              <Icon name="search" />
            </Link>
          )}
          <ProfileButton />
        </div>
        <div className={styles.titleRow}>
          {titles}
          {phoneAction}
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      {titles}
      <SearchField
        className={styles.search}
        value={search}
        onChange={setMemberSearch}
        onSubmit={() => !onMembers && navigate(MEMBERS_HREF)}
      />
      <ProfileButton />
    </header>
  );
}
