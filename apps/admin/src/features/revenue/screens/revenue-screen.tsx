import { useRef } from 'react';
import type { RevenueDto } from '@gibigib/types';
import { useCatalog } from '../../../shared/catalog/catalog';
import { EmptyState } from '../../../shared/components/empty-state';
import { ListSkeleton } from '../../../shared/components/list-skeleton';
import { LoadError } from '../../../shared/components/load-error';
import { Pager, shownRange } from '../../../shared/components/pager';
import { ScopeRangeControls } from '../../../shared/components/scope-range-controls';
import { RANGE_PREVIOUS, RANGE_SPAN } from '../../../shared/domain/range';
import { PageHeader } from '../../../shared/layout/page-header';
import { useViewport } from '../../../shared/layout/viewport';
import { formatInteger } from '../../../shared/lib/format';
import type { Remote } from '../../../shared/lib/remote';
import { useObservable } from '../../../shared/lib/use-observable';
import { MonthlyRevenue } from '../components/monthly-revenue';
import { PaymentsHead, PaymentsList, PaymentsTable } from '../components/payments-section';
import { RevenueBreakdown } from '../components/revenue-breakdown';
import { PendingKpis, RevenueKpis } from '../components/revenue-kpis';
import { RevenueSkeleton } from '../components/revenue-skeleton';
import { StripeMissing } from '../components/stripe-missing';
import {
  breakdown$,
  connectStripe,
  exportPaymentsCsv,
  goToPage,
  loadMore,
  paymentFilter$,
  payments$,
  range$,
  retryPayments,
  retryRevenue,
  revenue$,
  scope$,
  selectBreakdown,
  selectPaymentFilter,
  selectRange,
  selectScope,
  type PaymentsView,
} from '../services/revenue-state';
import styles from './revenue-screen.module.css';

const LOADING: Remote<RevenueDto> = { status: 'loading' };
const PAYMENTS_LOADING: PaymentsView = { status: 'loading' };

function subtitle(revenue: Remote<RevenueDto>, short: boolean) {
  if (revenue.status === 'loading') return 'Učitavam podatke…';
  if (revenue.status === 'error') return 'Plaćanja preko Stripea';
  if (revenue.data.stripe === 'disconnected') return 'Plaćanja još nisu povezana';
  return short
    ? 'Stripe povezan · iznosi s PDV-om'
    : 'Stripe povezan · kartica, Apple Pay, Google Pay · iznosi s PDV-om';
}

export function RevenueScreen() {
  const viewport = useViewport();
  const phone = viewport === 'phone';
  const revenue = useObservable(revenue$, LOADING);
  const scope = useObservable(scope$, scope$.value);
  const range = useObservable(range$, range$.value);
  const breakdown = useObservable(breakdown$, breakdown$.value);
  const catalog = useCatalog();
  const disconnected = revenue.status === 'ready' && revenue.data.stripe === 'disconnected';

  const controls = (
    <ScopeRangeControls
      scope={{ gyms: catalog.gyms, value: scope, onChange: selectScope }}
      range={range}
      onRange={selectRange}
      comparison={disconnected ? undefined : `Usporedba: ${RANGE_PREVIOUS[range]}`}
    />
  );

  return (
    <div className={styles.screen} aria-busy={revenue.status === 'loading'}>
      <PageHeader title="Prihodi" subtitle={subtitle(revenue, viewport !== 'desktop')} />

      {disconnected
        ? !phone && (
            <div className={styles.off} inert aria-hidden="true">
              {controls}
            </div>
          )
        : controls}

      {revenue.status === 'error' && <LoadError title="Prihodi se nisu učitali" onRetry={retryRevenue} />}
      {revenue.status === 'loading' && <RevenueSkeleton compact={phone} />}

      {revenue.status === 'ready' && revenue.data.stripe === 'disconnected' && (
        <>
          {!phone && <PendingKpis newMembers={revenue.data.newMembers} range={range} compact={false} />}
          <StripeMissing compact={phone} onConnect={connectStripe} />
          {phone && <PendingKpis newMembers={revenue.data.newMembers} range={range} compact />}
        </>
      )}

      {revenue.status === 'ready' && revenue.data.stripe === 'connected' && (
        <>
          <RevenueKpis data={revenue.data} range={range} compact={phone} />
          <MonthlyRevenue
            data={revenue.data}
            catalog={catalog}
            breakdown={breakdown}
            onBreakdown={selectBreakdown}
            compact={phone}
          />
          <RevenueBreakdown breakdown={revenue.data.breakdown} catalog={catalog} viewport={viewport} />
          <Payments />
        </>
      )}
    </div>
  );
}

function Payments() {
  const viewport = useViewport();
  const phone = viewport === 'phone';
  const view = useObservable(payments$, PAYMENTS_LOADING);
  const filter = useObservable(paymentFilter$, paymentFilter$.value);
  const range = useObservable(range$, range$.value);
  const catalog = useCatalog();
  const top = useRef<HTMLElement>(null);
  const ready = view.status === 'ready' ? view : undefined;
  const period = range === 'today' ? 'danas' : `u ${RANGE_SPAN[range]}`;

  const changePage = (page: number) => {
    goToPage(page);
    top.current?.scrollIntoView({ block: 'start' });
  };

  const empty = (
    <EmptyState icon="card" title={filter === 'all' ? 'Nema plaćanja.' : 'Nema takvih plaćanja.'}>
      {filter === 'all' ? `Nema plaćanja ${period}.` : `Sva plaćanja ${period} su u redu.`}
    </EmptyState>
  );

  return (
    <section ref={top} className={styles.section} aria-labelledby="payments-heading">
      <PaymentsHead
        filter={filter}
        counts={ready?.page.counts}
        compact={phone}
        onFilter={selectPaymentFilter}
        onExport={exportPaymentsCsv}
      />

      {view.status === 'error' && <LoadError title="Plaćanja se nisu učitala" onRetry={retryPayments} />}

      {phone ? (
        <>
          {view.status === 'loading' && <ListSkeleton variant="cards" />}
          {ready && ready.items.length === 0 && <div className={styles.emptyCard}>{empty}</div>}
          {ready && ready.items.length > 0 && (
            <>
              <PaymentsList payments={ready.items} />
              {(ready.items.length < ready.page.total || ready.loadMoreFailed) && (
                <button
                  type="button"
                  className={styles.more}
                  disabled={ready.loadingMore}
                  onClick={() => loadMore(ready.page.page + 1)}
                >
                  {ready.loadingMore ? 'Učitavam…' : ready.loadMoreFailed ? 'Pokušaj ponovno' : 'Učitaj još'}
                </button>
              )}
            </>
          )}
        </>
      ) : (
        view.status !== 'error' && (
          <PaymentsTable payments={ready?.items ?? []} catalog={catalog} compact={viewport === 'tablet'}>
            {view.status === 'loading' && <ListSkeleton variant="table" />}
            {ready && ready.items.length === 0 && empty}
            {ready && ready.page.total > ready.page.pageSize && (
              <Pager
                label="Stranice plaćanja"
                summary={`Prikazano ${shownRange(ready.page.page, ready.page.pageSize, ready.items.length)} od ${formatInteger(ready.page.total)} plaćanja ${period}`}
                page={ready.page.page}
                pageSize={ready.page.pageSize}
                total={ready.page.total}
                onPage={changePage}
              />
            )}
          </PaymentsTable>
        )
      )}
    </section>
  );
}
