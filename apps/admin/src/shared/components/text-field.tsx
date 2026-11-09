import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Icon } from './icon';
import styles from './text-field.module.css';

interface FieldControl {
  id: string;
  'aria-invalid': true | undefined;
  'aria-describedby': string | undefined;
}

interface FieldFrameProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
}

function FieldFrame({
  label,
  hint,
  error,
  className,
  control,
}: FieldFrameProps & { control: (props: FieldControl) => ReactNode }) {
  const id = useId();
  const noteId = error || hint ? `${id}-note` : undefined;
  return (
    <div className={`${styles.field} ${error ? styles.invalid : ''} ${className ?? ''}`}>
      <label htmlFor={id}>{label}</label>
      {control({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': noteId })}
      {noteId && (
        <p id={noteId} className={error ? styles.error : styles.hint}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = FieldFrameProps & Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'id'>;

export function TextField({ label, hint, error, className, ...input }: TextFieldProps) {
  return (
    <FieldFrame
      label={label}
      hint={hint}
      error={error}
      className={className}
      control={(props) => <input {...props} {...input} />}
    />
  );
}

type TextAreaProps = FieldFrameProps & Omit<ComponentPropsWithoutRef<'textarea'>, 'className' | 'id'>;

export function TextArea({ label, hint, error, className, ...textarea }: TextAreaProps) {
  return (
    <FieldFrame
      label={label}
      hint={hint}
      error={error}
      className={className}
      control={(props) => <textarea {...props} {...textarea} />}
    />
  );
}

interface SelectBoxProps extends FieldFrameProps {
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}

export function SelectBox({ label, hint, error, className, value, options, onChange }: SelectBoxProps) {
  return (
    <FieldFrame
      label={label}
      hint={hint}
      error={error}
      className={className}
      control={(props) => (
        <span className={styles.select}>
          <select {...props} value={value} onChange={(event) => onChange(event.target.value)}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" />
        </span>
      )}
    />
  );
}
