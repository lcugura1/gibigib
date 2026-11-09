import { useId, useState, type KeyboardEvent } from 'react';
import { Icon } from './icon';
import styles from './tag-input.module.css';
import tagStyles from './tag.module.css';

interface TagInputProps {
  label: string;
  values: readonly string[];
  placeholder: string;
  max: number;
  maxLength: number;
  error?: string;
  onChange: (values: string[]) => void;
}

export function TagInput({ label, values, placeholder, max, maxLength, error, onChange }: TagInputProps) {
  const id = useId();
  const [draft, setDraft] = useState('');
  const full = values.length >= max;

  const commit = () => {
    const value = draft.trim().replace(/,$/, '').trim();
    setDraft('');
    if (!value || full) return;
    if (values.some((existing) => existing.toLowerCase() === value.toLowerCase())) return;
    onChange([...values, value]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commit();
    } else if (event.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={`${styles.box} ${error ? styles.invalid : ''}`}>
        {values.length > 0 && (
          <ul className={tagStyles.list} aria-label={label}>
            {values.map((value) => (
              <li key={value} className={tagStyles.tag}>
                {value}
                <button
                  type="button"
                  className={styles.remove}
                  aria-label={`Ukloni ${value}`}
                  onClick={() => onChange(values.filter((existing) => existing !== value))}
                >
                  <Icon name="close" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          id={id}
          value={draft}
          maxLength={maxLength}
          placeholder={full ? `Najviše ${max}` : placeholder}
          disabled={full}
          aria-describedby={`${id}-note`}
          aria-invalid={error ? true : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
        />
      </div>
      <p id={`${id}-note`} className={error ? styles.error : styles.hint}>
        {error ?? 'Enter ili zarez dodaje oznaku.'}
      </p>
    </div>
  );
}
