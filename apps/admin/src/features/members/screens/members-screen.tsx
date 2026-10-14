import { useRef } from 'react';
import { EmptyState } from '../../../shared/components/empty-state';
import { ExportButton } from '../../../shared/components/export-button';
import { ListSkeleton } from '../../../shared/components/list-skeleton';
import { LoadError } from '../../../shared/components/load-error';
import { Pager, shownRange } from '../../../shared/components/pager';
import { SearchField } from '../../../shared/components/search-field';
import { useCatalog } from '../../../shared/catalog/catalog';
import { memberSearch$, setMemberSearch } from '../../../shared/layout/member-search';
import { PageHeader } from '../../../shared/layout/page-header';
import { useViewport } from '../../../shared/layout/viewport';
import { formatInteger, formatMembers, formatMembersGenitive } from '../../../shared/lib/format';
import { useObservable } from '../../../shared/lib/use-observable';
import { MemberCards } from '../components/member-cards';
import { MembersFilters } from '../components/members-filters';
import { MembersTable } from '../components/members-table';
import { SortSelect } from '../components/sort-select';
import {
  clearFilters,
  exportMembersCsv,
  filters$,
  goToPage,
  hasActiveFilters,
  loadMore,
  members$,
  retryMembers,
  sort$,
  sortBy,
  type MembersView,
} from '../services/members-state';
import styles from './members-screen.module.css';

const LOADING: MembersView = { status: 'loading' };
const HOME_GYM_RULE = 'matična teretana = najviše dolazaka u 30 dana';

function subtitle(view: MembersView, phone: boolean) {
  if (view.status === 'loading') return 'Učitavam članove…';
  if (view.status === 'error') return 'Podaci nisu učitani';
  const counts = `${formatInteger(view.page.activeMembers)} aktivnih · ${formatInteger(view.page.allMembers)} ukupno`;
  return phone ? counts : `${counts} · ${HOME_GYM_RULE}`;
}

function NoResults() {
  return (
    <EmptyState
      icon="search"
      title="Nema članova za ove filtere."
      action={{ label: 'Očisti filtre', onClick: clearFilters }}
    >
      Nijedan član ne odgovara pretrazi i odabranim filterima. Promijeni filtere ili očisti pretragu.
    </EmptyState>
  );
}

export function MembersScreen() {
  const viewport = useViewport();
  const phone = viewport === 'phone';
  const view = useObservable(members$, LOADING);
  const filters = useObservable(filters$, filters$.value);
  const sort = useObservable(sort$, sort$.value);
  const search = useObservable(memberSearch$, memberSearch$.value);
  const catalog = useCatalog();
  const listTop = useRef<HTMLDivElement>(null);
  const ready = view.status === 'ready' ? view : undefined;
  const gymName = catalog.gyms.find((gym) => gym.id === filters.gymId)?.name;

  const changePage = (page: number) => {
    goToPage(page);
    listTop.current?.scrollIntoView({ block: 'start' });
  };

  const error = <LoadError title="Popis članova se nije učitao" onRetry={retryMembers} framed={phone} />;

  return (
    <div className={styles.screen} aria-busy={view.status === 'loading'}>
      <PageHeader
        title="Članovi"
        subtitle={subtitle(view, phone)}
        phoneAction={<ExportButton variant="glass" fileName="clanovi.csv" onExport={exportMembersCsv} />}
      />

      {phone && <SearchField value={search} onChange={setMemberSearch} className={styles.phoneSearch} />}

      {view.status !== 'error' && (
        <div ref={listTop} className={styles.toolbar}>
          <MembersFilters
            filters={filters}
            catalog={catalog}
            inactiveCount={ready?.page.inactiveCount}
            canClear={hasActiveFilters(filters, search)}
          />
          {!phone && <ExportButton variant="button" fileName="clanovi.csv" onExport={exportMembersCsv} />}
        </div>
      )}

      {phone ? (
        <>
          {ready && (
            <div className={styles.summary}>
              <p>
                {formatMembers(ready.page.total)}
                {gymName && ` · matična ${gymName}`}
              </p>
              <SortSelect sort={sort} />
            </div>
          )}
          {view.status === 'loading' && <ListSkeleton variant="cards" />}
          {view.status === 'error' && error}
          {ready && ready.items.length === 0 && (
            <div className={styles.emptyCard}>
              <NoResults />
            </div>
          )}
          {ready && ready.items.length > 0 && (
            <>
              <MemberCards members={ready.items} now={ready.page.asOf} />
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
        <MembersTable
          members={ready?.items ?? []}
          now={ready?.page.asOf ?? ''}
          catalog={catalog}
          sort={sort}
          onSort={(key) => sortBy(key)}
          compact={viewport === 'tablet'}
        >
          {view.status === 'loading' && <ListSkeleton variant="table" />}
          {view.status === 'error' && error}
          {ready && ready.items.length === 0 && <NoResults />}
          {ready && ready.items.length > 0 && (
            <Pager
              label="Stranice popisa članova"
              summary={`Prikazano ${shownRange(ready.page.page, ready.page.pageSize, ready.items.length)} od ${formatMembersGenitive(ready.page.total)}`}
              page={ready.page.page}
              pageSize={ready.page.pageSize}
              total={ready.page.total}
              onPage={changePage}
            />
          )}
        </MembersTable>
      )}
    </div>
  );
}
