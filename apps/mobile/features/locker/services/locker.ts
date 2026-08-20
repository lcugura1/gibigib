import type { LockerDto } from '@gibigib/types';
import { authedFetch } from '@/shared/api';

export function fetchLockers() {
  return authedFetch<LockerDto[]>('/lockers');
}
