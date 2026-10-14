import type { GymSettingsInput, PasswordChange, SettingsDto } from '@gibigib/types';
import { throwError, type Observable } from 'rxjs';
import { fullAddress, gymRecord, gymRecords$, occupancyWindow$, parseAddress } from '../../../shared/mock/gym-store';
import { respond } from '../../../shared/mock/respond';
import { account } from '../../../shared/mock/session';
import { stripeAccount } from '../../../shared/mock/stripe-account';
import { formatInteger } from '../../../shared/lib/format';
import { recordChange } from '../../audit/services/audit-store';

export class WrongPasswordError extends Error {}

export interface SettingsApi {
  settings(): Observable<SettingsDto>;
  saveGym(id: string, input: GymSettingsInput): Observable<true>;
  saveOccupancyWindow(minutes: number): Observable<true>;
  saveEmail(email: string): Observable<true>;
  changePassword(change: PasswordChange): Observable<true>;
}

const sampleSettings = (): SettingsDto => ({
  gyms: gymRecords$.value.map((gym) => ({
    id: gym.id,
    name: gym.name,
    address: fullAddress(gym),
    capacity: gym.capacity,
    openingHours: gym.openingHours,
  })),
  occupancy: { windowMinutes: occupancyWindow$.value, comfortableBelow: 50, busyFrom: 80 },
  stripe: {
    connected: stripeAccount.connected,
    accountName: stripeAccount.connected ? stripeAccount.accountName : null,
    methods: ['Kartica', 'Apple Pay', 'Google Pay'],
  },
  account: { name: account.name, email: account.email },
});

const hours = ({ from, to }: { from: number; to: number }) =>
  `${String(from).padStart(2, '0')}–${String(to).padStart(2, '0')}`;

function gymChanges(id: string, input: GymSettingsInput) {
  const before = gymRecord(id);
  if (!before) return [];
  const changes: { title: string; detail: string }[] = [];
  if (before.name !== input.name)
    changes.push({ title: 'Promijenjen naziv', detail: `${before.name} → ${input.name}` });
  if (before.capacity !== input.capacity)
    changes.push({
      title: 'Promijenjen kapacitet',
      detail: `${formatInteger(before.capacity)} → ${formatInteger(input.capacity)}`,
    });
  if (fullAddress(before) !== input.address) changes.push({ title: 'Promijenjena adresa', detail: input.address });
  const { weekdays, weekend } = input.openingHours;
  if (hours(before.openingHours.weekdays) !== hours(weekdays) || hours(before.openingHours.weekend) !== hours(weekend))
    changes.push({
      title: 'Promijenjeno radno vrijeme',
      detail: `Pon–Pet ${hours(weekdays)} · Sub–Ned ${hours(weekend)}`,
    });
  return changes;
}

export const settingsApi: SettingsApi = {
  settings: () => respond(sampleSettings),
  saveGym: (id, input) =>
    respond(() => {
      if (!gymRecord(id)) return undefined;
      for (const change of gymChanges(id, input))
        recordChange({ kind: 'SETTINGS', title: change.title, details: [change.detail], gymId: id });
      gymRecords$.next(
        gymRecords$.value.map((gym) =>
          gym.id === id
            ? {
                ...gym,
                ...parseAddress(input.address),
                name: input.name,
                capacity: input.capacity,
                openingHours: input.openingHours,
              }
            : gym,
        ),
      );
      return true as const;
    }),
  saveOccupancyWindow: (minutes) =>
    respond(() => {
      if (occupancyWindow$.value !== minutes)
        recordChange({
          kind: 'SETTINGS',
          title: 'Promijenjen prozor popunjenosti',
          details: [`${occupancyWindow$.value} → ${minutes} min`],
          gymId: null,
        });
      occupancyWindow$.next(minutes);
      return true as const;
    }),
  saveEmail: (email) =>
    respond(() => {
      account.email = email;
      return true as const;
    }),
  changePassword: ({ current, next }) =>
    current !== account.password
      ? throwError(() => new WrongPasswordError())
      : respond(() => {
          account.password = next;
          return true as const;
        }),
};
