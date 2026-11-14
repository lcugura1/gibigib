import { createBrowserRouter, redirect } from 'react-router';
import { LoginScreen } from '../features/auth/screens/login-screen';
import { GymIndexRedirect, GymScreen } from '../features/gyms/screens/gym-screen';
import { OverviewScreen } from '../features/overview/screens/overview-screen';
import {
  AUDIT_HREF,
  DEVICES_HREF,
  ENTRIES_HREF,
  EVENTS_HREF,
  GYMS_NAV,
  LOGIN_HREF,
  LOGIN_RETURN_PARAM,
  MEMBERS_HREF,
  PLANS_HREF,
  REVENUE_HREF,
  SETTINGS_HREF,
  TRAINERS_HREF,
} from '../shared/layout/navigation';
import { signedIn$ } from '../shared/mock/session';
import { AppLayout } from './app-layout';
import { NotFoundScreen } from './not-found-screen';

export const router = createBrowserRouter([
  {
    path: LOGIN_HREF,
    loader: () => (signedIn$.value ? redirect('/') : null),
    element: <LoginScreen />,
  },
  {
    loader: ({ request }) => {
      if (signedIn$.value) return null;
      const { pathname, search } = new URL(request.url);
      const back = pathname === '/' ? '' : `?${LOGIN_RETURN_PARAM}=${encodeURIComponent(pathname + search)}`;
      return redirect(`${LOGIN_HREF}${back}`);
    },
    element: <AppLayout />,
    children: [
      { index: true, element: <OverviewScreen /> },
      {
        path: MEMBERS_HREF,
        lazy: () => import('../features/members/screens/members-screen').then((m) => ({ Component: m.MembersScreen })),
      },
      {
        path: `${MEMBERS_HREF}/:memberId`,
        lazy: () =>
          import('../features/members/screens/member-detail-screen').then((m) => ({ Component: m.MemberDetailScreen })),
      },
      {
        path: ENTRIES_HREF,
        lazy: () => import('../features/entries/screens/entries-screen').then((m) => ({ Component: m.EntriesScreen })),
      },
      {
        path: REVENUE_HREF,
        lazy: () => import('../features/revenue/screens/revenue-screen').then((m) => ({ Component: m.RevenueScreen })),
      },
      { path: GYMS_NAV.href, element: <GymIndexRedirect /> },
      { path: `${GYMS_NAV.href}/:gymId`, element: <GymScreen /> },
      {
        path: PLANS_HREF,
        lazy: () => import('../features/plans/screens/plans-screen').then((m) => ({ Component: m.PlansScreen })),
      },
      {
        path: `${PLANS_HREF}/:planId`,
        lazy: () => import('../features/plans/screens/plans-screen').then((m) => ({ Component: m.PlansScreen })),
      },
      {
        path: EVENTS_HREF,
        lazy: () => import('../features/events/screens/events-screen').then((m) => ({ Component: m.EventsScreen })),
      },
      {
        path: `${EVENTS_HREF}/:eventId`,
        lazy: () => import('../features/events/screens/events-screen').then((m) => ({ Component: m.EventsScreen })),
      },
      {
        path: TRAINERS_HREF,
        lazy: () =>
          import('../features/trainers/screens/trainers-screen').then((m) => ({ Component: m.TrainersScreen })),
      },
      {
        path: `${TRAINERS_HREF}/:trainerId`,
        lazy: () =>
          import('../features/trainers/screens/trainers-screen').then((m) => ({ Component: m.TrainersScreen })),
      },
      {
        path: DEVICES_HREF,
        lazy: () => import('../features/devices/screens/devices-screen').then((m) => ({ Component: m.DevicesScreen })),
      },
      {
        path: AUDIT_HREF,
        lazy: () => import('../features/audit/screens/audit-screen').then((m) => ({ Component: m.AuditScreen })),
      },
      {
        path: SETTINGS_HREF,
        lazy: () =>
          import('../features/settings/screens/settings-screen').then((m) => ({ Component: m.SettingsScreen })),
      },
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
]);
