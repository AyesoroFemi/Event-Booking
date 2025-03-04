import { useEffect, useState } from "react"
import { Navigate } from "react-router";


export const useAuth = ()  => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)


    useEffect(() => {
        const token = localStorage.getItem("eventToken");
        setIsAuthenticated(!!token)
    }, [])

    return isAuthenticated;
}


const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem("eventToken")
    return token ? children : <Navigate to="/signup"/>
}

export default ProtectedRoute;