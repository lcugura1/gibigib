import type { GymDetailDto } from '@gibigib/types';
import { GYMS, NOW, local, noise } from '../../../shared/mock/fixtures';
import { gymRecord } from '../../../shared/mock/gym-store';
import { sampleRecentEntries } from '../../entries/services/sample-data';
import { hourlyProfile, sampleLiveStatus } from '../../overview/services/sample-data';

const FIRST_HOUR = 6;
const LAST_HOUR = 23;
const AVERAGE_SHARE = 0.92;

export function sampleGymDetail(gymId: string): GymDetailDto | undefined {
  const gym = GYMS.find((g) => g.id === gymId);
  const record = gymRecord(gymId);
  if (!gym || !record) return undefined;
  const live = sampleLiveStatus(false);
  const count = live.gyms.find((g) => g.id === gymId)?.count ?? 0;
  const weekday = (NOW.getDay() + 6) % 7;
  const nowHour = NOW.getHours();
  const reference = hourlyProfile(nowHour, weekday);
  const scale = (hour: number) => hourlyProfile(hour, weekday) / reference;
  const hours = Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, i) => FIRST_HOUR + i);
  const today = hours.map((hour) =>
    hour > nowHour
      ? null
      : hour === nowHour
        ? count
        : Math.round(count * scale(hour) * (0.9 + 0.2 * noise(hour + gym.capacity))),
  );
  const average = hours.map((hour) =>
    Math.round(count * AVERAGE_SHARE * scale(hour) * (0.95 + 0.1 * noise(hour * 3 + gym.capacity))),
  );
  const peakIndex = today.reduce<number>((best, value, i) => ((value ?? -1) > (today[best] ?? -1) ? i : best), 0);
  const offline = live.offlineDevices.filter((device) => device.gymId === gymId);
  const reader = offline.find((device) => device.kind === 'reader');
  const controller = offline.find((device) => device.kind === 'controller');
  const [lastEntry] = sampleRecentEntries(gymId, 1);

  return {
    asOf: local(NOW),
    gym: {
      id: gym.id,
      name: record.name,
      address: record.street,
      city: record.city,
      capacity: record.capacity,
      openingHours: record.openingHours,
    },
    devices: {
      reader: { online: !reader, offlineSince: reader?.offlineSince ?? null },
      controller: { online: !controller, offlineSince: controller?.offlineSince ?? null },
      lastEventAt: reader?.offlineSince ?? lastEntry?.at ?? null,
    },
    live: {
      count,
      windowMinutes: live.windowMinutes,
      averageNow: average[nowHour - FIRST_HOUR] ?? 0,
      peakToday:
        today[peakIndex] === null
          ? null
          : {
              count: today[peakIndex] ?? 0,
              at: local(new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), FIRST_HOUR + peakIndex)),
            },
    },
    occupancyToday: { firstHour: FIRST_HOUR, today, average },
  };
}
