import type { ReactNode } from 'react';
import styles from './app-shell.module.css';
import type { NavStatus } from './navigation';
import { Rail } from './rail';
import { Sidebar } from './sidebar';
import { TabBar } from './tab-bar';
import { useViewport } from './viewport';

interface AppShellProps {
  navStatus: NavStatus;
  children: ReactNode;
}

export function AppShell({ navStatus, children }: AppShellProps) {
  const viewport = useViewport();

  return (
    <div className={styles.shell} data-viewport={viewport}>
      {viewport === 'desktop' && <Sidebar />}
      {viewport === 'tablet' && <Rail />}
      <main className={styles.main}>{children}</main>
      {viewport === 'phone' && <TabBar status={navStatus} />}
    </div>
  );
}
