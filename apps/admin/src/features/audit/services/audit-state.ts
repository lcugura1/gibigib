import type { AnalyticsRange, AuditActorKind, AuditKind, AuditPageDto } from '@gibigib/types';
import { BehaviorSubject, Subject, combineLatest, firstValueFrom, shareReplay, startWith, switchMap } from 'rxjs';
import { pagedList, type PageRequest, type PagedView } from '../../../shared/lib/paged-list';
import { auditApi, type AuditCriteria } from './audit-api';

export const PAGE_SIZE = 15;

export interface AuditFilters {
  kind?: AuditKind;
  actor?: AuditActorKind;
  gymId?: string;
}

export type AuditView = PagedView<AuditPageDto>;

export const range$ = new BehaviorSubject<AnalyticsRange>('7d');
export const filters$ = new BehaviorSubject<AuditFilters>({});
const pageRequest$ = new Subject<PageRequest>();
const retry$ = new Subject<void>();

export const selectRange = (range: AnalyticsRange) => range$.next(range);
export const setFilters = (patch: AuditFilters) => filters$.next({ ...filters$.value, ...patch });
export const clearFilters = () => filters$.next({});
export const goToPage = (page: number) => pageRequest$.next({ page, append: false });
export const loadMore = (page: number) => pageRequest$.next({ page, append: true });
export const retryAudit = () => retry$.next();

const criteriaOf = (range: AnalyticsRange, filters: AuditFilters): AuditCriteria => ({ range, ...filters });

export const audit$ = combineLatest([range$, filters$, retry$.pipe(startWith(undefined))]).pipe(
  switchMap(([range, filters]) =>
    pagedList(pageRequest$, (page) => auditApi.entries({ ...criteriaOf(range, filters), page, pageSize: PAGE_SIZE })),
  ),
  shareReplay({ bufferSize: 1, refCount: true }),
);

export const exportAuditCsv = () => firstValueFrom(auditApi.exportCsv(criteriaOf(range$.value, filters$.value)));
