import { createBrowserRouter } from 'react-router';
import { OverviewScreen } from '../features/overview/screens/overview-screen';
import { AppLayout } from './app-layout';
import { ComingSoonScreen } from './coming-soon-screen';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <OverviewScreen /> },
      { path: '*', element: <ComingSoonScreen /> },
    ],
  },
]);
