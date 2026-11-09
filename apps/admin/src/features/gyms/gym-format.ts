import type { GymDetailDto } from '@gibigib/types';

const ON_WEEKDAY = ['nedjeljom', 'ponedjeljkom', 'utorkom', 'srijedom', 'četvrtkom', 'petkom', 'subotom'];

const hour = (value: number) => String(value).padStart(2, '0');

export const onWeekday = (iso: string) => ON_WEEKDAY[new Date(iso).getDay()] ?? '';

export function formatOpeningHours({ weekdays, weekend }: GymDetailDto['gym']['openingHours']) {
  return `Pon–Pet ${hour(weekdays.from)}–${hour(weekdays.to)} · Sub–Ned ${hour(weekend.from)}–${hour(weekend.to)}`;
}
