import { createBrowserRouter } from 'react-router';
import { GymIndexRedirect, GymScreen } from '../features/gyms/screens/gym-screen';
import { EntriesScreen } from '../features/entries/screens/entries-screen';
import { MemberDetailScreen } from '../features/members/screens/member-detail-screen';
import { MembersScreen } from '../features/members/screens/members-screen';
import { OverviewScreen } from '../features/overview/screens/overview-screen';
import { AuditScreen } from '../features/audit/screens/audit-screen';
import { RevenueScreen } from '../features/revenue/screens/revenue-screen';
import { PlansScreen } from '../features/plans/screens/plans-screen';
import { EventsScreen } from '../features/events/screens/events-screen';
import { TrainersScreen } from '../features/trainers/screens/trainers-screen';
import { DevicesScreen } from '../features/devices/screens/devices-screen';
import { SettingsScreen } from '../features/settings/screens/settings-screen';
import {
  AUDIT_HREF,
  DEVICES_HREF,
  ENTRIES_HREF,
  EVENTS_HREF,
  GYMS_NAV,
  MEMBERS_HREF,
  PLANS_HREF,
  REVENUE_HREF,
  SETTINGS_HREF,
  TRAINERS_HREF,
} from '../shared/layout/navigation';
import { AppLayout } from './app-layout';
import { ComingSoonScreen } from './coming-soon-screen';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <OverviewScreen /> },
      { path: MEMBERS_HREF, element: <MembersScreen /> },
      { path: `${MEMBERS_HREF}/:memberId`, element: <MemberDetailScreen /> },
      { path: ENTRIES_HREF, element: <EntriesScreen /> },
      { path: GYMS_NAV.href, element: <GymIndexRedirect /> },
      { path: `${GYMS_NAV.href}/:gymId`, element: <GymScreen /> },
      { path: AUDIT_HREF, element: <AuditScreen /> },
      { path: REVENUE_HREF, element: <RevenueScreen /> },
      { path: PLANS_HREF, element: <PlansScreen /> },
      { path: `${PLANS_HREF}/:planId`, element: <PlansScreen /> },
      { path: EVENTS_HREF, element: <EventsScreen /> },
      { path: `${EVENTS_HREF}/:eventId`, element: <EventsScreen /> },
      { path: TRAINERS_HREF, element: <TrainersScreen /> },
      { path: `${TRAINERS_HREF}/:trainerId`, element: <TrainersScreen /> },
      { path: DEVICES_HREF, element: <DevicesScreen /> },
      { path: SETTINGS_HREF, element: <SettingsScreen /> },
      { path: '*', element: <ComingSoonScreen /> },
    ],
  },
]);
