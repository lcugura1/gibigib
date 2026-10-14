import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { SectionLabel } from './section-label';
import styles from './editor-panel.module.css';

export const editorStyles = styles;

interface EditorPanelProps {
  label: string;
  title?: string;
  aside?: ReactNode;
  framed?: boolean;
  children: ReactNode;
}

export function EditorPanel({ label, title, aside, framed = true, children }: EditorPanelProps) {
  return (
    <section className={framed ? `${styles.panel} ${styles.framed}` : styles.panel} aria-labelledby="editor-heading">
      <div className={styles.head}>
        <div>
          <SectionLabel id="editor-heading">{label}</SectionLabel>
          {title && <h2 className={styles.title}>{title}</h2>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function EditorForm(props: ComponentPropsWithoutRef<'form'>) {
  return <form noValidate {...props} className={`${styles.form} ${props.className ?? ''}`} />;
}

interface SwitchRowProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function SwitchRow({ title, description, children }: SwitchRowProps) {
  return (
    <div className={styles.switchRow}>
      <div>
        <p className={styles.switchTitle}>{title}</p>
        <p className={styles.switchText}>{description}</p>
      </div>
      {children}
    </div>
  );
}

export function EditorNote({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.note}>
      <p className={styles.noteLabel}>{label}</p>
      <p className={styles.noteText}>{children}</p>
    </div>
  );
}

interface EditorActionsProps {
  status?: ReactNode;
  children: ReactNode;
}

export function EditorActions({ status, children }: EditorActionsProps) {
  return (
    <div className={styles.footer}>
      <p className={styles.status} role="status">
        {status}
      </p>
      <div className={styles.actions}>{children}</div>
    </div>
  );
}
