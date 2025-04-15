import { createBrowserRouter, RouterProvider } from 'react-router'

import './App.css'
import RootLayout from './pages/RootLayout';
import Home from './pages/Home';
import Signup from './pages/Signup';
import SingleEvent from './pages/SingleEvent';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './AuthContext';
import CreateEvent from './pages/CreateEvent';

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
          path: "/signup",
          element: <Signup />
        },
        {
          path: "/dashboard",
          element: <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        },
        {
          path: "/create",
          element: <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>

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
