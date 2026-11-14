import type { MouseEvent, ReactNode, SyntheticEvent } from 'react';
import { closeDialog, isBackdropClick, supportsLightDismiss } from '../lib/top-layer';
import styles from './dialog.module.css';

export type DialogPresentation = 'sheet' | 'popup';

interface DialogProps {
  presentation: DialogPresentation;
  labelledBy: string;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

const openOnMount = (dialog: HTMLDialogElement | null) => {
  if (dialog && !dialog.open) dialog.showModal();
};

export function dismissDialog(event: MouseEvent<HTMLElement>) {
  const dialog = event.currentTarget.closest('dialog');
  if (dialog) closeDialog(dialog);
}

export function Dialog({ presentation, labelledBy, onClose, className, children }: DialogProps) {
  const dismissOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (!supportsLightDismiss() && isBackdropClick(event.currentTarget, event)) closeDialog(event.currentTarget);
  };

  const animateCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    closeDialog(event.currentTarget);
  };

  return (
    <dialog
      ref={openOnMount}
      className={`${styles.dialog} ${styles[presentation]} ${className ?? ''}`}
      aria-labelledby={labelledBy}
      closedby="any"
      onClick={dismissOnBackdrop}
      onCancel={animateCancel}
      onClose={onClose}
    >
      <div className={styles.body}>
        {presentation === 'sheet' && <span className={styles.grabber} aria-hidden="true" />}
        {children}
      </div>
    </dialog>
  );
}
