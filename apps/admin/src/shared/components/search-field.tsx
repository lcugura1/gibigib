import type { FormEvent } from 'react';
import { Icon } from './icon';
import styles from './search-field.module.css';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  className?: string;
}

export function SearchField({ value, onChange, onSubmit, className }: SearchFieldProps) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form role="search" className={`${styles.search} ${className ?? ''}`} onSubmit={submit}>
      <Icon name="search" />
      <input
        type="search"
        placeholder="Pretraži članove"
        aria-label="Pretraži članove"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </form>
  );
}
