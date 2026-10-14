import { Icon } from '../components/icon';
import { SectionLabel } from '../components/section-label';
import { MANAGEMENT_NAV, PRIMARY_NAV, type NavItem } from './navigation';
import styles from './sidebar.module.css';

interface SidebarProps {
  currentHref: string;
}

function NavLinks({ items, currentHref }: { items: readonly NavItem[]; currentHref: string }) {
  return (
    <ul className={styles.group}>
      {items.map((item) => (
        <li key={item.href}>
          <a className={styles.link} href={item.href} aria-current={item.href === currentHref ? 'page' : undefined}>
            <Icon name={item.icon} />
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Sidebar({ currentHref }: SidebarProps) {
  return (
    <nav className={styles.sidebar} aria-label="Glavna navigacija">
      <a className={styles.brand} href="/">
        GIBI GIB<small>ADMIN</small>
      </a>
      <NavLinks items={PRIMARY_NAV} currentHref={currentHref} />
      <SectionLabel className={styles.groupLabel}>Upravljanje</SectionLabel>
      <NavLinks items={MANAGEMENT_NAV} currentHref={currentHref} />
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
