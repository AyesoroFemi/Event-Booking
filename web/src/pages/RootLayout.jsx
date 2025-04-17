import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RootLayout() {
  return (
    <div>
        <Navbar/>
        <Outlet />
        <ToastContainer/>
    </div>
  )
}

export default RootLayout