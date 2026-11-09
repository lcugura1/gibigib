import { Outlet, ScrollRestoration } from 'react-router';
import { navStatus$ } from '../shared/live/live-status';
import { AppShell } from '../shared/layout/app-shell';
import type { NavStatus } from '../shared/layout/navigation';
import { useObservable } from '../shared/lib/use-observable';

const NO_STATUS: NavStatus = { gymCount: 0, offlineDevices: 0 };

export function AppLayout() {
  const navStatus = useObservable(navStatus$, NO_STATUS);

  return (
    <AppShell navStatus={navStatus}>
      <Outlet />
      <ScrollRestoration />
    </AppShell>
  );
}
