import { OverviewScreen } from '../features/overview/screens/overview-screen';
import { AppShell } from '../shared/layout/app-shell';

export function App() {
  return (
    <AppShell currentHref="/">
      <OverviewScreen />
    </AppShell>
  );
}
