import { Link, NavLink } from 'react-router';
import { Icon } from '../components/icon';
import { MANAGEMENT_NAV, PRIMARY_NAV, type NavItem } from './navigation';
import styles from './rail.module.css';

function RailLinks({ items }: { items: readonly NavItem[] }) {
  return (
    <ul className={styles.group}>
      {items.map((item) => (
        <li key={item.href}>
          <NavLink
            className={styles.link}
            to={item.href}
            end={item.href === '/'}
            title={item.label}
            aria-label={item.label}
          >
            <Icon name={item.icon} />
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export function Rail() {
  return (
    <nav className={styles.rail} aria-label="Glavna navigacija">
      <Link className={styles.brand} to="/" aria-label="GibiGib Admin">
        GG
      </Link>
      <RailLinks items={PRIMARY_NAV} />
      <span className={styles.separator} />
      <RailLinks items={MANAGEMENT_NAV} />
    </nav>
  );
}
