import type { LiveStatusDto, OverviewDto } from '@gibigib/types';
import { LoadError } from '../../../shared/components/load-error';
import { ScopeRangeControls } from '../../../shared/components/scope-range-controls';
import { gymIdOf } from '../../../shared/domain/scope';
import { RANGE_PREVIOUS } from '../../../shared/domain/range';
import { PageHeader } from '../../../shared/layout/page-header';
import { useViewport, type Viewport } from '../../../shared/layout/viewport';
import { formatFullDate, formatTime } from '../../../shared/lib/format';
import { liveStatus$ } from '../../../shared/live/live-status';
import type { Remote } from '../../../shared/lib/remote';
import { useObservable } from '../../../shared/lib/use-observable';
import { ArrivalsChart } from '../../../shared/analytics/arrivals-chart';
import { AttentionCard } from '../../../shared/analytics/attention-card';
import { HardwareNotice } from '../components/hardware-notice';
import { KpiRow } from '../../../shared/analytics/kpi-row';
import { LiveGyms } from '../components/live-gyms';
import layout from '../components/overview-layout.module.css';
import { OverviewSkeleton } from '../components/overview-skeleton';
import { PeakHours } from '../../../shared/analytics/peak-hours';
import { PlanMix } from '../../../shared/analytics/plan-mix';
import { RecentEntries } from '../../../shared/analytics/recent-entries';
import {
  overview$,
  range$,
  recentEntries$,
  retryOverview,
  scope$,
  selectRange,
  selectScope,
} from '../services/overview-state';
import styles from './overview-screen.module.css';

const LOADING: Remote<OverviewDto> = { status: 'loading' };

function occupancyOf(live: LiveStatusDto, gymId: string | undefined) {
  const gyms = live.gyms.filter((gym) => !gymId || gym.id === gymId);
  return {
    count: gyms.reduce((sum, gym) => sum + gym.count, 0),
    capacity: gyms.reduce((sum, gym) => sum + gym.capacity, 0),
    windowMinutes: live.windowMinutes,
  };
}

function subtitle(overview: Remote<OverviewDto>, live: LiveStatusDto | undefined, viewport: Viewport) {
  if (overview.status === 'error') return live ? `Zadnje ažuriranje u ${formatTime(live.updatedAt)}` : '';
  if (overview.status === 'loading' || !live) return 'Učitavam podatke…';
  const updated = viewport === 'phone' ? '' : 'ažurirano u ';
  return `${formatFullDate(live.updatedAt)} · ${updated}${formatTime(live.updatedAt)}`;
}

export function OverviewScreen() {
  const viewport = useViewport();
  const scope = useObservable(scope$, scope$.value);
  const range = useObservable(range$, range$.value);
  const overview = useObservable(overview$, LOADING);
  const live = useObservable(liveStatus$, undefined);
  const entries = useObservable(recentEntries$, []);
  const gymId = gymIdOf(scope);

  return (
    <div className={styles.screen} aria-busy={overview.status === 'loading'}>
      <PageHeader title="Pregled" subtitle={subtitle(overview, live, viewport)} />
      <ScopeRangeControls
        scope={{ gyms: live?.gyms ?? [], value: scope, onChange: selectScope }}
        range={range}
        onRange={selectRange}
        comparison={`Usporedba: ${RANGE_PREVIOUS[range]}`}
      />

      {overview.status === 'error' && (
        <LoadError onRetry={retryOverview} note="Ulazi na vratima rade i bez ove veze." />
      )}

      {(overview.status === 'loading' || (overview.status === 'ready' && !live)) && <OverviewSkeleton />}

      {overview.status === 'ready' && live && (
        <>
          <HardwareNotice status={live} />
          <KpiRow overview={overview.data} range={range} occupancy={occupancyOf(live, gymId)} />
          <LiveGyms live={live} />
          <div className={layout.board}>
            <ArrivalsChart
              className={layout.arrivals}
              arrivals={overview.data.arrivals}
              gyms={live.gyms}
              range={range}
              onRangeChange={selectRange}
            />
            <PeakHours
              className={layout.peak}
              peakHours={overview.data.peakHours}
              range={range}
              onRangeChange={selectRange}
            />
            <AttentionCard className={layout.attention} attention={overview.data.attention} gyms={live.gyms} />
            <PlanMix className={layout.plans} planMix={overview.data.planMix} />
            <RecentEntries className={layout.entries} entries={entries} live={live} gymId={gymId} />
          </div>
        </>
      )}
    </div>
  );
}
