import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Homepage from './components/Homepage/Homepage'
import SpotDetailsPage from './components/SpotDetailsPage/SpotDetailsPage'
import CreateSpotPage from './components/CreateSpotPage/CreateSpotPage';
import PageNotFound from './components/PageNotFound/PageNotFound';
import * as sessionActions from './store/session';
import './index.css';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Homepage />
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetailsPage />,
      },
      {
        path: '/spots/new',
        element: <CreateSpotPage />
      },
      {
        path: '*',
        element: <PageNotFound />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
