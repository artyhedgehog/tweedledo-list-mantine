import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { DataPage } from './pages/Data.page';
import { ListPage } from './pages/List.page';
import { path, useLists } from './utils/lists';

export function Router() {
  const { lists } = useLists();

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

  return <RouterProvider router={router} />;
}
