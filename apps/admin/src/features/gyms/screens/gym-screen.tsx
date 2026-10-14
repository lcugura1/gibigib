import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router';
import { ArrivalsChart } from '../../../shared/analytics/arrivals-chart';
import { AttentionCard } from '../../../shared/analytics/attention-card';
import { KpiRow } from '../../../shared/analytics/kpi-row';
import { PeakHours } from '../../../shared/analytics/peak-hours';
import { PlanMix } from '../../../shared/analytics/plan-mix';
import { RecentEntries } from '../../../shared/analytics/recent-entries';
import { useCatalog } from '../../../shared/catalog/catalog';
import { EmptyState } from '../../../shared/components/empty-state';
import { LoadError } from '../../../shared/components/load-error';
import { ScopeRangeControls } from '../../../shared/components/scope-range-controls';
import { Skeleton, SkeletonCard } from '../../../shared/components/skeleton';
import { gymColor } from '../../../shared/domain/palette';
import { RANGE_PREVIOUS } from '../../../shared/domain/range';
import { GYMS_NAV } from '../../../shared/layout/navigation';
import type { Remote } from '../../../shared/lib/remote';
import { useObservable } from '../../../shared/lib/use-observable';
import { liveStatus$ } from '../../../shared/live/live-status';
import type { GymDetailDto, OverviewDto } from '@gibigib/types';
import { GymHeader } from '../components/gym-header';
import { GymTopBar } from '../components/gym-top-bar';
import { LiveCard } from '../components/live-card';
import { OccupancyToday } from '../components/occupancy-today';
import { gymAnalytics$, gymDetail$, gymEntries$, range$, retryGym, selectRange } from '../services/gym-state';
import styles from './gym-screen.module.css';

const LOADING = { status: 'loading' } as const;

function BlockSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonCard className={`${styles.skeleton} ${className ?? ''}`}>
      <Skeleton width="40%" height="0.75rem" />
      <Skeleton width="55%" height="2.5rem" shape="block" />
      <Skeleton width="80%" height="0.75rem" />
    </SkeletonCard>
  );
}

export function GymIndexRedirect() {
  const catalog = useCatalog();
  const [first] = catalog.gyms;
  return first ? <Navigate to={`${GYMS_NAV.href}/${first.id}`} replace /> : null;
}

export function GymScreen() {
  const { gymId = '' } = useParams();
  const catalog = useCatalog();
  const detail$ = useMemo(() => gymDetail$(gymId), [gymId]);
  const analytics$ = useMemo(() => gymAnalytics$(gymId), [gymId]);
  const entries$ = useMemo(() => gymEntries$(gymId), [gymId]);
  const detail = useObservable<Remote<GymDetailDto>>(detail$, LOADING);
  const analytics = useObservable<Remote<OverviewDto>>(analytics$, LOADING);
  const entries = useObservable(entries$, []);
  const live = useObservable(liveStatus$, undefined);
  const range = useObservable(range$, range$.value);
  const color = gymColor(
    catalog.gyms.map((gym) => gym.id),
    gymId,
  );
  const gymName = catalog.gyms.find((gym) => gym.id === gymId)?.name;
  const unknownGym = catalog.gyms.length > 0 && !gymName;

  if (unknownGym) {
    return (
      <EmptyState icon="barbell" title="Teretana nije pronađena.">
        Odaberi teretanu iz izbornika.
      </EmptyState>
    );
  }

  const failed = detail.status === 'error' || analytics.status === 'error';

  return (
    <div className={styles.screen}>
      <GymTopBar catalog={catalog} gymId={gymId} />

      {failed && <LoadError title="Podaci teretane se nisu učitali" onRetry={() => retryGym(gymId)} />}

      {detail.status === 'ready' && <GymHeader detail={detail.data} color={color} />}

      {!failed && (
        <>
          <ScopeRangeControls range={range} onRange={selectRange} comparison={`Usporedba: ${RANGE_PREVIOUS[range]}`} />

          <div className={styles.liveRow}>
            {detail.status === 'ready' ? (
              <>
                <LiveCard className={styles.live} detail={detail.data} />
                <OccupancyToday className={styles.curve} detail={detail.data} color={color} />
              </>
            ) : (
              <>
                <BlockSkeleton className={styles.live} />
                <BlockSkeleton className={styles.curve} />
              </>
            )}
          </div>

          {analytics.status === 'ready' && live ? (
            <>
              <KpiRow overview={analytics.data} range={range} />
              <div className={styles.board}>
                <ArrivalsChart
                  className={styles.arrivals}
                  arrivals={analytics.data.arrivals}
                  gyms={catalog.gyms}
                  range={range}
                  onRangeChange={selectRange}
                />
                <PeakHours
                  className={styles.peak}
                  peakHours={analytics.data.peakHours}
                  range={range}
                  onRangeChange={selectRange}
                  scopeLabel={gymName}
                />
                <PlanMix className={styles.plans} planMix={analytics.data.planMix} />
                <AttentionCard
                  className={styles.attention}
                  attention={analytics.data.attention}
                  gyms={catalog.gyms}
                  variant="flat"
                  scopeLabel={gymName}
                />
                <RecentEntries
                  className={styles.entries}
                  entries={entries}
                  live={live}
                  gymId={gymId}
                  scopeLabel={gymName}
                />
              </div>
            </>
          ) : (
            <div className={styles.board}>
              <BlockSkeleton className={styles.arrivals} />
              <BlockSkeleton className={styles.plans} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
