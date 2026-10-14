import { useState, type CSSProperties } from 'react';
import type { GymLiveDto, OverviewDto, OverviewRange } from '@gibigib/types';
import { Card } from '../../../shared/components/card';
import { Chip } from '../../../shared/components/chip';
import { Delta } from '../../../shared/components/delta';
import { SectionLabel } from '../../../shared/components/section-label';
import { gymColor } from '../../../shared/domain/palette';
import {
  formatDayMonth,
  formatDecimal,
  formatInteger,
  formatMonthShort,
  formatSigned,
  formatTime,
  formatWeekdayShort,
} from '../../../shared/lib/format';
import { RANGE_COMPARISON, RANGE_SPAN } from '../range';
import styles from './arrivals-chart.module.css';
import headStyles from './card-head.module.css';

const WIDTH = 660;
const HEIGHT = 220;
const TOP_INSET = 6;

function niceStep(max: number) {
  const raw = max / 4;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((k) => k * magnitude).find((step) => step >= raw) ?? raw;
}

function subtitle(range: OverviewRange, buckets: readonly string[]) {
  const last = buckets.at(-1);
  if (range === 'today') return `Ulazi po satu · danas do ${last ? formatTime(last) : ''}`;
  if (range === '12m') return `Mjesečni ulazi · ${RANGE_SPAN[range]}`;
  return `Dnevni ulazi · ${RANGE_SPAN[range]}`;
}

function axisLabels(range: OverviewRange, buckets: readonly string[]) {
  const last = buckets.length - 1;
  const pick = (index: number, text: string) => ({ index, text });
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

const position = (fraction: number) => ({ '--at': `${(fraction * 100).toFixed(2)}%` }) as CSSProperties;

interface ArrivalsChartProps {
  arrivals: OverviewDto['arrivals'];
  gyms: readonly GymLiveDto[];
  range: OverviewRange;
  className?: string;
}

export function ArrivalsChart({ arrivals, gyms, range, className }: ArrivalsChartProps) {
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
  const gymIds = gyms.map((gym) => gym.id);
  const { buckets, series } = arrivals;

  const visible = series.filter((s) => !hidden.has(s.gymId));
  const max = Math.max(10, ...visible.flatMap((s) => s.values));
  const step = niceStep(max);
  const yMax = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: Math.round(yMax / step) + 1 }, (_, i) => i * step);
  const y = (value: number) => HEIGHT - (value / yMax) * (HEIGHT - TOP_INSET);
  const x = (index: number) => (index / Math.max(1, buckets.length - 1)) * WIDTH;
  const total = series.reduce((sum, s) => sum + s.values.reduce((a, b) => a + b, 0), 0);

  const toggle = (gymId: string) =>
    setHidden((current) => {
      const next = new Set(current);
      if (!next.delete(gymId)) next.add(gymId);
      return next;
    });

  return (
    <Card className={`${styles.card} ${className ?? ''}`} aria-labelledby="arrivals-heading">
      <div className={headStyles.head}>
        <div>
          <SectionLabel id="arrivals-heading">Dolasci</SectionLabel>
          <p className={headStyles.sub}>{subtitle(range, buckets)}</p>
        </div>
        <div className={headStyles.aside}>
          <p className={styles.total}>{formatInteger(total)}</p>
          <Delta className={styles.delta} value={`${formatSigned(arrivals.deltaPercent, formatDecimal)} %`} good={arrivals.deltaPercent >= 0}>
            {RANGE_COMPARISON[range]}
          </Delta>
        </div>
      </div>

      <div className={styles.legend}>
        {series.map((s) => (
          <Chip
            key={s.gymId}
            color={gymColor(gymIds, s.gymId)}
            active={!hidden.has(s.gymId)}
            meta={formatInteger(s.values.reduce((a, b) => a + b, 0))}
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
          aria-label={`Linijski graf dolazaka po teretanama, ${subtitle(range, buckets)}`}
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
          {axisLabels(range, buckets).map((label) => (
            <span key={label.index} style={position(label.index / Math.max(1, buckets.length - 1))}>
              {label.text}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
