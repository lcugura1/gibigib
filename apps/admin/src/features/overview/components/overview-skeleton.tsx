import { SectionLabel } from '../../../shared/components/section-label';
import { Skeleton, SkeletonCard } from '../../../shared/components/skeleton';
import styles from './overview-skeleton.module.css';
import kpiStyles from '../../../shared/analytics/kpi-row.module.css';
import layout from './overview-layout.module.css';

const KPI_WIDTHS = [
  ['60%', '55%'],
  ['50%', '40%'],
  ['55%', '65%'],
  ['45%', '35%'],
] as const;

const LIVE_WIDTHS = ['50%', '55%', '45%', '50%'];
const LEGEND_WIDTHS = ['7.5rem', '8.125rem', '6.875rem', '7.5rem'];
const ATTENTION_WIDTHS = [
  ['60%', '80%'],
  ['50%', '75%'],
  ['65%', '70%'],
  ['55%', '80%'],
] as const;
const HEAT_ROWS = 7;
const GRID_LINES = 5;

export function OverviewSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={kpiStyles.row}>
        {KPI_WIDTHS.map(([label, value], i) => (
          <SkeletonCard key={i} className={styles.kpi}>
            <Skeleton width={label} height="0.75rem" />
            <Skeleton width={value} height="2.5rem" shape="block" />
            <Skeleton width="100%" height="0.5rem" />
            <Skeleton width="45%" height="0.75rem" />
          </SkeletonCard>
        ))}
      </div>

      <section className={styles.section}>
        <SectionLabel>Uživo po teretanama</SectionLabel>
        <div className={layout.liveGrid}>
          {LIVE_WIDTHS.map((width, i) => (
            <SkeletonCard key={i} className={styles.live}>
              <Skeleton width={width} height="1rem" />
              <Skeleton width="45%" height="2.5rem" shape="block" />
              <Skeleton width="100%" height="0.5rem" />
              <Skeleton width="60%" height="0.75rem" />
            </SkeletonCard>
          ))}
        </div>
      </section>

      <div className={layout.board}>
        <SkeletonCard className={`${layout.arrivals} ${styles.chart}`}>
          <div className={styles.row}>
            <Skeleton width="7.5rem" height="0.75rem" />
            <Skeleton width="5.625rem" height="1.5rem" shape="block" />
          </div>
          <div className={styles.legend}>
            {LEGEND_WIDTHS.map((width, i) => (
              <Skeleton key={i} width={width} height="2.25rem" shape="pill" />
            ))}
          </div>
          <div className={styles.gridLines}>
            {Array.from({ length: GRID_LINES }, (_, i) => (
              <Skeleton key={i} height="1px" />
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard className={`${layout.peak} ${styles.heat}`}>
          <Skeleton width="6.875rem" height="0.75rem" className={styles.heatTitle} />
          {Array.from({ length: HEAT_ROWS }, (_, i) => (
            <Skeleton key={i} height="1.75rem" className={styles.heatRow} />
          ))}
        </SkeletonCard>

        <SkeletonCard className={`${layout.attention} ${styles.list}`}>
          <Skeleton width="7.5rem" height="0.75rem" />
          {ATTENTION_WIDTHS.map(([name, meta], i) => (
            <div key={i} className={styles.person}>
              <Skeleton width="2.25rem" height="2.25rem" shape="circle" />
              <div className={styles.personText}>
                <Skeleton width={name} height="0.75rem" />
                <Skeleton width={meta} height="0.625rem" />
              </div>
            </div>
          ))}
        </SkeletonCard>

        <SkeletonCard className={`${layout.plans} ${styles.plans}`}>
          <Skeleton width="8.75rem" height="0.75rem" className={styles.plansTitle} />
          <span className={styles.ring} />
          <div className={styles.legend}>
            {LEGEND_WIDTHS.slice(0, 3).map((width, i) => (
              <Skeleton key={i} width={width} height="2.25rem" shape="pill" />
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}
