import { createBrowserRouter } from 'react-router';
import { GymIndexRedirect, GymScreen } from '../features/gyms/screens/gym-screen';
import { EntriesScreen } from '../features/entries/screens/entries-screen';
import { MemberDetailScreen } from '../features/members/screens/member-detail-screen';
import { MembersScreen } from '../features/members/screens/members-screen';
import { OverviewScreen } from '../features/overview/screens/overview-screen';
import { ENTRIES_HREF, GYMS_NAV, MEMBERS_HREF } from '../shared/layout/navigation';
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
      { path: '*', element: <ComingSoonScreen /> },
    ],
  },
]);
