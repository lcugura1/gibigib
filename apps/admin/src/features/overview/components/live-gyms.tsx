import type { CSSProperties } from 'react';
import type { LiveStatusDto } from '@gibigib/types';
import { cardClass } from '../../../shared/components/card';
import { OccupancyBar } from '../../../shared/components/occupancy-bar';
import { SectionLabel } from '../../../shared/components/section-label';
import { StatusPill } from '../../../shared/components/status-pill';
import { occupancyLevel } from '../../../shared/domain/occupancy';
import { seriesColor } from '../../../shared/domain/palette';
import { formatShare } from '../../../shared/lib/format';
import styles from './live-gyms.module.css';
import { MetricValue, metricStyles } from './metric';

interface LiveGymsProps {
  live: LiveStatusDto;
}

export function LiveGyms({ live }: LiveGymsProps) {
  return (
    <section className={styles.section} aria-labelledby="live-heading">
      <div className={styles.head}>
        <SectionLabel id="live-heading">Uživo po teretanama</SectionLabel>
        <p className={styles.hint}>
          Članovi koji su ušli u zadnjih {live.windowMinutes} min · nema izlaznog skenera, broj je približan
        </p>
      </div>
      <div className={styles.grid}>
        {live.gyms.map((gym, i) => {
          const occupancy = occupancyLevel(gym.count, gym.capacity);
          return (
            <a
              key={gym.id}
              className={`${cardClass('flat')} ${styles.gym}`}
              href={`/teretane/${gym.id}`}
              style={{ '--tag': seriesColor(i) } as CSSProperties}
              aria-label={`${gym.name}: ${gym.count} od ${gym.capacity}, ${occupancy.label}. Otvori teretanu.`}
            >
              <div className={metricStyles.head}>
                <span className={styles.name}>{gym.name}</span>
                <StatusPill level={occupancy.level}>{occupancy.label}</StatusPill>
              </div>
              <MetricValue value={gym.count} unit={`/ ${gym.capacity}`} />
              <OccupancyBar share={gym.count / gym.capacity} level={occupancy.level} />
              <p className={metricStyles.note}>
                {formatShare(gym.count, gym.capacity)} kapaciteta · u zadnjih {live.windowMinutes} min
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
