import { Link } from 'react-router';
import type { LiveStatusDto } from '@gibigib/types';
import { Icon } from '../../../shared/components/icon';
import { StatusPill } from '../../../shared/components/status-pill';
import { DEVICES_HREF } from '../../../shared/layout/navigation';
import { useViewport } from '../../../shared/layout/viewport';
import { formatTime } from '../../../shared/lib/format';
import styles from './hardware-notice.module.css';

const DEVICE_LABEL = { reader: 'Čitač na ulazu', controller: 'Kontroler vrata' } as const;
const DEVICE_SHORT = { reader: 'čitač', controller: 'kontroler' } as const;

interface HardwareNoticeProps {
  status: LiveStatusDto;
}

export function HardwareNotice({ status }: HardwareNoticeProps) {
  const viewport = useViewport();
  const [device] = status.offlineDevices;
  if (!device) return null;
  const gymName = status.gyms.find((gym) => gym.id === device.gymId)?.name ?? '';
  const since = formatTime(device.offlineSince);
  const icon = (
    <span className={styles.icon}>
      <Icon name="warning" />
    </span>
  );

  if (viewport === 'phone') {
    return (
      <Link className={styles.notice} to={DEVICES_HREF} role="status">
        {icon}
        <div className={styles.text}>
          <p className={styles.title}>
            {gymName} · {DEVICE_SHORT[device.kind]} offline
          </p>
          <p className={styles.detail}>Od {since} članovi ne mogu ući kodom.</p>
        </div>
        <Icon name="chevron" className={styles.chevron} />
      </Link>
    );
  }

  return (
    <div className={styles.notice} role="status">
      {icon}
      <div className={styles.text}>
        <p className={styles.title}>
          {DEVICE_LABEL[device.kind]} u {gymName} je offline od {since}
        </p>
        <p className={styles.detail}>Članovi ne mogu skenirati kod. Ulazi i popunjenost za {gymName} nisu potpuni.</p>
      </div>
      <span className={styles.pill}>
        <StatusPill level="danger">Offline</StatusPill>
      </span>
      <Link className={styles.action} to={DEVICES_HREF}>
        Otvori uređaje
      </Link>
    </div>
  );
}
