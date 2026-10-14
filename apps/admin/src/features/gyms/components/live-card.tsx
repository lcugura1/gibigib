import type { GymDetailDto } from '@gibigib/types';
import { Card } from '../../../shared/components/card';
import { MetricValue } from '../../../shared/components/metric';
import { OccupancyBar } from '../../../shared/components/occupancy-bar';
import { SectionLabel } from '../../../shared/components/section-label';
import { StatusPill } from '../../../shared/components/status-pill';
import { occupancyLevel } from '../../../shared/domain/occupancy';
import { useViewport } from '../../../shared/layout/viewport';
import { formatInteger, formatShare, formatTime } from '../../../shared/lib/format';
import { onWeekday } from '../gym-format';
import styles from './live-card.module.css';

interface LiveCardProps {
  detail: GymDetailDto;
  className?: string;
}

export function LiveCard({ detail, className }: LiveCardProps) {
  const compact = useViewport() === 'phone';
  const { live, gym, asOf } = detail;
  const level = occupancyLevel(live.count, gym.capacity);
  const share = formatShare(live.count, gym.capacity);

  return (
    <Card variant="light" className={`${styles.card} ${className ?? ''}`} aria-labelledby="live-heading">
      <div className={styles.head}>
        <SectionLabel id="live-heading">{compact ? 'Trenutno unutra' : 'Trenutno u teretani'}</SectionLabel>
        <StatusPill level={level.level} onLight>
          {level.label}
        </StatusPill>
      </div>
      <MetricValue value={live.count} unit={`/ ${formatInteger(gym.capacity)}`} />
      <OccupancyBar share={live.count / gym.capacity} level={level.level} className={styles.bar} />
      {compact ? (
        <p className={styles.note}>
          {share} · u zadnjih {live.windowMinutes} min · prosjek u ovo doba {formatInteger(live.averageNow)}
        </p>
      ) : (
        <>
          <p className={styles.note}>
            {share} kapaciteta · ušli u zadnjih {live.windowMinutes} min. Nema izlaznog skenera, broj je približan.
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Prosjek u ovo doba</dt>
              <dd>
                {formatInteger(live.averageNow)} · {onWeekday(asOf)}
              </dd>
            </div>
            <div>
              <dt>Vrhunac danas</dt>
              <dd>
                {live.peakToday ? `${formatInteger(live.peakToday.count)} u ${formatTime(live.peakToday.at)}` : '—'}
              </dd>
            </div>
          </dl>
        </>
      )}
    </Card>
  );
}
