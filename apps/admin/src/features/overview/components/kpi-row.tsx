import type { LiveStatusDto, OverviewDto, OverviewRange } from '@gibigib/types';
import { Card } from '../../../shared/components/card';
import { Delta } from '../../../shared/components/delta';
import { OccupancyBar } from '../../../shared/components/occupancy-bar';
import { SectionLabel } from '../../../shared/components/section-label';
import { Sparkline } from '../../../shared/components/sparkline';
import { StatusPill } from '../../../shared/components/status-pill';
import { occupancyLevel } from '../../../shared/domain/occupancy';
import {
  formatDecimal,
  formatInteger,
  formatMonth,
  formatMonthGenitive,
  formatShare,
  formatSigned,
} from '../../../shared/lib/format';
import { RANGE_COMPARISON } from '../range';
import styles from './kpi-row.module.css';
import { MetricValue, metricStyles } from './metric';

const CHURN_TARGET = 3;

interface KpiRowProps {
  overview: OverviewDto;
  live: LiveStatusDto;
  gymId: string | undefined;
  range: OverviewRange;
}

function previousMonth(iso: string) {
  const date = new Date(iso);
  return new Date(date.getFullYear(), date.getMonth() - 1, 1).toISOString();
}

export function KpiRow({ overview, live, gymId, range }: KpiRowProps) {
  const gyms = live.gyms.filter((gym) => !gymId || gym.id === gymId);
  const count = gyms.reduce((sum, gym) => sum + gym.count, 0);
  const capacity = gyms.reduce((sum, gym) => sum + gym.capacity, 0);
  const occupancy = occupancyLevel(count, capacity);
  const { activeMembers, monthlyRevenue, churn } = overview;
  const lastMonth = formatMonthGenitive(previousMonth(churn.month));

  return (
    <section className={styles.row} aria-label="Ključni pokazatelji">
      <Card variant="flat" className={styles.kpi}>
        <div className={metricStyles.head}>
          <SectionLabel>Trenutno u teretanama</SectionLabel>
          <StatusPill level={occupancy.level}>{occupancy.label}</StatusPill>
        </div>
        <MetricValue value={count} unit={`/ ${formatInteger(capacity)}`} />
        <OccupancyBar share={count / capacity} level={occupancy.level} />
        <p className={metricStyles.note}>
          {formatShare(count, capacity)} kapaciteta · u zadnjih {live.windowMinutes} min
        </p>
      </Card>

      <Card className={styles.kpi}>
        <SectionLabel>Aktivni članovi</SectionLabel>
        <MetricValue value={formatInteger(activeMembers.value)} />
        <Delta value={formatSigned(activeMembers.delta)} good={activeMembers.delta >= 0}>
          {RANGE_COMPARISON[range]}
        </Delta>
        <Sparkline className={styles.spark} values={activeMembers.history} />
      </Card>

      <Card className={styles.kpi}>
        <SectionLabel>Prihod ovaj mjesec</SectionLabel>
        <MetricValue value={formatInteger(monthlyRevenue.value)} unit="€" />
        <Delta value={`${formatSigned(monthlyRevenue.delta, formatDecimal)} %`} good={monthlyRevenue.delta >= 0}>
          od {lastMonth}
        </Delta>
        <Sparkline className={styles.spark} values={monthlyRevenue.history} />
      </Card>

      <Card className={styles.kpi}>
        <div className={metricStyles.head}>
          <SectionLabel>Odljev · {formatMonth(churn.month)}</SectionLabel>
          {churn.value < CHURN_TARGET ? (
            <StatusPill level="ok">Ispod cilja</StatusPill>
          ) : (
            <StatusPill level="warn">Iznad cilja</StatusPill>
          )}
        </div>
        <MetricValue value={formatDecimal(churn.value)} unit="%" />
        <Delta value={`${formatSigned(churn.delta, formatDecimal)} p. b.`} good={churn.delta <= 0}>
          od {lastMonth} · cilj ispod {CHURN_TARGET} %
        </Delta>
        <Sparkline className={styles.spark} values={churn.history} />
      </Card>
    </section>
  );
}
