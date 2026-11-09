import { useState } from 'react';
import type { AnalyticsRange, OverviewDto } from '@gibigib/types';
import type { GymRef } from '../domain/scope';
import { Card } from '../components/card';
import { Chip } from '../components/chip';
import { Delta } from '../components/delta';
import { EmptyState } from '../components/empty-state';
import { SectionLabel } from '../components/section-label';
import { gymColor } from '../domain/palette';
import { useViewport } from '../layout/viewport';
import { niceTicks, position } from '../lib/chart';
import {
  formatDayMonth,
  formatDecimal,
  formatInteger,
  formatMonthShort,
  formatSigned,
  formatTime,
  formatWeekdayShort,
} from '../lib/format';
import { RANGE_COMPARISON, RANGE_SHORT, RANGE_SPAN } from '../domain/range';
import styles from './arrivals-chart.module.css';
import headStyles from './card-head.module.css';

const WIDTH = 660;
const HEIGHT = 220;
const TOP_INSET = 6;

function subtitle(range: AnalyticsRange, buckets: readonly string[], compact: boolean) {
  if (compact) {
    const unit = range === 'today' ? 'Po satu' : range === '12m' ? 'Po mjesecu' : 'Po danu';
    return `${unit} · ${RANGE_SHORT[range]}`;
  }
  const last = buckets.at(-1);
  if (range === 'today') return `Ulazi po satu · danas do ${last ? formatTime(last) : ''}`;
  if (range === '12m') return `Mjesečni ulazi · ${RANGE_SPAN[range]}`;
  return `Dnevni ulazi · ${RANGE_SPAN[range]}`;
}

function axisLabels(range: AnalyticsRange, buckets: readonly string[], compact: boolean) {
  const last = buckets.length - 1;
  const pick = (index: number, text: string) => ({ index, text });
  if (compact) {
    switch (range) {
      case 'today':
        return buckets.flatMap((iso, i) => (i % 3 === 0 ? [pick(i, formatTime(iso))] : []));
      case '7d':
        return buckets.flatMap((iso, i) => (i % 2 === 0 ? [pick(i, formatDayMonth(iso))] : []));
      case '30d':
        return buckets.flatMap((iso, i) => (i % 10 === 0 || i === last ? [pick(i, formatDayMonth(iso))] : []));
      case '12m':
        return buckets.flatMap((iso, i) => ((last - i) % 3 === 0 ? [pick(i, formatMonthShort(iso))] : []));
    }
  }
  switch (range) {
    case 'today':
      return buckets.flatMap((iso, i) => (i % 2 === 0 ? [pick(i, formatTime(iso))] : []));
    case '7d':
      return buckets.map((iso, i) => pick(i, `${formatWeekdayShort(iso)} ${formatDayMonth(iso)}`));
    case '30d':
      return buckets.flatMap((iso, i) => (i % 5 === 0 || i === last ? [pick(i, formatDayMonth(iso))] : []));
    case '12m':
      return buckets.map((iso, i) => pick(i, formatMonthShort(iso)));
  }
}

interface ArrivalsChartProps {
  arrivals: OverviewDto['arrivals'];
  gyms: readonly GymRef[];
  range: AnalyticsRange;
  onRangeChange: (range: AnalyticsRange) => void;
  className?: string;
}

function emptyTitle(range: AnalyticsRange) {
  return range === 'today' ? 'Još nema dolazaka danas.' : `Nema dolazaka u ${RANGE_SPAN[range]}.`;
}

export function ArrivalsChart({ arrivals, gyms, range, onRangeChange, className }: ArrivalsChartProps) {
  const compact = useViewport() === 'phone';
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
  const gymIds = gyms.map((gym) => gym.id);
  const { buckets, series } = arrivals;

  const visible = series.filter((s) => !hidden.has(s.gymId));
  const max = Math.max(10, ...visible.flatMap((s) => s.values));
  const { top: yMax, ticks } = niceTicks(max);
  const y = (value: number) => HEIGHT - (value / yMax) * (HEIGHT - TOP_INSET);
  const x = (index: number) => (index / Math.max(1, buckets.length - 1)) * WIDTH;
  const total = series.reduce((sum, s) => sum + s.values.reduce((a, b) => a + b, 0), 0);

  const caption = subtitle(range, buckets, compact);

  const toggle = (gymId: string) =>
    setHidden((current) => {
      const next = new Set(current);
      if (!next.delete(gymId)) next.add(gymId);
      return next;
    });

  return (
    <Card
      className={`${styles.card} ${compact ? styles.compact : ''} ${className ?? ''}`}
      aria-labelledby="arrivals-heading"
    >
      <div className={headStyles.head}>
        <div>
          <SectionLabel id="arrivals-heading">Dolasci</SectionLabel>
          <p className={headStyles.sub}>{caption}</p>
        </div>
        <div className={headStyles.aside}>
          <p className={styles.total}>{formatInteger(total)}</p>
          {total > 0 && (
            <Delta
              className={styles.delta}
              value={`${formatSigned(arrivals.deltaPercent, formatDecimal)} %`}
              good={arrivals.deltaPercent >= 0}
            >
              {!compact && RANGE_COMPARISON[range]}
            </Delta>
          )}
        </div>
      </div>

      {total === 0 ? (
        <EmptyState
          className={styles.empty}
          icon="qr"
          title={emptyTitle(range)}
          action={
            range === 'today' ? { label: 'Prikaži zadnjih 7 dana', onClick: () => onRangeChange('7d') } : undefined
          }
        >
          {range === 'today' && 'Prvi ulazi pojavit će se ovdje čim članovi skeniraju kod na vratima.'}
        </EmptyState>
      ) : (
        <>
          <div className={styles.legend}>
            {series.map((s) => (
              <Chip
                key={s.gymId}
                color={gymColor(gymIds, s.gymId)}
                active={!hidden.has(s.gymId)}
                meta={compact ? undefined : formatInteger(s.values.reduce((a, b) => a + b, 0))}
                onToggle={() => toggle(s.gymId)}
              >
                {gyms.find((gym) => gym.id === s.gymId)?.name}
              </Chip>
            ))}
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
              aria-label={`Linijski graf dolazaka po teretanama, ${caption}`}
            >
              <path className={styles.grid} d={ticks.map((tick) => `M0 ${y(tick)}H${WIDTH}`).join('')} />
              {visible.map((s) => (
                <polyline
                  key={s.gymId}
                  className={styles.series}
                  style={{ stroke: gymColor(gymIds, s.gymId) }}
                  points={s.values.map((value, i) => `${x(i)},${y(value)}`).join(' ')}
                />
              ))}
            </svg>
            <div className={styles.xAxis} aria-hidden="true">
              {axisLabels(range, buckets, compact).map((label) => (
                <span key={label.index} style={position(label.index / Math.max(1, buckets.length - 1))}>
                  {label.text}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
