import type { AnalyticsRange, PaymentFilter, PaymentsPageDto, RevenueDto } from '@gibigib/types';
import { BehaviorSubject, Subject, combineLatest, firstValueFrom, shareReplay, startWith, switchMap } from 'rxjs';
import { ALL_GYMS, gymIdOf } from '../../../shared/domain/scope';
import { pagedList, type PageRequest, type PagedView } from '../../../shared/lib/paged-list';
import { remote } from '../../../shared/lib/remote';
import { revenueApi } from './revenue-api';

export const PAGE_SIZE = 10;

export type PaymentsView = PagedView<PaymentsPageDto>;
export type Breakdown = 'plan' | 'gym';

export const scope$ = new BehaviorSubject<string>(ALL_GYMS);
export const range$ = new BehaviorSubject<AnalyticsRange>('12m');
export const breakdown$ = new BehaviorSubject<Breakdown>('plan');
export const paymentFilter$ = new BehaviorSubject<PaymentFilter>('all');
const pageRequest$ = new Subject<PageRequest>();
const reload$ = new Subject<void>();
const retryPayments$ = new Subject<void>();

export const selectScope = (scope: string) => scope$.next(scope);
export const selectRange = (range: AnalyticsRange) => range$.next(range);
export const selectBreakdown = (breakdown: Breakdown) => breakdown$.next(breakdown);
export const selectPaymentFilter = (filter: PaymentFilter) => paymentFilter$.next(filter);
export const goToPage = (page: number) => pageRequest$.next({ page, append: false });
export const loadMore = (page: number) => pageRequest$.next({ page, append: true });
export const retryRevenue = () => reload$.next();
export const retryPayments = () => retryPayments$.next();

export const revenue$ = combineLatest([scope$, range$, reload$.pipe(startWith(undefined))]).pipe(
  switchMap(([scope, range]) => remote<RevenueDto>(revenueApi.revenue({ gymId: gymIdOf(scope), range }))),
  shareReplay({ bufferSize: 1, refCount: true }),
);

export const payments$ = combineLatest([
  scope$,
  range$,
  paymentFilter$,
  retryPayments$.pipe(startWith(undefined)),
]).pipe(
  switchMap(([scope, range, status]) =>
    pagedList(pageRequest$, (page) =>
      revenueApi.payments({ gymId: gymIdOf(scope), range, status, page, pageSize: PAGE_SIZE }),
    ),
  ),
  shareReplay({ bufferSize: 1, refCount: true }),
);

export const exportPaymentsCsv = () =>
  firstValueFrom(
    revenueApi.exportPaymentsCsv({ gymId: gymIdOf(scope$.value), range: range$.value, status: paymentFilter$.value }),
  );

export async function connectStripe() {
  await firstValueFrom(revenueApi.connectStripe());
  reload$.next();
}
