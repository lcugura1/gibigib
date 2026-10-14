import type { EntriesPageDto, EntryResultFilter } from '@gibigib/types';
import { Chip } from '../../../shared/components/chip';
import { formatInteger } from '../../../shared/lib/format';
import { selectResult } from '../services/entries-state';
import styles from './result-chips.module.css';

const OPTIONS: readonly { value: EntryResultFilter; label: string; color: string }[] = [
  { value: 'all', label: 'Svi', color: 'var(--text-secondary)' },
  { value: 'approved', label: 'Odobreni', color: 'var(--accent)' },
  { value: 'denied', label: 'Odbijeni', color: 'var(--danger)' },
];

interface ResultChipsProps {
  value: EntryResultFilter;
  counts: EntriesPageDto['counts'] | undefined;
}

export function ResultChips({ value, counts }: ResultChipsProps) {
  return (
    <div className={styles.chips} role="group" aria-label="Rezultat">
      {OPTIONS.map((option) => (
        <Chip
          key={option.value}
          className={styles.chip}
          color={option.color}
          active={option.value === value}
          meta={counts ? formatInteger(counts[option.value]) : undefined}
          onToggle={() => selectResult(option.value)}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );
}
