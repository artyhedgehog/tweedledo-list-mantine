import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ListPage } from './pages/List.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/groceries" replace />,
  },
  {
    path: '/groceries',
    element: <ListPage list="groceries" />,
  },
  {
    path: '/pharmacy',
    element: <ListPage list="pharmacy" />,
  },
  {
    path: '/misc',
    element: <ListPage list="misc" />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
