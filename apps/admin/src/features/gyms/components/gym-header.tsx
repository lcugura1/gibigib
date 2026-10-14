import { useMemo, useState, type CSSProperties } from 'react';
import type { GymDetailDto } from '@gibigib/types';
import { Link } from 'react-router';
import { Icon } from '../../../shared/components/icon';
import { SectionLabel } from '../../../shared/components/section-label';
import { StatusPill } from '../../../shared/components/status-pill';
import { DEVICES_HREF } from '../../../shared/layout/navigation';
import { useViewport } from '../../../shared/layout/viewport';
import { formatInteger, formatTime } from '../../../shared/lib/format';
import { useObservable } from '../../../shared/lib/use-observable';
import { formatOpeningHours } from '../gym-format';
import { doorUnlocked$ } from '../services/gym-state';
import { OpenDoorDialog } from './open-door-dialog';
import styles from './gym-header.module.css';

interface GymHeaderProps {
  detail: GymDetailDto;
  color: string;
}

function DevicePill({ label, online }: { label: string; online: boolean }) {
  return <StatusPill level={online ? 'ok' : 'danger'}>{`${label} ${online ? 'online' : 'offline'}`}</StatusPill>;
}

export function GymHeader({ detail, color }: GymHeaderProps) {
  const compact = useViewport() === 'phone';
  const [dialogOpen, setDialogOpen] = useState(false);
  const unlocked$ = useMemo(() => doorUnlocked$(detail.gym.id), [detail.gym.id]);
  const unlocked = useObservable(unlocked$, false);
  const { gym, devices } = detail;
  const controllerOffline = !devices.controller.online;

  return (
    <header className={compact ? styles.phone : styles.header}>
      <div className={styles.identity}>
        {!compact && <SectionLabel>Teretana</SectionLabel>}
        <h1 className={styles.name} style={{ '--tag': color } as CSSProperties}>
          {gym.name}
        </h1>
        {compact ? (
          <p className={styles.meta}>
            <Icon name="pin" />
            {gym.address} · kapacitet {formatInteger(gym.capacity)}
          </p>
        ) : (
          <ul className={styles.meta}>
            <li>
              <Icon name="pin" />
              {gym.address}, {gym.city}
            </li>
            <li>
              <Icon name="people" />
              Kapacitet {formatInteger(gym.capacity)}
            </li>
            <li>
              <Icon name="clock" />
              {formatOpeningHours(gym.openingHours)}
            </li>
          </ul>
        )}
      </div>

      <div className={styles.status}>
        <div className={styles.devices}>
          <DevicePill label="Čitač" online={devices.reader.online} />
          <DevicePill label="Kontroler" online={devices.controller.online} />
        </div>
        {!compact && (
          <p className={styles.lastEvent}>
            {devices.lastEventAt && <>Zadnji događaj {formatTime(devices.lastEventAt)} · </>}
            <Link to={DEVICES_HREF}>Uređaji</Link>
          </p>
        )}
      </div>

      <button
        type="button"
        className={styles.door}
        disabled={controllerOffline || unlocked}
        onClick={() => setDialogOpen(true)}
      >
        <Icon name="unlock" />
        {unlocked ? 'Vrata otključana' : 'Otvori vrata'}
      </button>
      {controllerOffline && <p className={styles.doorNote}>Kontroler vrata je offline pa se vrata ne mogu otvoriti.</p>}

      {dialogOpen && (
        <OpenDoorDialog
          detail={detail}
          presentation={compact ? 'sheet' : 'popup'}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </header>
  );
}
