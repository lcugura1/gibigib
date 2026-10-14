import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Icon } from '../components/icon';
import { MoreSheet } from './more-sheet';
import { TAB_NAV, type NavStatus } from './navigation';
import styles from './tab-bar.module.css';

interface TabBarProps {
  status: NavStatus;
}

const isUnder = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export function TabBar({ status }: TabBarProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const { pathname } = useLocation();
  const inMoreSection = !TAB_NAV.some((item) => isUnder(pathname, item.href));

  return (
    <>
      <nav className={styles.bar} aria-label="Glavna navigacija">
        <ul className={styles.items}>
          {TAB_NAV.map((item) => (
            <li key={item.href}>
              <NavLink className={styles.tab} to={item.href} end={item.href === '/'}>
                <Icon name={item.icon} />
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={`${styles.tab} ${inMoreSection ? styles.current : ''}`}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen(true)}
            >
              <Icon name="more" />
              Više
            </button>
          </li>
        </ul>
      </nav>
      {moreOpen && <MoreSheet status={status} onClose={() => setMoreOpen(false)} />}
    </>
  );
}
