import { Icon } from './icon';
import styles from './filter-select.module.css';

interface FilterSelectProps<T extends string> {
  label: string;
  allLabel: string;
  value: T | undefined;
  options: readonly { value: T; label: string }[];
  onChange: (value: T | undefined) => void;
  className?: string;
}

export function FilterSelect<T extends string>({
  label,
  allLabel,
  value,
  options,
  onChange,
  className,
}: FilterSelectProps<T>) {
  const current = options.find((option) => option.value === value);

  return (
    <label className={`${styles.chip} ${current ? styles.active : ''} ${className ?? ''}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{current?.label ?? allLabel}</span>
      <Icon name="chevronDown" className={styles.chevron} />
      <select
        className={styles.select}
        aria-label={label}
        value={value ?? ''}
        onChange={(event) => onChange((event.target.value || undefined) as T | undefined)}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
