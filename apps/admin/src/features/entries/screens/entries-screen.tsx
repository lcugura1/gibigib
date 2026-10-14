import { useRef } from 'react';
import { EmptyState } from '../../../shared/components/empty-state';
import { ExportButton } from '../../../shared/components/export-button';
import { ListSkeleton } from '../../../shared/components/list-skeleton';
import { LiveLabel } from '../../../shared/components/live-label';
import { LoadError } from '../../../shared/components/load-error';
import { Pager, shownRange } from '../../../shared/components/pager';
import { ScopeRangeControls } from '../../../shared/components/scope-range-controls';
import { Skeleton, SkeletonCard } from '../../../shared/components/skeleton';
import { useCatalog } from '../../../shared/catalog/catalog';
import { RANGE_SPAN } from '../../../shared/domain/range';
import { PageHeader } from '../../../shared/layout/page-header';
import { useViewport } from '../../../shared/layout/viewport';
import { formatInteger } from '../../../shared/lib/format';
import { useObservable } from '../../../shared/lib/use-observable';
import { EntriesFeed } from '../components/entries-feed';
import { EntriesSummary } from '../components/entries-summary';
import { EntriesTable } from '../components/entries-table';
import { ResultChips } from '../components/result-chips';
import {
  entries$,
  exportEntriesCsv,
  goToPage,
  isLive,
  loadOlder,
  range$,
  result$,
  retryEntries,
  scope$,
  selectRange,
  selectScope,
  type EntriesView,
} from '../services/entries-state';
import styles from './entries-screen.module.css';

const LOADING: EntriesView = { status: 'loading' };

function SummarySkeleton() {
  return (
    <div className={styles.summarySkeleton} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <SkeletonCard key={i}>
          <Skeleton width="55%" height="0.75rem" />
          <Skeleton width="40%" height="2.5rem" shape="block" />
          <Skeleton width="65%" height="0.75rem" />
        </SkeletonCard>
      ))}
    </div>
  );
}

export function EntriesScreen() {
  const viewport = useViewport();
  const phone = viewport === 'phone';
  const view = useObservable(entries$, LOADING);
  const scope = useObservable(scope$, scope$.value);
  const range = useObservable(range$, range$.value);
  const result = useObservable(result$, result$.value);
  const catalog = useCatalog();
  const listTop = useRef<HTMLDivElement>(null);
  const ready = view.status === 'ready' ? view : undefined;
  const live = isLive(range, ready?.page.page ?? 1);
  const period = range === 'today' ? 'danas' : `u ${RANGE_SPAN[range]}`;

  const subtitle = live ? (
    <LiveLabel live>{phone ? 'Uživo · danas' : 'Uživo · svako skeniranje koda na vratima'}</LiveLabel>
  ) : (
    `Svako skeniranje koda na vratima · ${RANGE_SPAN[range]}`
  );

  const changePage = (page: number) => {
    goToPage(page);
    listTop.current?.scrollIntoView({ block: 'start' });
  };

  const empty = (
    <EmptyState icon="qr" title={result === 'denied' ? 'Nema odbijenih ulaza.' : 'Nema ulaza.'}>
      {range === 'today' ? 'Ulazi se pojavljuju ovdje čim član skenira kod na vratima.' : `Nema ulaza ${period}.`}
    </EmptyState>
  );

  return (
    <div className={styles.screen} aria-busy={view.status === 'loading'}>
      <PageHeader title="Ulazi" subtitle={subtitle} />
      <ScopeRangeControls
        scope={{ gyms: catalog.gyms, value: scope, onChange: selectScope }}
        range={range}
        onRange={selectRange}
      />

      {view.status === 'error' && <LoadError title="Ulazi se nisu učitali" onRetry={retryEntries} />}

      {view.status === 'loading' && <SummarySkeleton />}
      {ready && <EntriesSummary data={ready.page} range={range} compact={phone} />}

      {view.status !== 'error' && (
        <div ref={listTop} className={styles.toolbar}>
          <ResultChips value={result} counts={ready?.page.counts} />
          {!phone && <ExportButton variant="button" fileName="ulazi.csv" onExport={exportEntriesCsv} />}
        </div>
      )}

      {phone ? (
        <>
          {view.status === 'loading' && <ListSkeleton variant="cards" />}
          {ready && ready.items.length === 0 && <div className={styles.emptyCard}>{empty}</div>}
          {ready && ready.items.length > 0 && (
            <>
              <EntriesFeed entries={ready.items} now={ready.page.asOf} catalog={catalog} />
              {(ready.items.length < ready.page.total || ready.loadMoreFailed) && (
                <button
                  type="button"
                  className={styles.more}
                  disabled={ready.loadingMore}
                  onClick={() => loadOlder(ready.page.page + 1)}
                >
                  {ready.loadingMore ? 'Učitavam…' : ready.loadMoreFailed ? 'Pokušaj ponovno' : 'Učitaj starije'}
                </button>
              )}
            </>
          )}
        </>
      ) : (
        view.status !== 'error' && (
          <EntriesTable
            entries={ready?.items ?? []}
            now={ready?.page.asOf ?? ''}
            catalog={catalog}
            compact={viewport === 'tablet'}
          >
            {view.status === 'loading' && <ListSkeleton variant="table" />}
            {ready && ready.items.length === 0 && empty}
            {ready && ready.items.length > 0 && (
              <Pager
                label="Stranice dnevnika ulaza"
                summary={`Prikazano ${shownRange(ready.page.page, ready.page.pageSize, ready.items.length)} od ${formatInteger(ready.page.total)} ulaza ${period}`}
                page={ready.page.page}
                pageSize={ready.page.pageSize}
                total={ready.page.total}
                onPage={changePage}
              />
            )}
          </EntriesTable>
        )
      )}
    </div>
  );
}
