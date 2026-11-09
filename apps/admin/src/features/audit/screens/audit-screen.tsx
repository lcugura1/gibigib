import { useId, useRef, useState } from 'react';
import { useCatalog } from '../../../shared/catalog/catalog';
import { Button } from '../../../shared/components/button';
import { Dialog, dismissDialog } from '../../../shared/components/dialog';
import { EmptyState } from '../../../shared/components/empty-state';
import { ExportButton } from '../../../shared/components/export-button';
import glassStyles from '../../../shared/components/glass.module.css';
import { Icon } from '../../../shared/components/icon';
import { ListSkeleton } from '../../../shared/components/list-skeleton';
import { LoadError } from '../../../shared/components/load-error';
import { Pager, shownRange } from '../../../shared/components/pager';
import { SegmentedControl } from '../../../shared/components/segmented-control';
import { RANGE_OPTIONS, RANGE_SPAN } from '../../../shared/domain/range';
import { ManagementHeader } from '../../../shared/layout/management-header';
import { useViewport } from '../../../shared/layout/viewport';
import { useObservable } from '../../../shared/lib/use-observable';
import { formatChanges, formatChangesGenitive } from '../audit-format';
import { AuditFeed } from '../components/audit-feed';
import { AuditFilters } from '../components/audit-filters';
import { AuditTable } from '../components/audit-table';
import {
  audit$,
  clearFilters,
  exportAuditCsv,
  filters$,
  goToPage,
  loadMore,
  range$,
  retryAudit,
  selectRange,
  type AuditView,
} from '../services/audit-state';
import styles from './audit-screen.module.css';

const LOADING: AuditView = { status: 'loading' };

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function AuditScreen() {
  const viewport = useViewport();
  const phone = viewport === 'phone';
  const view = useObservable(audit$, LOADING);
  const range = useObservable(range$, range$.value);
  const filters = useObservable(filters$, filters$.value);
  const catalog = useCatalog();
  const sheetTitle = useId();
  const [sheetOpen, setSheetOpen] = useState(false);
  const listTop = useRef<HTMLDivElement>(null);
  const ready = view.status === 'ready' ? view : undefined;
  const activeFilters = Object.values(filters).filter(Boolean).length;
  const period = range === 'today' ? 'danas' : `u ${RANGE_SPAN[range]}`;

  const subtitle = phone
    ? `${capitalize(RANGE_SPAN[range])}${ready ? ` · ${formatChanges(ready.page.total)}` : ''}`
    : 'Svaka promjena članarine, plana, objave i uređaja';

  const changePage = (page: number) => {
    goToPage(page);
    listTop.current?.scrollIntoView({ block: 'start' });
  };

  const empty = (
    <EmptyState
      icon="doc"
      title="Nema promjena."
      action={activeFilters > 0 ? { label: 'Očisti filtre', onClick: clearFilters } : undefined}
    >
      {activeFilters > 0
        ? `Nijedna promjena ${period} ne odgovara filterima.`
        : `Nema zabilježenih promjena ${period}.`}
    </EmptyState>
  );

  const filterButton = (
    <button
      type="button"
      className={`${glassStyles.glass} ${styles.filterButton}`}
      aria-label={activeFilters > 0 ? `Filteri (${activeFilters})` : 'Filteri'}
      aria-haspopup="dialog"
      onClick={() => setSheetOpen(true)}
    >
      <Icon name="filter" />
      {activeFilters > 0 && <span className={styles.badge}>{activeFilters}</span>}
    </button>
  );

  return (
    <div className={styles.screen} aria-busy={view.status === 'loading'}>
      <ManagementHeader title="Dnevnik promjena" subtitle={subtitle} phoneAction={filterButton} search />

      {!phone && (
        <div ref={listTop} className={styles.toolbar}>
          <AuditFilters filters={filters} catalog={catalog} />
          {activeFilters > 0 && (
            <button type="button" className={styles.clear} onClick={clearFilters}>
              Očisti filtre
            </button>
          )}
          <SegmentedControl
            className={styles.range}
            label="Razdoblje"
            options={RANGE_OPTIONS}
            value={range}
            onChange={selectRange}
            size="small"
          />
        </div>
      )}

      {view.status === 'error' && <LoadError title="Dnevnik se nije učitao" onRetry={retryAudit} />}

      {phone ? (
        <>
          {view.status === 'loading' && <ListSkeleton variant="cards" />}
          {ready && ready.items.length === 0 && <div className={styles.emptyCard}>{empty}</div>}
          {ready && ready.items.length > 0 && (
            <>
              <AuditFeed entries={ready.items} asOf={ready.page.asOf} catalog={catalog} />
              {(ready.items.length < ready.page.total || ready.loadMoreFailed) && (
                <button
                  type="button"
                  className={styles.more}
                  disabled={ready.loadingMore}
                  onClick={() => loadMore(ready.page.page + 1)}
                >
                  {ready.loadingMore ? 'Učitavam…' : ready.loadMoreFailed ? 'Pokušaj ponovno' : 'Učitaj starije'}
                </button>
              )}
            </>
          )}
        </>
      ) : (
        view.status !== 'error' && (
          <AuditTable entries={ready?.items ?? []} catalog={catalog} compact={viewport === 'tablet'}>
            {view.status === 'loading' && <ListSkeleton variant="table" />}
            {ready && ready.items.length === 0 && empty}
            {ready && ready.items.length > 0 && (
              <Pager
                label="Stranice dnevnika promjena"
                summary={`Prikazano ${shownRange(ready.page.page, ready.page.pageSize, ready.items.length)} od ${formatChangesGenitive(ready.page.total)} ${period}`}
                page={ready.page.page}
                pageSize={ready.page.pageSize}
                total={ready.page.total}
                onPage={changePage}
                actions={<ExportButton variant="button" fileName="dnevnik-promjena.csv" onExport={exportAuditCsv} />}
              />
            )}
          </AuditTable>
        )
      )}

      {sheetOpen && (
        <Dialog presentation="sheet" labelledBy={sheetTitle} onClose={() => setSheetOpen(false)}>
          <div className={styles.sheet}>
            <h2 id={sheetTitle} className={styles.sheetTitle}>
              Filteri
            </h2>
            <SegmentedControl
              label="Razdoblje"
              options={RANGE_OPTIONS}
              value={range}
              onChange={selectRange}
              size="small"
              fill
            />
            <AuditFilters filters={filters} catalog={catalog} stacked />
            <div className={styles.sheetActions}>
              {activeFilters > 0 && (
                <Button variant="text" onClick={clearFilters}>
                  Očisti filtre
                </Button>
              )}
              <Button block onClick={dismissDialog}>
                Prikaži
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
