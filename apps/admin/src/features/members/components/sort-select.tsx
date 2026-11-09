import type { MemberSortKey } from '@gibigib/types';
import { Icon } from '../../../shared/components/icon';
import { sortBy, type MemberSort } from '../services/members-state';
import styles from './sort-select.module.css';

const SORT_LABEL: Record<MemberSortKey, string> = {
  name: 'Ime',
  lastVisit: 'Zadnji dolazak',
  expiresAt: 'Ističe',
  visits30d: 'Dolasci (30 d)',
  status: 'Status',
  plan: 'Plan',
  homeGym: 'Matična teretana',
};

interface SortSelectProps {
  sort: MemberSort;
}

export function SortSelect({ sort }: SortSelectProps) {
  return (
    <label className={styles.sort}>
      <span>{SORT_LABEL[sort.key]}</span>
      <Icon name="sort" />
      <select
        aria-label="Poredaj po"
        value={sort.key}
        onChange={(event) => sortBy(event.target.value as MemberSortKey)}
      >
        {(Object.keys(SORT_LABEL) as MemberSortKey[]).map((key) => (
          <option key={key} value={key}>
            {SORT_LABEL[key]}
          </option>
        ))}
      </select>
    </label>
  );
}
