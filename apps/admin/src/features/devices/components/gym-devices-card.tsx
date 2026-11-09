import { useMemo, useState, type CSSProperties } from 'react';
import type { DeviceDto, GymDevicesDto } from '@gibigib/types';
import { Button } from '../../../shared/components/button';
import { Card } from '../../../shared/components/card';
import { Icon } from '../../../shared/components/icon';
import { StatusPill } from '../../../shared/components/status-pill';
import { useViewport } from '../../../shared/layout/viewport';
import { formatDayMonth, formatTime } from '../../../shared/lib/format';
import { useObservable } from '../../../shared/lib/use-observable';
import { OpenDoorDialog } from '../../gyms/components/open-door-dialog';
import { doorUnlocked$ } from '../../gyms/services/gym-state';
import styles from './gym-devices-card.module.css';

const DAY_MS = 86_400_000;
const RECENT_DAYS = 7;

const DEVICE_NAME = { reader: 'Čitač kodova', controller: 'Kontroler vrata' } as const;
const DEVICE_ICON = { reader: 'qr', controller: 'chip' } as const;

const sameDay = (a: string, b: string) => a.slice(0, 10) === b.slice(0, 10);

function manualNote(gym: GymDevicesDto, asOf: string) {
  if (gym.devices.some((device) => device.kind === 'reader' && !device.online)) return 'Do popravka otvaraj ručno';
  const last = gym.lastManualOpenAt;
  if (!last || new Date(asOf).getTime() - new Date(last).getTime() > RECENT_DAYS * DAY_MS)
    return `Bez ručnih otvaranja u zadnjih ${RECENT_DAYS} dana`;
  return sameDay(last, asOf)
    ? `Zadnje ručno otvaranje danas u ${formatTime(last)}`
    : `Zadnje ručno otvaranje ${formatDayMonth(last)}`;
}

function DeviceRow({ device, compact }: { device: DeviceDto; compact: boolean }) {
  return (
    <li className={device.online ? styles.device : `${styles.device} ${styles.offline}`}>
      <span className={styles.tile} aria-hidden="true">
        <Icon name={DEVICE_ICON[device.kind]} />
      </span>
      <span className={styles.deviceText}>
        <b>{device.kind === 'reader' && !compact ? `${DEVICE_NAME.reader} · glavni ulaz` : DEVICE_NAME[device.kind]}</b>
        <span>
          {device.online
            ? device.lastEventAt && `Zadnji događaj ${formatTime(device.lastEventAt)}`
            : device.offlineSince && `Offline od ${formatTime(device.offlineSince)}`}
        </span>
      </span>
      {device.online ? <StatusPill level="ok">Online</StatusPill> : <StatusPill level="danger">Offline</StatusPill>}
    </li>
  );
}

interface GymDevicesCardProps {
  gym: GymDevicesDto;
  color: string;
  asOf: string;
}

export function GymDevicesCard({ gym, color, asOf }: GymDevicesCardProps) {
  const compact = useViewport() === 'phone';
  const [confirming, setConfirming] = useState(false);
  const unlocked$ = useMemo(() => doorUnlocked$(gym.gymId), [gym.gymId]);
  const unlocked = useObservable(unlocked$, false);
  const healthy = gym.devices.every((device) => device.online);
  const controllerOnline = gym.devices.some((device) => device.kind === 'controller' && device.online);
  const headingId = `devices-${gym.gymId}`;

  return (
    <Card className={styles.card} aria-labelledby={headingId}>
      <div className={styles.head}>
        <div>
          <h2 id={headingId} className={styles.name} style={{ '--tag': color } as CSSProperties}>
            {gym.name}
          </h2>
          {!compact && (
            <p className={styles.address}>
              {gym.address}, {gym.city}
            </p>
          )}
        </div>
        {healthy ? <StatusPill level="ok">Sve radi</StatusPill> : <StatusPill level="danger">Treba pažnju</StatusPill>}
      </div>
      <ul className={styles.devices}>
        {gym.devices.map((device) => (
          <DeviceRow key={device.id} device={device} compact={compact} />
        ))}
      </ul>
      <div className={styles.foot}>
        {!compact && <p className={styles.note}>{manualNote(gym, asOf)}</p>}
        <Button
          variant="outline"
          size="small"
          block={compact}
          disabled={!controllerOnline || unlocked}
          onClick={() => setConfirming(true)}
        >
          <Icon name="unlock" />
          {unlocked ? 'Vrata otključana' : 'Otvori vrata'}
        </Button>
      </div>
      {!controllerOnline && (
        <p className={styles.warning}>Kontroler je offline pa se vrata ne mogu otvoriti na daljinu.</p>
      )}
      {confirming && (
        <OpenDoorDialog
          gym={{ id: gym.gymId, name: gym.name, address: gym.address }}
          presentation={compact ? 'sheet' : 'popup'}
          onClose={() => setConfirming(false)}
        />
      )}
    </Card>
  );
}
