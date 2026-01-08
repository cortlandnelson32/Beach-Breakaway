import { useState, useEffect, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import * as sessionActions from './store/session';
import './index.css';

// Lazy load route components for better initial load performance
const Homepage = lazy(() => import('./components/Homepage/Homepage'));
const SpotDetailsPage = lazy(() => import('./components/SpotDetailsPage/SpotDetailsPage'));
const CreateSpotPage = lazy(() => import('./components/CreateSpotPage/CreateSpotPage'));
const ManageSpots = lazy(() => import('./components/ManageSpots/ManageSpots'));
const UpdateSpot = lazy(() => import('./components/UpdateSpot/UpdateSpot'));
const PageNotFound = lazy(() => import('./components/PageNotFound/PageNotFound'));

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      fontSize: '18px',
      color: '#3E4D76'
    }}>
      <div>Loading...</div>
    </div>
  );
}

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true))
      .catch(() => setIsLoaded(true)); // Still set loaded on error
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded ? (
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      ) : (
        <LoadingSpinner />
      )}
      <Footer />
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
        path: '/spots/:spotId',
        element: <SpotDetailsPage />
      },
      {
        path: '/spots/new',
        element: <CreateSpotPage />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpot />
      },
      {
        path: '/404',
        element: <PageNotFound />
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
