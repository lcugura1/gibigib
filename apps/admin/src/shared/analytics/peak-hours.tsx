import { Fragment, type CSSProperties } from 'react';
import type { OverviewDto, AnalyticsRange } from '@gibigib/types';
import { Card } from '../components/card';
import { EmptyState } from '../components/empty-state';
import { SectionLabel } from '../components/section-label';
import { useViewport } from '../layout/viewport';
import { formatInteger } from '../lib/format';
import { RANGE_SPAN } from '../domain/range';
import headStyles from './card-head.module.css';
import styles from './peak-hours.module.css';

const WEEKDAYS = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
const KEY_STEPS = [0, 0.3, 0.55, 0.8, 1];
const VISIBLE_FROM = 0.1;

const COMPACT_HOUR_STEP = 3;

const hourLabel = (hour: number) => String(hour).padStart(2, '0');

function cellProps(share: number) {
  if (share < VISIBLE_FROM) return { className: styles.cell };
  return {
    className: `${styles.cell} ${styles.hot}`,
    style: { '--intensity': `${Math.round((0.12 + 0.88 * share) * 100)}%` } as CSSProperties,
  };
}

interface PeakHoursProps {
  peakHours: OverviewDto['peakHours'];
  range: AnalyticsRange;
  onRangeChange: (range: AnalyticsRange) => void;
  scopeLabel?: string;
  className?: string;
}

export function PeakHours({ peakHours, range, onRangeChange, scopeLabel, className }: PeakHoursProps) {
  const title = scopeLabel ? `Vršni sati · ${scopeLabel}` : 'Vršni sati';
  const compact = useViewport() === 'phone';
  const { firstHour, byWeekday } = peakHours;
  const hours = byWeekday[0]?.map((_, i) => firstHour + i) ?? [];
  const peak = byWeekday.reduce(
    (best, row, day) =>
      row.reduce((inner, value, i) => (value > inner.value ? { value, day, hour: firstHour + i } : inner), best),
    { value: 0, day: 0, hour: firstHour },
  );
  const slot = (day: number, hour: number) => `${WEEKDAYS[day]} ${hourLabel(hour)}:00`;
  const describe = (day: number, hour: number, value: number) =>
    `${slot(day, hour)} · ~${formatInteger(Math.round(value))} ulaza`;
  const showHour = (i: number) => !compact || i % COMPACT_HOUR_STEP === 0;

  if (peak.value === 0) {
    return (
      <Card className={`${styles.card} ${className ?? ''}`} aria-labelledby="peak-heading">
        <div>
          <SectionLabel id="peak-heading">{title}</SectionLabel>
          <p className={headStyles.sub}>Prosječan broj ulaza po satu · {RANGE_SPAN[range]}</p>
        </div>
        <EmptyState
          size="small"
          title={range === 'today' ? 'Još nema dolazaka danas.' : `Nema dolazaka u ${RANGE_SPAN[range]}.`}
          action={range === '30d' ? undefined : { label: 'Prikaži 30 dana', onClick: () => onRangeChange('30d') }}
        >
          {range !== '30d' && 'Za planiranje osoblja prebaci na 30 dana.'}
        </EmptyState>
      </Card>
    );
  }

  return (
    <Card
      className={`${styles.card} ${compact ? styles.compact : ''} ${className ?? ''}`}
      aria-labelledby="peak-heading"
    >
      <div className={headStyles.head}>
        <div>
          <SectionLabel id="peak-heading">{title}</SectionLabel>
          <p className={headStyles.sub}>
            {compact ? 'Prosječno ulaza po satu' : `Prosječan broj ulaza po satu · ${RANGE_SPAN[range]}`}
          </p>
        </div>
        {!compact && (
          <div className={headStyles.aside}>
            <p className={styles.peak}>{describe(peak.day, peak.hour, peak.value)}</p>
            <p className={headStyles.sub}>najveća gužva</p>
          </div>
        )}
      </div>

      <div className={styles.grid} style={{ '--hours': hours.length } as CSSProperties}>
        <span />
        {hours.map((hour, i) => (
          <span key={hour} className={styles.hour}>
            {showHour(i) && hourLabel(hour)}
          </span>
        ))}
        {byWeekday.map((row, day) => (
          <Fragment key={WEEKDAYS[day]}>
            <span>{WEEKDAYS[day]}</span>
            {row.map((value, i) => (
              <span
                key={i}
                {...cellProps(peak.value === 0 ? 0 : value / peak.value)}
                title={`${describe(day, firstHour + i, value)} na sat`}
              />
            ))}
          </Fragment>
        ))}
      </div>

      <div className={styles.foot}>
        {compact ? (
          <p className={styles.peak}>Vrhunac: {slot(peak.day, peak.hour)}</p>
        ) : (
          <p>Planiraj osoblje i grupne treninge izvan tamnijih polja.</p>
        )}
        <p className={styles.key} aria-hidden="true">
          Manje
          {KEY_STEPS.map((step) => (
            <i key={step} {...cellProps(step)} />
          ))}
          Više
        </p>
      </div>
    </Card>
  );
}
