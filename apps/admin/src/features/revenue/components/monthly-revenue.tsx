import { useState, type CSSProperties } from 'react';
import type { CatalogDto, ConnectedRevenueDto } from '@gibigib/types';
import { Card } from '../../../shared/components/card';
import { Chip } from '../../../shared/components/chip';
import { SectionLabel } from '../../../shared/components/section-label';
import { SegmentedControl } from '../../../shared/components/segmented-control';
import { gymColor, planColor } from '../../../shared/domain/palette';
import { niceTicks, position } from '../../../shared/lib/chart';
import { formatDayMonth, formatMonth, formatMonthShort } from '../../../shared/lib/format';
import headStyles from '../../../shared/analytics/card-head.module.css';
import { formatAxisEuro, formatWholeEuro } from '../revenue-format';
import type { Breakdown } from '../services/revenue-state';
import styles from './monthly-revenue.module.css';

const BREAKDOWN_OPTIONS = [
  { value: 'plan', label: 'Po planu' },
  { value: 'gym', label: 'Po teretani' },
] as const;

const BREAKDOWN_LABEL: Record<Breakdown, string> = { plan: 'po planu', gym: 'po teretani' };

interface MonthlyRevenueProps {
  data: ConnectedRevenueDto;
  catalog: CatalogDto;
  breakdown: Breakdown;
  onBreakdown: (breakdown: Breakdown) => void;
  compact: boolean;
}

const sum = (values: readonly number[]) => values.reduce((a, b) => a + b, 0);

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const monthYear = (iso: string) => `${formatMonth(iso)} ${new Date(iso).getFullYear()}.`;

export function MonthlyRevenue({ data, catalog, breakdown, onBreakdown, compact }: MonthlyRevenueProps) {
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
  const { months, byPlan, byGym } = data.monthly;
  const canSplitByGym = byGym.length > 1;
  const mode: Breakdown = canSplitByGym ? breakdown : 'plan';
  const gymIds = catalog.gyms.map((gym) => gym.id);

  const series = (mode === 'plan' ? byPlan : byGym).map((s) => ({
    ...s,
    name:
      mode === 'plan'
        ? (catalog.plans.find((plan) => plan.slug === s.key)?.name ?? s.key)
        : (catalog.gyms.find((gym) => gym.id === s.key)?.name ?? s.key),
    color: mode === 'plan' ? planColor(s.key) : gymColor(gymIds, s.key),
  }));
  const visible = series.filter((s) => !hidden.has(s.key));
  const totals = months.map((_, i) => sum(visible.map((s) => s.values[i] ?? 0)));
  const { top, ticks } = niceTicks(Math.max(1000, ...totals));
  const shownTicks = compact ? ticks.filter((_, i) => i % 2 === 0 || i === ticks.length - 1) : ticks;

  const toggle = (key: string) =>
    setHidden((current) => {
      const next = new Set(current);
      if (!next.delete(key) && next.size < series.length - 1) next.add(key);
      return next;
    });

  const changeBreakdown = (next: Breakdown) => {
    setHidden(new Set());
    onBreakdown(next);
  };

  const first = months[0] ?? data.asOf;
  const last = months.at(-1) ?? data.asOf;
  const caption = `${capitalize(monthYear(first))} – ${monthYear(last)} · ${formatMonth(last)} do ${formatDayMonth(data.asOf)} uključuje unaprijed plaćene članarine`;

  const toggleControl = canSplitByGym && (
    <SegmentedControl
      label="Raspodjela"
      options={BREAKDOWN_OPTIONS}
      value={mode}
      onChange={changeBreakdown}
      size="small"
      fill={compact}
    />
  );

  const legend = (
    <div className={styles.legend}>
      {series.map((s) => (
        <Chip
          key={s.key}
          color={s.color}
          active={!hidden.has(s.key)}
          meta={compact ? undefined : formatWholeEuro(sum(s.values))}
          onToggle={() => toggle(s.key)}
        >
          {s.name}
        </Chip>
      ))}
    </div>
  );

  return (
    <Card className={`${styles.card} ${compact ? styles.compact : ''}`} aria-labelledby="monthly-revenue-heading">
      <div className={headStyles.head}>
        <div>
          <SectionLabel id="monthly-revenue-heading">Prihod po mjesecu</SectionLabel>
          {!compact && <p className={headStyles.sub}>{caption}</p>}
        </div>
        {!compact && toggleControl}
      </div>
      {compact && toggleControl}
      {!compact && legend}

      <div className={styles.chart}>
        <div className={styles.yAxis} aria-hidden="true">
          {shownTicks.map((tick) => (
            <span key={tick} style={position(1 - tick / top)}>
              {formatAxisEuro(tick, compact)}
            </span>
          ))}
        </div>
        <div
          className={styles.plot}
          role="img"
          aria-label={`Složeni stupčasti graf mjesečnog prihoda ${BREAKDOWN_LABEL[mode]}`}
        >
          {shownTicks.map((tick) => (
            <span key={tick} className={styles.grid} style={position(1 - tick / top)} />
          ))}
          {months.map((month, i) => (
            <div
              key={month}
              className={i === months.length - 1 ? `${styles.column} ${styles.current}` : styles.column}
              title={`${formatMonthShort(month)} · ${formatWholeEuro(totals[i] ?? 0)}`}
            >
              {visible.map((s) => (
                <span
                  key={s.key}
                  className={styles.segment}
                  style={
                    {
                      '--share': `${(((s.values[i] ?? 0) / top) * 100).toFixed(2)}%`,
                      background: s.color,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          ))}
        </div>
        <div className={styles.xAxis} aria-hidden="true">
          {months.map((month) => (
            <span key={month}>{compact ? formatMonthShort(month).charAt(0) : formatMonthShort(month)}</span>
          ))}
        </div>
      </div>

      {compact && legend}
    </Card>
  );
}
