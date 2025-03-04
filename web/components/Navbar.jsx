import React from 'react'
import { Link } from 'react-router'
import LogoutButton from './Logout'

function Navbar() {
    return (
        <div className='nav'>
            <Link to="/">Event-Booking</Link>
            <div>
                <Link to="/">Home</Link>
                <Link to="/signup">Signup</Link>
                <LogoutButton />
            </div>
        </div>
    )
}

export default Navbar