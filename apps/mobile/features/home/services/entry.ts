import type { EntryTokenDto, OccupancyDto } from '@gibigib/types';
import { authedFetch } from '@/shared/api';

export function fetchEntryToken() {
  return authedFetch<EntryTokenDto>('/entry/token');
}

export function fetchOccupancy() {
  return authedFetch<OccupancyDto>('/occupancy');
}
