import type { SettingsDto } from '@gibigib/types';
import { StatusPill } from '../../../shared/components/status-pill';
import { useViewport } from '../../../shared/layout/viewport';
import { InlineSaveField } from './inline-save-field';
import { SettingsCard } from './settings-card';
import styles from './occupancy-card.module.css';

const WINDOW_MIN = 15;
const WINDOW_MAX = 240;

interface OccupancyCardProps {
  occupancy: SettingsDto['occupancy'];
  onSave: (minutes: number) => Promise<void>;
}

export function OccupancyCard({ occupancy, onSave }: OccupancyCardProps) {
  const phone = useViewport() === 'phone';
  const { comfortableBelow: low, busyFrom: high } = occupancy;

  const levels = (
    <ul className={styles.levels} aria-label="Razine popunjenosti">
      <li>
        <StatusPill level="ok">{phone ? `Ugodno < ${low} %` : `Ugodno · ispod ${low} %`}</StatusPill>
      </li>
      <li>
        <StatusPill level="warn">
          {phone ? `Umjerena ${low}–${high} %` : `Umjerena gužva · ${low}–${high} %`}
        </StatusPill>
      </li>
      <li>
        <StatusPill level="danger">{phone ? `Velika ${high} %+` : `Velika gužva · ${high} %+`}</StatusPill>
      </li>
    </ul>
  );

  return (
    <SettingsCard id="occupancy-settings" label="Popunjenost">
      <div className={styles.grid}>
        <InlineSaveField
          key={occupancy.windowMinutes}
          label="Prozor popunjenosti (minute)"
          inputMode="numeric"
          initial={String(occupancy.windowMinutes)}
          hint={
            phone
              ? 'Broje se članovi koji su ušli u ovom razdoblju.'
              : 'Broje se članovi koji su ušli u ovom razdoblju. Nema izlaznog skenera.'
          }
          validate={(value) =>
            /^\d+$/.test(value) && Number(value) >= WINDOW_MIN && Number(value) <= WINDOW_MAX
              ? undefined
              : `Upiši broj minuta od ${WINDOW_MIN} do ${WINDOW_MAX}.`
          }
          onSave={(value) => onSave(Number(value))}
        />
        <div className={styles.levelsBlock}>
          {!phone && <p className={styles.levelsLabel}>Razine</p>}
          {levels}
        </div>
      </div>
    </SettingsCard>
  );
}
