import type { ReactNode } from 'react';
import { BackBar } from './back-bar';
import styles from './master-detail.module.css';
import { useSplitLayout } from './viewport';

interface MasterDetailProps {
  header: ReactNode;
  back: { to: string; label: string };
  detailOpen: boolean;
  status?: ReactNode;
  list: ReactNode;
  detail: ReactNode;
  busy?: boolean;
}

export function MasterDetail({ header, back, detailOpen, status, list, detail, busy }: MasterDetailProps) {
  const split = useSplitLayout();

  if (!split && detailOpen) {
    return (
      <div className={styles.screen} aria-busy={busy}>
        <BackBar to={back.to} label={back.label} phoneTitle={back.label} />
        {status}
        {detail}
      </div>
    );
  }

  return (
    <div className={styles.screen} aria-busy={busy}>
      {header}
      {status}
      <div className={split ? styles.split : styles.single}>
        <div className={styles.list}>{list}</div>
        {split && <div className={styles.detail}>{detail}</div>}
      </div>
    </div>
  );
}
