import { createBrowserRouter, RouterProvider } from 'react-router'

import './App.css'
import RootLayout from './pages/RootLayout';
import Home from './pages/Home';
import Signup from './pages/Signup';
import SingleEvent from './pages/SingleEvent';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './AuthContext';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';

const originalConsoleInfo = console.info;
console.info = (...args) => {
  if (args[0]?.includes("tracking/RPC")) {
    return; // Suppress the specific log
  }
  originalConsoleInfo(...args); // Allow other logs
};

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
        },
        {
          path: "/event/:id",
          element: <ProtectedRoute>
            <EditEvent />
          </ProtectedRoute>,
        },
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
