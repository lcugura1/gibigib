import type { GymDetailDto } from '@gibigib/types';
import { Card } from '../../../shared/components/card';
import { SectionLabel } from '../../../shared/components/section-label';
import { useViewport } from '../../../shared/layout/viewport';
import { niceTicks, position } from '../../../shared/lib/chart';
import { formatDayMonth, formatInteger } from '../../../shared/lib/format';
import { onWeekday } from '../gym-format';
import styles from './occupancy-today.module.css';

const WIDTH = 660;
const HEIGHT = 200;
const THRESHOLD = 0.8;
const LABEL_HOURS = [6, 9, 12, 15, 18, 21, 23];
const COMPACT_LABEL_HOURS = [6, 12, 18, 23];
const WEEKDAY_NAME = new Intl.DateTimeFormat('hr-HR', { weekday: 'long' });

interface OccupancyTodayProps {
  detail: GymDetailDto;
  color: string;
  className?: string;
}

export function OccupancyToday({ detail, color, className }: OccupancyTodayProps) {
  const compact = useViewport() === 'phone';
  const { occupancyToday, gym, asOf, live } = detail;
  const { firstHour, today, average } = occupancyToday;
  const { top, ticks } = niceTicks(gym.capacity);
  const lastIndex = Math.max(1, average.length - 1);
  const x = (i: number) => (i / lastIndex) * WIDTH;
  const y = (value: number) => HEIGHT - (value / top) * HEIGHT;
  const points = (values: readonly (number | null)[]) =>
    values.flatMap((value, i) => (value === null ? [] : [`${x(i)},${y(value)}`])).join(' ');
  const weekday = WEEKDAY_NAME.format(new Date(asOf));
  const labels = (compact ? COMPACT_LABEL_HOURS : LABEL_HOURS).filter((h) => h - firstHour < average.length);

  return (
    <Card className={`${styles.card} ${className ?? ''}`} aria-labelledby="occupancy-heading">
      <div className={styles.head}>
        <div>
          <SectionLabel id="occupancy-heading">Popunjenost danas</SectionLabel>
          <p className={styles.sub}>
            {compact
              ? `Po satu, u odnosu na prosječni ${weekday}`
              : `Članovi u zadnjih ${live.windowMinutes} min, po satu · ${weekday} ${formatDayMonth(asOf)}`}
          </p>
        </div>
        <ul className={styles.legend} aria-hidden="true">
          <li style={{ color }}>
            <span className={styles.legendText}>Danas</span>
          </li>
          <li className={styles.average}>{compact ? 'Prosjek' : `Prosjek ${onWeekday(asOf)}`}</li>
          <li className={styles.threshold}>80 %</li>
        </ul>
      </div>

      <div className={styles.chart}>
        <div className={styles.yAxis} aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick} style={position(y(tick) / HEIGHT)}>
              {formatInteger(tick)}
            </span>
          ))}
        </div>
        <svg
          className={styles.plot}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Popunjenost po satu danas u usporedbi s prosjekom, sada ${live.count} od ${gym.capacity}`}
        >
          <path className={styles.grid} d={ticks.map((tick) => `M0 ${y(tick)}H${WIDTH}`).join('')} />
          <path className={styles.limit} d={`M0 ${y(gym.capacity * THRESHOLD)}H${WIDTH}`} />
          <polyline className={styles.averageLine} points={points(average)} />
          <polyline className={styles.todayLine} style={{ stroke: color }} points={points(today)} />
        </svg>
        <div className={styles.xAxis} aria-hidden="true">
          {labels.map((hour) => (
            <span key={hour} style={position((hour - firstHour) / lastIndex)}>
              {String(hour).padStart(2, '0')}
              {compact ? 'h' : ':00'}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
