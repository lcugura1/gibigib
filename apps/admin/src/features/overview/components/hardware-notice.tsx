import type { LiveStatusDto } from '@gibigib/types';
import { Icon } from '../../../shared/components/icon';
import { StatusPill } from '../../../shared/components/status-pill';
import { formatTime } from '../../../shared/lib/format';
import styles from './hardware-notice.module.css';

const DEVICE_LABEL = { reader: 'Čitač na ulazu', controller: 'Kontroler vrata' } as const;

interface HardwareNoticeProps {
  status: LiveStatusDto;
}

export function HardwareNotice({ status }: HardwareNoticeProps) {
  const [device] = status.offlineDevices;
  if (!device) return null;
  const gymName = status.gyms.find((gym) => gym.id === device.gymId)?.name ?? '';

  return (
    <div className={styles.notice} role="status">
      <span className={styles.icon}>
        <Icon name="warning" />
      </span>
      <div className={styles.text}>
        <p className={styles.title}>
          {DEVICE_LABEL[device.kind]} u {gymName} je offline od {formatTime(device.offlineSince)}
        </p>
        <p className={styles.detail}>
          Članovi ne mogu skenirati kod. Ulazi i popunjenost za {gymName} nisu potpuni.
        </p>
      </div>
      <StatusPill level="danger">Offline</StatusPill>
      <a className={styles.action} href="/uredaji">
        Otvori uređaje
      </a>
    </div>
  );
}
