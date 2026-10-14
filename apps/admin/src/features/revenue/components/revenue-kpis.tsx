import type { AnalyticsRange, ConnectedRevenueDto } from '@gibigib/types';
import kpiStyles from '../../../shared/analytics/kpi-row.module.css';
import { Card } from '../../../shared/components/card';
import { Delta } from '../../../shared/components/delta';
import { MetricValue, metricStyles } from '../../../shared/components/metric';
import { SectionLabel } from '../../../shared/components/section-label';
import { Sparkline } from '../../../shared/components/sparkline';
import { StatusPill } from '../../../shared/components/status-pill';
import { RANGE_PREVIOUS, RANGE_SHORT } from '../../../shared/domain/range';
import { formatAmount, formatDecimal, formatInteger, formatSigned } from '../../../shared/lib/format';
import styles from './revenue-kpis.module.css';

interface RevenueKpisProps {
  data: ConnectedRevenueDto;
  range: AnalyticsRange;
  compact: boolean;
}

export function RevenueKpis({ data, range, compact }: RevenueKpisProps) {
  const { revenue, perMember, newMembers, renewals } = data;
  const comparison = `od ${RANGE_PREVIOUS[range]}`;
  const kpiClass = compact ? `${kpiStyles.kpi} ${kpiStyles.compact}` : kpiStyles.kpi;
  const ratePill = <StatusPill level="ok">{formatInteger(renewals.rate)} % obnovi</StatusPill>;
  const revenueDelta = `${formatSigned(revenue.delta, formatDecimal)} %`;
  const perMemberDelta = `${formatSigned(perMember.delta, formatAmount)} €`;

  return (
    <section className={kpiStyles.row} aria-label="Ključni pokazatelji prihoda">
      <Card className={kpiClass}>
        <SectionLabel>Prihod · {RANGE_SHORT[range]}</SectionLabel>
        <MetricValue className={compact ? styles.revenue : undefined} value={formatInteger(revenue.value)} unit="€" />
        <Delta value={revenueDelta} good={revenue.delta >= 0}>
          {!compact && comparison}
        </Delta>
        {!compact && <Sparkline className={kpiStyles.spark} values={revenue.history} />}
      </Card>

      <Card className={kpiClass}>
        <SectionLabel>{compact ? 'Po članu' : 'Prosjek po članu'}</SectionLabel>
        <MetricValue value={formatAmount(perMember.value)} unit={compact ? '€' : '€ / mj.'} />
        {compact ? (
          <p className={metricStyles.note}>mjesečno · {perMemberDelta}</p>
        ) : (
          <>
            <Delta value={perMemberDelta} good={perMember.delta >= 0}>
              {comparison}
            </Delta>
            <Sparkline className={kpiStyles.spark} values={perMember.history} />
          </>
        )}
      </Card>

      <Card className={kpiClass}>
        <SectionLabel>Novi članovi</SectionLabel>
        <MetricValue value={formatInteger(newMembers.value)} />
        <Delta value={formatSigned(newMembers.delta)} good={newMembers.delta >= 0}>
          {!compact && comparison}
        </Delta>
        {!compact && <Sparkline className={kpiStyles.spark} values={newMembers.history} />}
      </Card>

      <Card className={kpiClass}>
        {compact ? (
          <SectionLabel>Obnove</SectionLabel>
        ) : (
          <div className={metricStyles.head}>
            <SectionLabel>Obnove</SectionLabel>
            {ratePill}
          </div>
        )}
        <MetricValue value={formatInteger(renewals.value)} />
        {compact ? (
          <p className={metricStyles.note}>{formatInteger(renewals.rate)} % obnovi</p>
        ) : (
          <>
            <Delta value={`${formatSigned(renewals.delta, formatDecimal)} %`} good={renewals.delta >= 0}>
              {comparison}
            </Delta>
            <Sparkline className={kpiStyles.spark} values={renewals.history} />
          </>
        )}
      </Card>
    </section>
  );
}

interface PendingKpisProps {
  newMembers: number;
  range: AnalyticsRange;
  compact: boolean;
}

export function PendingKpis({ newMembers, range, compact }: PendingKpisProps) {
  const kpiClass = compact ? `${kpiStyles.kpi} ${kpiStyles.compact}` : `${kpiStyles.kpi} ${styles.pending}`;
  const waiting = <StatusPill level="muted">Čeka Stripe</StatusPill>;
  const placeholder = (label: string) => (
    <Card className={kpiClass}>
      {compact ? (
        <SectionLabel>{label}</SectionLabel>
      ) : (
        <div className={metricStyles.head}>
          <SectionLabel>{label}</SectionLabel>
          {waiting}
        </div>
      )}
      <MetricValue className={styles.dash} value="—" />
      {compact && <span className={kpiStyles.pill}>{waiting}</span>}
    </Card>
  );

  return (
    <section className={kpiStyles.row} aria-label="Pokazatelji prihoda čekaju Stripe">
      {placeholder('Prihod')}
      {!compact && placeholder('Prosjek po članu')}
      <Card className={kpiClass}>
        <SectionLabel>Novi članovi</SectionLabel>
        <MetricValue value={formatInteger(newMembers)} />
        <p className={metricStyles.note}>{compact ? RANGE_SHORT[range] : `iz aplikacije · ${RANGE_SHORT[range]}`}</p>
      </Card>
      {!compact && placeholder('Obnove')}
    </section>
  );
}
