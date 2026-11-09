import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import type { LiveStatusDto } from '@gibigib/types';
import { cardClass } from '../../../shared/components/card';
import { OccupancyBar } from '../../../shared/components/occupancy-bar';
import { SectionLabel } from '../../../shared/components/section-label';
import { StatusPill } from '../../../shared/components/status-pill';
import { occupancyLevel } from '../../../shared/domain/occupancy';
import { seriesColor } from '../../../shared/domain/palette';
import { useViewport, type Viewport } from '../../../shared/layout/viewport';
import { formatShare } from '../../../shared/lib/format';
import styles from './live-gyms.module.css';
import { MetricValue } from '../../../shared/components/metric';
import layout from './overview-layout.module.css';

function hint(viewport: Viewport, minutes: number) {
  switch (viewport) {
    case 'phone':
      return `${minutes} min`;
    case 'tablet':
      return `Ušli u zadnjih ${minutes} min · broj je približan`;
    case 'desktop':
      return `Članovi koji su ušli u zadnjih ${minutes} min · nema izlaznog skenera, broj je približan`;
  }
}

interface LiveGymsProps {
  live: LiveStatusDto;
}

export function LiveGyms({ live }: LiveGymsProps) {
  const viewport = useViewport();
  const minutes = live.windowMinutes;
  const gymClass = `${cardClass('flat')} ${styles.gym} ${viewport === 'phone' ? styles.compact : ''}`;

  return (
    <section className={styles.section} aria-labelledby="live-heading">
      <div className={styles.head}>
        <SectionLabel id="live-heading">Uživo po teretanama</SectionLabel>
        <p className={styles.hint}>{hint(viewport, minutes)}</p>
      </div>
      <div className={layout.liveGrid}>
        {live.gyms.map((gym, i) => {
          const occupancy = occupancyLevel(gym.count, gym.capacity);
          const share = formatShare(gym.count, gym.capacity);
          return (
            <Link
              key={gym.id}
              className={gymClass}
              to={`/teretane/${gym.id}`}
              style={{ '--tag': seriesColor(i) } as CSSProperties}
              aria-label={`${gym.name}: ${gym.count} od ${gym.capacity}, ${occupancy.label}. Otvori teretanu.`}
            >
              <span className={styles.name}>{gym.name}</span>
              <span className={styles.level}>
                <StatusPill level={occupancy.level}>{occupancy.label}</StatusPill>
              </span>
              <MetricValue className={styles.value} value={gym.count} unit={`/ ${gym.capacity}`} />
              <OccupancyBar className={styles.bar} share={gym.count / gym.capacity} level={occupancy.level} />
              <p className={`${styles.note} ${styles.long}`}>
                {share} kapaciteta · u zadnjih {minutes} min
              </p>
              <p className={`${styles.note} ${styles.short}`}>
                {share} · {minutes} min
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
