import type { AnalyticsRange, EntriesPageDto } from '@gibigib/types';
import { Card } from '../../../shared/components/card';
import { Delta } from '../../../shared/components/delta';
import { SectionLabel } from '../../../shared/components/section-label';
import { StatusPill } from '../../../shared/components/status-pill';
import { DENIAL_REASON } from '../../../shared/domain/entries';
import { RANGE_COMPARISON, RANGE_SPAN } from '../../../shared/domain/range';
import { formatDecimal, formatInteger, formatShare, formatSigned } from '../../../shared/lib/format';
import { MetricValue } from '../../../shared/components/metric';
import styles from './entries-summary.module.css';

const LAST_WEEKDAY = [
  'od prošle nedjelje',
  'od prošlog ponedjeljka',
  'od prošlog utorka',
  'od prošle srijede',
  'od prošlog četvrtka',
  'od prošlog petka',
  'od prošle subote',
];

const percent = (part: number, whole: number) => (whole === 0 ? 0 : (part / whole) * 100);

interface EntriesSummaryProps {
  data: EntriesPageDto;
  range: AnalyticsRange;
  compact: boolean;
}

export function EntriesSummary({ data, range, compact }: EntriesSummaryProps) {
  const { counts, summary } = data;
  const period = range === 'today' ? 'danas' : `· ${RANGE_SPAN[range]}`;
  const comparison = range === 'today' ? LAST_WEEKDAY[new Date(data.asOf).getDay()] : RANGE_COMPARISON[range];
  const delta = `${formatSigned(summary.deltaPercent, formatDecimal)} %`;
  const deniedShare = `${formatDecimal(percent(counts.denied, counts.all))} %`;
  const topDenial = summary.topDenial;

  if (compact) {
    return (
      <section className={styles.compact} aria-label="Sažetak ulaza">
        <Card className={styles.card}>
          <SectionLabel>Ulazi</SectionLabel>
          <MetricValue value={formatInteger(counts.all)} />
          <Delta value={delta} good={summary.deltaPercent >= 0} />
        </Card>
        <Card className={styles.card}>
          <SectionLabel>Odbijeni</SectionLabel>
          <MetricValue value={formatInteger(counts.denied)} />
          <p className={styles.bad}>{deniedShare}</p>
        </Card>
        <Card className={styles.card}>
          <SectionLabel>Članovi</SectionLabel>
          <MetricValue value={formatInteger(summary.uniqueMembers)} />
          <p className={styles.note}>jedinstveni</p>
        </Card>
      </section>
    );
  }

  return (
    <section className={styles.row} aria-label="Sažetak ulaza">
      <Card className={styles.card}>
        <SectionLabel>Ulazi {period}</SectionLabel>
        <MetricValue value={formatInteger(counts.all)} />
        <Delta value={delta} good={summary.deltaPercent >= 0}>
          {comparison}
        </Delta>
      </Card>
      <Card className={styles.card}>
        <div className={styles.head}>
          <SectionLabel>Odbijeni {period}</SectionLabel>
          <StatusPill level="danger">{deniedShare}</StatusPill>
        </div>
        <MetricValue value={formatInteger(counts.denied)} />
        <p className={styles.note}>
          {topDenial ? (
            <>
              Najčešće:{' '}
              <b>
                {DENIAL_REASON[topDenial.reason].toLowerCase()} ({formatInteger(topDenial.count)})
              </b>
            </>
          ) : (
            'Nema odbijenih ulaza.'
          )}
        </p>
      </Card>
      <Card className={styles.card}>
        <SectionLabel>Jedinstveni članovi {period}</SectionLabel>
        <MetricValue value={formatInteger(summary.uniqueMembers)} />
        <p className={styles.note}>
          {formatShare(summary.uniqueMembers, summary.activeMembers)} <b>aktivnih članova</b>
        </p>
      </Card>
    </section>
  );
}
