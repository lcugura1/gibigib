import { useState, type MouseEvent, type ReactNode } from 'react';
import { closeDialog } from '../lib/top-layer';
import { dismissDialog } from './dialog';
import { Icon, type IconName } from './icon';
import styles from './popup.module.css';

const CONFIRM_CLASS = { primary: styles.confirm, danger: styles.confirmDanger, accent: styles.confirmAccent };

interface PopupProps {
  titleId: string;
  title: string;
  description: ReactNode;
  icon: IconName;
  tone: 'accent' | 'danger' | 'muted';
  confirm: {
    label: string;
    busyLabel: string;
    errorMessage: string;
    onConfirm: () => Promise<unknown>;
    tone?: 'primary' | 'danger' | 'accent';
    disabled?: boolean;
  };
  dismissLabel?: string;
  children?: ReactNode;
}

export function Popup({
  titleId,
  title,
  description,
  icon,
  tone,
  confirm,
  dismissLabel = 'Odustani',
  children,
}: PopupProps) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const run = async (event: MouseEvent<HTMLButtonElement>) => {
    const dialog = event.currentTarget.closest('dialog');
    setBusy(true);
    setFailed(false);
    try {
      await confirm.onConfirm();
      if (dialog) closeDialog(dialog);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  };

  return (
    <>
      <span className={`${styles.badge} ${styles[tone]}`} aria-hidden="true">
        <Icon name={icon} />
      </span>
      <div>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <p className={styles.description}>{description}</p>
      </div>
      {children}
      {failed && (
        <p className={styles.error} role="alert">
          {confirm.errorMessage}
        </p>
      )}
      <div className={styles.actions}>
        <button
          type="button"
          className={CONFIRM_CLASS[confirm.tone ?? 'primary']}
          disabled={confirm.disabled || busy}
          onClick={run}
        >
          {busy ? confirm.busyLabel : confirm.label}
        </button>
        <button type="button" className={styles.dismiss} onClick={dismissDialog}>
          {dismissLabel}
        </button>
      </div>
    </>
  );
}

interface HighlightProps {
  label: string;
  value: string;
  note?: ReactNode;
}

export function Highlight({ label, value, note }: HighlightProps) {
  return (
    <div className={styles.highlight}>
      <p className={styles.highlightLabel}>{label}</p>
      <p className={styles.highlightValue}>{value}</p>
      {note && <p className={styles.highlightNote}>{note}</p>}
    </div>
  );
}
