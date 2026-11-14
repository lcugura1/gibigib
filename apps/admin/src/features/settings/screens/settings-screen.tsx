import type { SettingsDto } from '@gibigib/types';
import { LoadError } from '../../../shared/components/load-error';
import { Skeleton, SkeletonCard } from '../../../shared/components/skeleton';
import { ManagementHeader } from '../../../shared/layout/management-header';
import { useViewport } from '../../../shared/layout/viewport';
import type { Remote } from '../../../shared/lib/remote';
import { useObservable } from '../../../shared/lib/use-observable';
import { connectStripe } from '../../revenue/services/revenue-state';
import { AccountCard } from '../components/account-card';
import { GymSettingsCard } from '../components/gym-settings-card';
import { OccupancyCard } from '../components/occupancy-card';
import { PaymentsCard } from '../components/payments-card';
import {
  retrySettings,
  saveAccountEmail,
  saveGymSettings,
  saveOccupancyWindow,
  selectGym,
  selectedGym$,
  settings$,
} from '../services/settings-state';
import styles from './settings-screen.module.css';

const LOADING: Remote<SettingsDto> = { status: 'loading' };

const DEFAULT_GYM = 'z1';

export function SettingsScreen() {
  const phone = useViewport() === 'phone';
  const view = useObservable(settings$, LOADING);
  const selectedId = useObservable(selectedGym$, selectedGym$.value);
  const data = view.status === 'ready' ? view.data : undefined;
  const selected = data && (data.gyms.find((gym) => gym.id === (selectedId ?? DEFAULT_GYM)) ?? data.gyms[0]);

  const connect = async () => {
    await connectStripe();
    retrySettings();
  };

  return (
    <div className={styles.screen} aria-busy={view.status === 'loading'}>
      <ManagementHeader
        title="Postavke"
        subtitle={phone ? undefined : 'Teretane, popunjenost, plaćanja i tvoj račun'}
      />
      {view.status === 'error' && <LoadError title="Postavke se nisu učitale" onRetry={retrySettings} />}
      {view.status === 'loading' && (
        <div className={styles.layout} aria-hidden="true">
          <SkeletonCard className={styles.skeleton}>
            <Skeleton width="30%" height="0.75rem" />
            <Skeleton height="3.5rem" shape="block" />
            <Skeleton height="3.5rem" shape="block" />
            <Skeleton height="3rem" shape="block" />
          </SkeletonCard>
          <SkeletonCard className={styles.skeleton}>
            <Skeleton width="40%" height="0.75rem" />
            <Skeleton height="3rem" shape="block" />
          </SkeletonCard>
        </div>
      )}
      {data && selected && (
        <div className={styles.layout}>
          <div className={styles.main}>
            <GymSettingsCard gyms={data.gyms} selected={selected} onSelect={selectGym} onSave={saveGymSettings} />
            <OccupancyCard occupancy={data.occupancy} onSave={saveOccupancyWindow} />
          </div>
          <div className={styles.side}>
            <PaymentsCard stripe={data.stripe} onConnect={connect} />
            <AccountCard account={data.account} onSaveEmail={saveAccountEmail} />
          </div>
        </div>
      )}
    </div>
  );
}
