import { NavLink } from 'react-router';
import { Icon } from '../components/icon';
import { SectionLabel } from '../components/section-label';
import { Brand } from './brand';
import { MANAGEMENT_NAV, PRIMARY_NAV, type NavItem } from './navigation';
import styles from './sidebar.module.css';

function NavLinks({ items }: { items: readonly NavItem[] }) {
  return (
    <ul className={styles.group}>
      {items.map((item) => (
        <li key={item.href}>
          <NavLink className={styles.link} to={item.href} end={item.href === '/'}>
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export function Sidebar() {
  return (
    <nav className={styles.sidebar} aria-label="Glavna navigacija">
      <Brand className={styles.brand} />
      <NavLinks items={PRIMARY_NAV} />
      <SectionLabel className={styles.groupLabel}>Upravljanje</SectionLabel>
      <NavLinks items={MANAGEMENT_NAV} />
      <div className={styles.owner}>
        <span className={styles.ownerIcon}>
          <Icon name="person" />
        </span>
        <div>
          <b>Vlasnik</b>
          Sve teretane
        </div>
      </div>
    </nav>
  );
}
