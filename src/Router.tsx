import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ListPage } from './pages/List.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ListPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
