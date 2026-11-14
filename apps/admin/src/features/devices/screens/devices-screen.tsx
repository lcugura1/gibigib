import type { DevicesDto } from '@gibigib/types';
import { useCatalog } from '../../../shared/catalog/catalog';
import { LoadError } from '../../../shared/components/load-error';
import { Skeleton, SkeletonCard } from '../../../shared/components/skeleton';
import { gymColor } from '../../../shared/domain/palette';
import { ManagementHeader } from '../../../shared/layout/management-header';
import { useViewport } from '../../../shared/layout/viewport';
import type { Remote } from '../../../shared/lib/remote';
import { useObservable } from '../../../shared/lib/use-observable';
import { DevicesAlert } from '../components/devices-alert';
import { GymDevicesCard } from '../components/gym-devices-card';
import { devices$, retryDevices } from '../services/devices-state';
import styles from './devices-screen.module.css';

const LOADING: Remote<DevicesDto> = { status: 'loading' };

const needsAttention = (gym: DevicesDto['gyms'][number]) => gym.devices.some((device) => !device.online);

export function DevicesScreen() {
  const phone = useViewport() === 'phone';
  const view = useObservable(devices$, LOADING);
  const catalog = useCatalog();
  const gymIds = catalog.gyms.map((gym) => gym.id);
  const data = view.status === 'ready' ? view.data : undefined;
  const gyms = data
    ? phone
      ? [...data.gyms].sort((a, b) => Number(needsAttention(b)) - Number(needsAttention(a)))
      : data.gyms
    : [];

  return (
    <div className={styles.screen} aria-busy={view.status === 'loading'}>
      <ManagementHeader
        title="Uređaji"
        subtitle={
          phone
            ? 'Čitači i kontroleri vrata'
            : `Čitači kodova i kontroleri vrata · provjera svakih ${data?.pollSeconds ?? 30} s`
        }
      />
      {view.status === 'error' && <LoadError title="Stanje uređaja se nije učitalo" onRetry={retryDevices} />}
      {data && <DevicesAlert data={data} />}
      <div className={styles.grid}>
        {view.status === 'loading' &&
          [0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} className={styles.skeleton}>
              <Skeleton width="40%" height="1.25rem" />
              <Skeleton height="3rem" shape="block" />
              <Skeleton height="3rem" shape="block" />
              <Skeleton width="35%" height="2.75rem" shape="block" />
            </SkeletonCard>
          ))}
        {data &&
          gyms.map((gym) => (
            <GymDevicesCard key={gym.gymId} gym={gym} color={gymColor(gymIds, gym.gymId)} asOf={data.asOf} />
          ))}
      </div>
    </div>
  );
}
