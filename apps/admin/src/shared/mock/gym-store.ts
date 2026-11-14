import { BehaviorSubject } from 'rxjs';
import { GYMS } from './fixtures';

export interface GymRecord {
  id: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  capacity: number;
  openingHours: { weekdays: { from: number; to: number }; weekend: { from: number; to: number } };
}

const POSTAL: Record<string, string> = { Varaždin: '42000', Zagreb: '10000' };

export const gymRecords$ = new BehaviorSubject<readonly GymRecord[]>(
  GYMS.map((gym) => ({
    id: gym.id,
    name: gym.name,
    street: gym.address,
    postalCode: POSTAL[gym.city] ?? '',
    city: gym.city,
    capacity: gym.capacity,
    openingHours: { weekdays: { from: 6, to: 23 }, weekend: { from: 8, to: 20 } },
  })),
);

export const occupancyWindow$ = new BehaviorSubject(60);

export const gymRecord = (id: string) => gymRecords$.value.find((gym) => gym.id === id);

export const fullAddress = (gym: GymRecord) => `${gym.street}, ${gym.postalCode} ${gym.city}`.trim();

export function parseAddress(address: string): Pick<GymRecord, 'street' | 'postalCode' | 'city'> {
  const [street = '', rest = ''] = address.split(/,(.*)/s).map((part) => part.trim());
  const match = /^(\d{5})\s+(.+)$/.exec(rest);
  return { street, postalCode: match?.[1] ?? '', city: match?.[2] ?? rest };
}
