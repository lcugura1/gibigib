import type { CatalogDto, MembershipStatus } from '@gibigib/types';
import { Chip } from '../../../shared/components/chip';
import { FilterSelect } from '../../../shared/components/filter-select';
import { setFilters, clearFilters, type MemberFilters } from '../services/members-state';
import { STATUS_OPTIONS } from '../status';
import styles from './members-filters.module.css';

interface MembersFiltersProps {
  filters: MemberFilters;
  catalog: CatalogDto;
  inactiveCount: number | undefined;
  canClear: boolean;
  className?: string;
}

export function MembersFilters({ filters, catalog, inactiveCount, canClear, className }: MembersFiltersProps) {
  const plans = catalog.plans.map((plan) => ({ value: plan.slug, label: plan.name }));
  const gyms = catalog.gyms.map((gym) => ({ value: gym.id, label: gym.name }));

  return (
    <div className={`${styles.filters} ${className ?? ''}`} role="group" aria-label="Filteri">
      <FilterSelect<MembershipStatus>
        label="Status"
        allLabel="Svi"
        value={filters.status}
        options={STATUS_OPTIONS}
        onChange={(status) => setFilters({ status })}
      />
      <FilterSelect
        label="Plan"
        allLabel="Svi"
        value={filters.planSlug}
        options={plans}
        onChange={(planSlug) => setFilters({ planSlug })}
      />
      <FilterSelect
        label="Teretana"
        allLabel="Sve"
        value={filters.gymId}
        options={gyms}
        onChange={(gymId) => setFilters({ gymId })}
      />
      <Chip
        className={styles.toggle}
        color="var(--warning)"
        active={filters.inactiveOnly}
        meta={inactiveCount}
        onToggle={() => setFilters({ inactiveOnly: !filters.inactiveOnly })}
      >
        Bez dolaska 14+ d
      </Chip>
      {canClear && (
        <button type="button" className={styles.clear} onClick={clearFilters}>
          Očisti filtre
        </button>
      )}
    </div>
  );
}
