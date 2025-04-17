import { Link, useNavigate } from 'react-router'
import LogoutButton from './Logout'
import { useAuth } from '../AuthContext'

function Navbar() {
    const { isAuthenticated, isLoading, logout } = useAuth()

    if (isLoading) {
        return <div className=''>Loading...</div>
    }

    return (
        <div className='nav container'>
            <Link to="/">Eventos</Link>
            <div>
                {!isAuthenticated && <Link to="/signup">Sign in</Link>}
                {isAuthenticated &&
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/create">Create</Link>
                        <LogoutButton logout={logout} />
                    </>
                }
            </div>
        </div>
    )
}

export default Navbar