import styles from './toggle.module.css';

interface ToggleProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ checked, label, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      className={styles.toggle}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    />
  );
}
