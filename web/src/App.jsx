import { createBrowserRouter, RouterProvider } from 'react-router'

import './App.css'
import RootLayout from './pages/RootLayout';
import Home from './pages/Home';
import Signup from './pages/Signup';
import SingleEvent from './pages/SingleEvent';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './AuthHook';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: ":id",
          element: <SingleEvent />,
        },
        {
          path: "/dashboard",
          element: <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        },
        {
          path: "/signup",
          element: <Signup />
        }
      ],
    },
    // {
    //   path: "*",
    //   element: <NotFound />,
    // },
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
