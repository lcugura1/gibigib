import type { AnalyticsRange, OverviewDto } from '@gibigib/types';
import { Card } from '../components/card';
import { Delta } from '../components/delta';
import { OccupancyBar } from '../components/occupancy-bar';
import { SectionLabel } from '../components/section-label';
import { Sparkline } from '../components/sparkline';
import { StatusPill } from '../components/status-pill';
import { occupancyLevel } from '../domain/occupancy';
import { useViewport } from '../layout/viewport';
import {
  formatDecimal,
  formatInteger,
  formatMonth,
  formatMonthGenitive,
  formatShare,
  formatSigned,
} from '../lib/format';
import { RANGE_COMPARISON, RANGE_SHORT } from '../domain/range';
import styles from './kpi-row.module.css';
import { MetricValue, metricStyles } from '../components/metric';

const CHURN_TARGET = 3;

export interface Occupancy {
  count: number;
  capacity: number;
  windowMinutes: number;
}

interface KpiRowProps {
  overview: OverviewDto;
  range: AnalyticsRange;
  occupancy?: Occupancy;
}

const RANGE_TINY: Record<AnalyticsRange, string> = { today: 'danas', '7d': '7 d', '30d': '30 d', '12m': '12 mj.' };

const totalArrivals = (arrivals: OverviewDto['arrivals']) =>
  arrivals.series.reduce((sum, s) => sum + s.values.reduce((a, b) => a + b, 0), 0);

const SPARK_POINTS = 7;

function arrivalsHistory(arrivals: OverviewDto['arrivals']) {
  const totals = arrivals.buckets.map((_, i) => arrivals.series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0));
  const size = Math.max(1, Math.ceil(totals.length / SPARK_POINTS));
  return Array.from({ length: Math.ceil(totals.length / size) }, (_, i) => {
    const chunk = totals.slice(i * size, (i + 1) * size);
    return chunk.reduce((a, b) => a + b, 0) / chunk.length;
  });
}

function previousMonth(iso: string) {
  const date = new Date(iso);
  return new Date(date.getFullYear(), date.getMonth() - 1, 1).toISOString();
}

export function KpiRow({ overview, range, occupancy }: KpiRowProps) {
  const compact = useViewport() === 'phone';
  const { activeMembers, monthlyRevenue, churn, arrivals } = overview;
  const lastMonth = formatMonthGenitive(previousMonth(churn.month));
  const kpiClass = compact ? `${styles.kpi} ${styles.compact}` : styles.kpi;
  const churnPill =
    churn.value < CHURN_TARGET ? (
      <StatusPill level="ok">Ispod cilja</StatusPill>
    ) : (
      <StatusPill level="warn">Iznad cilja</StatusPill>
    );

  return (
    <section className={styles.row} aria-label="Ključni pokazatelji">
      {occupancy && <OccupancyCard occupancy={occupancy} compact={compact} className={kpiClass} />}

      <Card className={kpiClass}>
        <SectionLabel>Aktivni članovi</SectionLabel>
        <MetricValue value={formatInteger(activeMembers.value)} />
        <Delta value={formatSigned(activeMembers.delta)} good={activeMembers.delta >= 0}>
          {compact ? RANGE_SHORT[range] : RANGE_COMPARISON[range]}
        </Delta>
        <Sparkline className={styles.spark} values={activeMembers.history} />
      </Card>

      {!occupancy && (
        <Card className={kpiClass}>
          <SectionLabel>Dolasci · {compact ? RANGE_TINY[range] : RANGE_SHORT[range]}</SectionLabel>
          <MetricValue value={formatInteger(totalArrivals(arrivals))} />
          <Delta value={`${formatSigned(arrivals.deltaPercent, formatDecimal)} %`} good={arrivals.deltaPercent >= 0}>
            {!compact && RANGE_COMPARISON[range]}
          </Delta>
          <Sparkline className={styles.spark} values={arrivalsHistory(arrivals)} />
        </Card>
      )}

      <Card className={kpiClass}>
        <SectionLabel>{compact ? `Prihod · ${formatMonth(churn.month)}` : 'Prihod ovaj mjesec'}</SectionLabel>
        <MetricValue value={formatInteger(monthlyRevenue.value)} unit="€" />
        <Delta value={`${formatSigned(monthlyRevenue.delta, formatDecimal)} %`} good={monthlyRevenue.delta >= 0}>
          od {lastMonth}
        </Delta>
        <Sparkline className={styles.spark} values={monthlyRevenue.history} />
      </Card>

      <Card className={kpiClass}>
        <div className={metricStyles.head}>
          <SectionLabel>{compact ? 'Odljev' : `Odljev · ${formatMonth(churn.month)}`}</SectionLabel>
          {!compact && churnPill}
        </div>
        <MetricValue value={formatDecimal(churn.value)} unit="%" />
        <Delta value={`${formatSigned(churn.delta, formatDecimal)} p. b.`} good={churn.delta <= 0}>
          {compact ? `cilj < ${CHURN_TARGET} %` : `od ${lastMonth} · cilj ispod ${CHURN_TARGET} %`}
        </Delta>
        <Sparkline className={styles.spark} values={churn.history} />
      </Card>
    </section>
  );
}

function OccupancyCard({
  occupancy,
  compact,
  className,
}: {
  occupancy: Occupancy;
  compact: boolean;
  className?: string;
}) {
  const { count, capacity, windowMinutes } = occupancy;
  const level = occupancyLevel(count, capacity);
  const pill = <StatusPill level={level.level}>{level.label}</StatusPill>;

  return (
    <Card variant="flat" className={className}>
      <div className={metricStyles.head}>
        <SectionLabel>{compact ? 'Trenutno unutra' : 'Trenutno u teretanama'}</SectionLabel>
        {!compact && pill}
      </div>
      <MetricValue value={count} unit={`/ ${formatInteger(capacity)}`} />
      <OccupancyBar share={count / capacity} level={level.level} />
      {compact ? (
        <span className={styles.pill}>{pill}</span>
      ) : (
        <p className={metricStyles.note}>
          {formatShare(count, capacity)} kapaciteta · u zadnjih {windowMinutes} min
        </p>
      )}
    </Card>
  );
}
