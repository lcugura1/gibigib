import { PageHeader } from '../../../shared/layout/page-header';
import { formatFullDate, formatTime } from '../../../shared/lib/format';
import { useObservable } from '../../../shared/lib/use-observable';
import { ArrivalsChart } from '../components/arrivals-chart';
import { AttentionCard } from '../components/attention-card';
import { HardwareNotice } from '../components/hardware-notice';
import { KpiRow } from '../components/kpi-row';
import { LiveGyms } from '../components/live-gyms';
import { OverviewControls } from '../components/overview-controls';
import { PeakHours } from '../components/peak-hours';
import { PlanMix } from '../components/plan-mix';
import { RecentEntries } from '../components/recent-entries';
import {
  ALL_GYMS,
  liveStatus$,
  overview$,
  range$,
  recentEntries$,
  retryOverview,
  scope$,
} from '../services/overview-state';
import styles from './overview-screen.module.css';

export function OverviewScreen() {
  const scope = useObservable(scope$, scope$.value);
  const range = useObservable(range$, range$.value);
  const overview = useObservable(overview$, undefined);
  const live = useObservable(liveStatus$, undefined);
  const entries = useObservable(recentEntries$, []);
  const gymId = scope === ALL_GYMS ? undefined : scope;

  const subtitle = live ? `${formatFullDate(live.updatedAt)} · ažurirano u ${formatTime(live.updatedAt)}` : '';

  return (
    <div className={styles.screen}>
      <PageHeader title="Pregled" subtitle={subtitle} />

      {overview?.status === 'error' && (
        <div className={styles.state} role="alert">
          <p>Nije moguće povezati se s poslužiteljem. Pokušaj ponovno.</p>
          <button type="button" className={styles.retry} onClick={retryOverview}>
            Pokušaj ponovno
          </button>
        </div>
      )}

      {(!overview || !live) && overview?.status !== 'error' && (
        <p className={styles.state} role="status">
          Učitavanje…
        </p>
      )}

      {overview?.status === 'ready' && live && (
        <>
          <OverviewControls gyms={live.gyms} scope={scope} range={range} />
          <HardwareNotice status={live} />
          <KpiRow overview={overview.data} live={live} gymId={gymId} range={range} />
          <LiveGyms live={live} />
          <div className={styles.board}>
            <ArrivalsChart className={styles.wide} arrivals={overview.data.arrivals} gyms={live.gyms} range={range} />
            <PlanMix className={`${styles.narrow} ${styles.stretch}`} planMix={overview.data.planMix} />
            <div className={`${styles.stack} ${styles.wide}`}>
              <PeakHours peakHours={overview.data.peakHours} range={range} />
              <RecentEntries entries={entries} live={live} gymId={gymId} />
            </div>
            <AttentionCard className={styles.narrow} attention={overview.data.attention} gyms={live.gyms} />
          </div>
        </>
      )}
    </div>
  );
}
