import type { ReactNode } from 'react';
import styles from './app-shell.module.css';
import { Sidebar } from './sidebar';

interface AppShellProps {
  currentHref: string;
  children: ReactNode;
}

export function AppShell({ currentHref, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <Sidebar currentHref={currentHref} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
