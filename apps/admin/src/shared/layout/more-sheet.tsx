import { useId } from 'react';
import { NavLink } from 'react-router';
import { Dialog, dismissDialog } from '../components/dialog';
import glassStyles from '../components/glass.module.css';
import { Icon } from '../components/icon';
import { SectionLabel } from '../components/section-label';
import { StatusPill } from '../components/status-pill';
import { setSignedIn } from '../mock/session';
import { DEVICES_HREF, GYMS_NAV, LOGIN_HREF, MANAGEMENT_NAV, type NavStatus } from './navigation';
import styles from './more-sheet.module.css';

interface MoreSheetProps {
  status: NavStatus;
  onClose: () => void;
}

export function MoreSheet({ status, onClose }: MoreSheetProps) {
  const titleId = useId();

  return (
    <Dialog presentation="sheet" labelledBy={titleId} onClose={onClose}>
      <div className={styles.head}>
        <h2 id={titleId} className={styles.title}>
          Više
        </h2>
        <button type="button" className={glassStyles.glass} aria-label="Zatvori" onClick={dismissDialog}>
          <Icon name="close" />
        </button>
      </div>

      <ul className={styles.list}>
        <li>
          <NavLink className={styles.row} to={GYMS_NAV.href} onClick={dismissDialog}>
            <Icon name={GYMS_NAV.icon} />
            <span className={styles.label}>{GYMS_NAV.label}</span>
            <span className={styles.value}>{status.gymCount}</span>
            <Icon name="chevron" className={styles.chevron} />
          </NavLink>
        </li>
      </ul>

      <SectionLabel className={styles.groupLabel}>Upravljanje</SectionLabel>
      <ul className={styles.list}>
        {MANAGEMENT_NAV.map((item) => (
          <li key={item.href}>
            <NavLink className={styles.row} to={item.href} onClick={dismissDialog}>
              <Icon name={item.icon} />
              <span className={styles.label}>{item.label}</span>
              {item.href === DEVICES_HREF && status.offlineDevices > 0 && (
                <StatusPill level="danger">{status.offlineDevices} offline</StatusPill>
              )}
              <Icon name="chevron" className={styles.chevron} />
            </NavLink>
          </li>
        ))}
      </ul>

      <ul className={styles.list}>
        <li>
          <NavLink
            className={`${styles.row} ${styles.danger}`}
            to={LOGIN_HREF}
            replace
            onClick={(event) => {
              setSignedIn(false);
              dismissDialog(event);
            }}
          >
            <Icon name="logout" />
            <span className={styles.label}>Odjava</span>
          </NavLink>
        </li>
      </ul>
    </Dialog>
  );
}
