import { Fragment, type CSSProperties } from 'react';
import type { OverviewDto, OverviewRange } from '@gibigib/types';
import { Card } from '../../../shared/components/card';
import { SectionLabel } from '../../../shared/components/section-label';
import { formatInteger } from '../../../shared/lib/format';
import { RANGE_SPAN } from '../range';
import headStyles from './card-head.module.css';
import styles from './peak-hours.module.css';

const WEEKDAYS = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
const KEY_STEPS = [0, 0.3, 0.55, 0.8, 1];
const VISIBLE_FROM = 0.1;

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
  range: OverviewRange;
}

export function PeakHours({ peakHours, range }: PeakHoursProps) {
  const { firstHour, byWeekday } = peakHours;
  const hours = byWeekday[0]?.map((_, i) => firstHour + i) ?? [];
  const peak = byWeekday.reduce(
    (best, row, day) =>
      row.reduce((inner, value, i) => (value > inner.value ? { value, day, hour: firstHour + i } : inner), best),
    { value: 0, day: 0, hour: firstHour },
  );
  const describe = (day: number, hour: number, value: number) =>
    `${WEEKDAYS[day]} ${hourLabel(hour)}:00 · ~${formatInteger(Math.round(value))} ulaza`;

  return (
    <Card className={styles.card} aria-labelledby="peak-heading">
      <div className={headStyles.head}>
        <div>
          <SectionLabel id="peak-heading">Vršni sati</SectionLabel>
          <p className={headStyles.sub}>Prosječan broj ulaza po satu · {RANGE_SPAN[range]}</p>
        </div>
        <div className={headStyles.aside}>
          <p className={styles.peak}>{describe(peak.day, peak.hour, peak.value)}</p>
          <p className={headStyles.sub}>najveća gužva</p>
        </div>
      </div>

      <div className={styles.grid} style={{ '--hours': hours.length } as CSSProperties}>
        <span />
        {hours.map((hour) => (
          <span key={hour} className={styles.hour}>
            {hourLabel(hour)}
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
        <p>Planiraj osoblje i grupne treninge izvan tamnijih polja.</p>
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
