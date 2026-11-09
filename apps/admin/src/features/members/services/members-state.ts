import type { MemberSortKey, MembersPageDto, MembershipStatus, SortDirection } from '@gibigib/types';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  concat,
  debounceTime,
  defer,
  distinctUntilChanged,
  firstValueFrom,
  map,
  shareReplay,
  skip,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { memberSearch$, setMemberSearch } from '../../../shared/layout/member-search';
import { pagedList, type PageRequest, type PagedView } from '../../../shared/lib/paged-list';
import { membersApi, type MembersCriteria } from './members-api';

export const PAGE_SIZE = 16;
const SEARCH_DEBOUNCE_MS = 250;

export interface MemberFilters {
  status?: MembershipStatus;
  planSlug?: string;
  gymId?: string;
  inactiveOnly: boolean;
}

export interface MemberSort {
  key: MemberSortKey;
  direction: SortDirection;
}

export type MembersView = PagedView<MembersPageDto>;

const NO_FILTERS: MemberFilters = { inactiveOnly: false };

const DEFAULT_DIRECTION: Record<MemberSortKey, SortDirection> = {
  name: 'asc',
  plan: 'asc',
  status: 'asc',
  homeGym: 'asc',
  expiresAt: 'asc',
  lastVisit: 'desc',
  visits30d: 'desc',
};

export const filters$ = new BehaviorSubject<MemberFilters>(NO_FILTERS);
export const sort$ = new BehaviorSubject<MemberSort>({ key: 'name', direction: 'asc' });
const pageRequest$ = new Subject<PageRequest>();
const retry$ = new Subject<void>();

export const setFilters = (patch: Partial<MemberFilters>) => filters$.next({ ...filters$.value, ...patch });

export const hasActiveFilters = (filters: MemberFilters, search: string) =>
  Boolean(filters.status || filters.planSlug || filters.gymId || filters.inactiveOnly || search.trim());

export function clearFilters() {
  filters$.next(NO_FILTERS);
  setMemberSearch('');
}

export function sortBy(key: MemberSortKey, direction?: SortDirection) {
  const current = sort$.value;
  const next =
    direction ?? (current.key === key ? (current.direction === 'asc' ? 'desc' : 'asc') : DEFAULT_DIRECTION[key]);
  sort$.next({ key, direction: next });
}

export const goToPage = (page: number) => pageRequest$.next({ page, append: false });
export const loadMore = (page: number) => pageRequest$.next({ page, append: true });
export const retryMembers = () => retry$.next();

const debouncedSearch$ = defer(() =>
  concat(memberSearch$.pipe(take(1)), memberSearch$.pipe(skip(1), debounceTime(SEARCH_DEBOUNCE_MS))),
).pipe(
  map((text) => text.trim()),
  distinctUntilChanged(),
);

const toCriteria = (search: string, filters: MemberFilters, sort: MemberSort): MembersCriteria => ({
  search: search || undefined,
  ...filters,
  sort: sort.key,
  direction: sort.direction,
});

export const members$ = combineLatest([debouncedSearch$, filters$, sort$, retry$.pipe(startWith(undefined))]).pipe(
  switchMap(([search, filters, sort]) => {
    const criteria = toCriteria(search, filters, sort);
    return pagedList(pageRequest$, (page) => membersApi.members({ ...criteria, page, pageSize: PAGE_SIZE }));
  }),
  shareReplay({ bufferSize: 1, refCount: true }),
);

export async function exportMembersCsv() {
  const criteria = toCriteria(memberSearch$.value.trim(), filters$.value, sort$.value);
  return firstValueFrom(membersApi.exportCsv(criteria));
}
