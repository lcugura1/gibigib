import type { AuditActorKind, AuditKind, CatalogDto } from '@gibigib/types';
import { FilterSelect } from '../../../shared/components/filter-select';
import { AUDIT_ACTOR_LABEL, AUDIT_KIND_LABEL } from '../audit-format';
import { setFilters, type AuditFilters as Filters } from '../services/audit-state';
import styles from './audit-filters.module.css';

const options = <T extends string>(labels: Record<T, string>) =>
  (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));

const KIND_OPTIONS = options<AuditKind>(AUDIT_KIND_LABEL);
const ACTOR_OPTIONS = options<AuditActorKind>(AUDIT_ACTOR_LABEL);

interface AuditFiltersProps {
  filters: Filters;
  catalog: CatalogDto;
  stacked?: boolean;
}

export function AuditFilters({ filters, catalog, stacked = false }: AuditFiltersProps) {
  return (
    <div className={stacked ? `${styles.filters} ${styles.stacked}` : styles.filters} role="group" aria-label="Filteri">
      <FilterSelect<AuditKind>
        label="Vrsta"
        allLabel="Sve"
        value={filters.kind}
        options={KIND_OPTIONS}
        onChange={(kind) => setFilters({ kind })}
      />
      <FilterSelect<AuditActorKind>
        label="Tko"
        allLabel="Svi"
        value={filters.actor}
        options={ACTOR_OPTIONS}
        onChange={(actor) => setFilters({ actor })}
      />
      <FilterSelect
        label="Teretana"
        allLabel="Sve"
        value={filters.gymId}
        options={catalog.gyms.map((gym) => ({ value: gym.id, label: gym.name }))}
        onChange={(gymId) => setFilters({ gymId })}
      />
    </div>
  );
}
