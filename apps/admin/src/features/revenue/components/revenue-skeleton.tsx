import kpiStyles from '../../../shared/analytics/kpi-row.module.css';
import { ListSkeleton } from '../../../shared/components/list-skeleton';
import { Skeleton, SkeletonCard } from '../../../shared/components/skeleton';
import styles from './revenue-skeleton.module.css';

const KPI_WIDTHS = ['55%', '45%', '60%', '40%'];
const BAR_HEIGHTS = [70, 71, 73, 75, 76, 77, 78, 77, 75, 76, 80, 84];

export function RevenueSkeleton({ compact }: { compact: boolean }) {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={kpiStyles.row}>
        {KPI_WIDTHS.map((width, i) => (
          <SkeletonCard key={i} className={styles.kpi}>
            <Skeleton width={width} height="0.75rem" />
            <Skeleton width="60%" height="2.5rem" shape="block" />
            <Skeleton width="70%" height="0.75rem" />
          </SkeletonCard>
        ))}
      </div>
      <SkeletonCard className={styles.chart}>
        <Skeleton width="10rem" height="0.75rem" />
        <div className={styles.bars}>
          {BAR_HEIGHTS.map((height, i) => (
            <Skeleton key={i} height={`${height}%`} shape="block" />
          ))}
        </div>
      </SkeletonCard>
      <div className={styles.list}>
        <ListSkeleton variant={compact ? 'cards' : 'table'} />
      </div>
    </div>
  );
}
