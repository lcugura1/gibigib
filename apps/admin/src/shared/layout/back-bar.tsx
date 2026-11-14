import { Link, useNavigate } from 'react-router';
import glassStyles from '../components/glass.module.css';
import { Icon } from '../components/icon';
import { SearchField } from '../components/search-field';
import { useObservable } from '../lib/use-observable';
import styles from './back-bar.module.css';
import { memberSearch$, setMemberSearch } from './member-search';
import { MEMBERS_HREF } from './navigation';
import { useViewport } from './viewport';

interface BackBarProps {
  to: string;
  label: string;
  phoneTitle: string;
}

export function BackBar({ to, label, phoneTitle }: BackBarProps) {
  const viewport = useViewport();
  const search = useObservable(memberSearch$, memberSearch$.value);
  const navigate = useNavigate();

  if (viewport === 'phone') {
    return (
      <header className={styles.phone}>
        <Link className={glassStyles.glass} to={to} aria-label={`Natrag: ${label}`}>
          <Icon name="chevronLeft" />
        </Link>
        <p className={styles.phoneTitle}>{phoneTitle}</p>
      </header>
    );
  }

  return (
    <header className={styles.bar}>
      <Link className={styles.crumb} to={to}>
        <Icon name="chevronLeft" />
        {label}
      </Link>
      <SearchField
        className={styles.search}
        value={search}
        onChange={setMemberSearch}
        onSubmit={() => navigate(MEMBERS_HREF)}
      />
    </header>
  );
}
