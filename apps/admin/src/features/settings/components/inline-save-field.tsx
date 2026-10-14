import { useState, type ComponentPropsWithoutRef, type SubmitEvent } from 'react';
import { Button } from '../../../shared/components/button';
import { TextField } from '../../../shared/components/text-field';
import styles from './inline-save-field.module.css';

interface InlineSaveFieldProps extends Pick<ComponentPropsWithoutRef<'input'>, 'type' | 'inputMode' | 'autoComplete'> {
  label: string;
  initial: string;
  hint?: string;
  validate: (value: string) => string | undefined;
  onSave: (value: string) => Promise<void>;
}

export function InlineSaveField({ label, initial, hint, validate, onSave, ...input }: InlineSaveFieldProps) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string>();
  const [state, setState] = useState<'idle' | 'busy' | 'saved'>('idle');
  const dirty = value.trim() !== initial;

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = validate(value.trim());
    setError(problem);
    if (problem) return;
    setState('busy');
    try {
      await onSave(value.trim());
      setState('saved');
    } catch {
      setError('Spremanje nije uspjelo. Pokušaj ponovno.');
      setState('idle');
    }
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <TextField
        label={label}
        value={value}
        error={error}
        hint={state === 'saved' && !dirty ? 'Spremljeno.' : hint}
        onChange={(event) => {
          setValue(event.target.value);
          setError(undefined);
          setState('idle');
        }}
        {...input}
      />
      {dirty && (
        <div className={styles.actions}>
          <Button variant="text" size="small" onClick={() => setValue(initial)}>
            Odustani
          </Button>
          <Button type="submit" size="small" disabled={state === 'busy'}>
            Spremi
          </Button>
        </div>
      )}
    </form>
  );
}
