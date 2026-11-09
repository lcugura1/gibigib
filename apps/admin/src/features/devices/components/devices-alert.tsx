import type { DevicesDto } from '@gibigib/types';
import { Icon } from '../../../shared/components/icon';
import { StatusPill } from '../../../shared/components/status-pill';
import { useViewport } from '../../../shared/layout/viewport';
import { formatTime } from '../../../shared/lib/format';
import styles from './devices-alert.module.css';

const DEVICE_PHRASE = { reader: 'čitač na ulazu', controller: 'kontroler vrata' } as const;
const DEVICE_SHORT = { reader: 'čitač', controller: 'kontroler' } as const;
const HELP = {
  reader: 'Članovi ne mogu skenirati kod. Provjeri napajanje i mrežni kabel čitača, a do tada otvaraj vrata ručno.',
  controller: 'Vrata se ne otvaraju ni kodom ni na daljinu. Provjeri napajanje i mrežni kabel kontrolera.',
} as const;

function formatDowntime(fromIso: string, toIso: string) {
  const minutes = Math.max(0, Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return minutes % 60 === 0 ? `${hours} h` : `${hours} h ${minutes % 60} min`;
}

export function DevicesAlert({ data }: { data: DevicesDto }) {
  const compact = useViewport() === 'phone';
  const problems = data.gyms.flatMap((gym) =>
    gym.devices.filter((device) => !device.online && device.offlineSince).map((device) => ({ gym, device })),
  );

  return (
    <>
      {problems.map(({ gym, device }) => {
        const since = device.offlineSince ?? data.asOf;
        return (
          <div key={device.id} className={styles.alert} role="alert">
            <span className={styles.icon} aria-hidden="true">
              <Icon name="warning" />
            </span>
            <div className={styles.text}>
              <p className={styles.title}>
                {compact
                  ? `${gym.name} · ${DEVICE_SHORT[device.kind]} offline`
                  : `${gym.name} · ${DEVICE_PHRASE[device.kind]} je offline od ${formatTime(since)}`}
              </p>
              <p className={styles.detail}>
                {compact ? `Od ${formatTime(since)}. Provjeri napajanje i mrežu.` : HELP[device.kind]}
              </p>
            </div>
            {!compact && <StatusPill level="danger">Offline {formatDowntime(since, data.asOf)}</StatusPill>}
          </div>
        );
      })}
    </>
  );
}
