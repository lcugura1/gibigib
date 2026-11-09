import type { CSSProperties } from 'react';
import { Icon } from './icon';
import styles from './select-field.module.css';

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  dotColor?: string;
}

export function SelectField<T extends string>({ label, value, options, onChange, dotColor }: SelectFieldProps<T>) {
  return (
    <label className={styles.select}>
      <span className={styles.label}>{label}</span>
      {dotColor && <span className={styles.dot} style={{ '--tag': dotColor } as CSSProperties} aria-hidden="true" />}
      <select value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" className={styles.chevron} />
    </label>
  );
}
