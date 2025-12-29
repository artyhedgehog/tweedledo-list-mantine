import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { DataPage } from './pages/Data.page';
import { ListPage } from './pages/List.page';
import { lists, path } from './utils/lists';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={path(lists[0])} replace />,
  },
  ...lists.map((list) => {
    return {
      path: path(list),
      element: <ListPage list={list} />,
    };
  }),
  {
    path: '/data',
    element: <DataPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
