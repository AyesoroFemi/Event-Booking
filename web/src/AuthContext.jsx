import { Navigate } from "react-router";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const token = localStorage.getItem("eventToken");
        setIsAuthenticated(!!token)
        setIsLoading(false)
    }, [])

    const login = (token) => {
        localStorage.setItem("eventToken", token)
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem("eventToken")
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)


const ProtectedRoute = ({children}) => {
    const { isAuthenticated, isLoading } = useAuth()
    if (isLoading) {
        return <div className=''>Loading...</div>
    } 
    return isAuthenticated ? children : <Navigate to="/signup"/>
}

export default ProtectedRoute;