import type { DevicesDto } from '@gibigib/types';
import type { Observable } from 'rxjs';
import { GYMS, NOW, local, mockNow } from '../../../shared/mock/fixtures';
import { respond } from '../../../shared/mock/respond';
import { LIVE_POLL_MS } from '../../../shared/live/live-status';
import { auditEntries } from '../../audit/services/audit-store';
import { sampleRecentEntries } from '../../entries/services/sample-data';
import { sampleLiveStatus } from '../../overview/services/sample-data';

export interface DevicesApi {
  devices(): Observable<DevicesDto>;
}

const latest = (...values: (string | null | undefined)[]) =>
  values
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;

function sampleDevices(): DevicesDto {
  const live = sampleLiveStatus(false);
  const opens = auditEntries().filter((entry) => entry.kind === 'DEVICE' && entry.title === 'Ručno otvorena vrata');

  return {
    asOf: local(mockNow()),
    pollSeconds: LIVE_POLL_MS / 1000,
    gyms: GYMS.map((gym) => {
      const offline = live.offlineDevices.filter((device) => device.gymId === gym.id);
      const lastEntry = sampleRecentEntries(gym.id, 1)[0]?.at.slice(0, 16);
      const lastManualOpenAt = opens.find((entry) => entry.gymId === gym.id)?.at ?? null;
      const device = (kind: 'reader' | 'controller') => {
        const down = offline.find((d) => d.kind === kind);
        const lastEventAt = kind === 'reader' ? lastEntry : latest(lastEntry, lastManualOpenAt);
        return {
          id: `${gym.id}-${kind}`,
          kind,
          online: !down,
          offlineSince: down?.offlineSince ?? null,
          lastEventAt: down ? down.offlineSince : (lastEventAt ?? local(NOW)),
        };
      };
      return {
        gymId: gym.id,
        name: gym.name,
        address: gym.address,
        city: gym.city,
        devices: [device('reader'), device('controller')],
        lastManualOpenAt,
      };
    }),
  };
}

export const devicesApi: DevicesApi = {
  devices: () => respond(sampleDevices),
};
