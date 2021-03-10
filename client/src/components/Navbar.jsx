import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import LogoutButton from './LogoutButton'

const Navbar = () => {
    const { loggedIn, currentUser } = useContext(AuthContext)

    let username
    
    if (currentUser) {
        username = <li>{currentUser.username}</li>
    }

    return (
        <header>
            <nav>
                <ul>
                    <li> <Link to="/">Home</Link> </li>

                    {
                        loggedIn === true ? null
                        : <li> <Link to="/login" >Log In</Link> </li>
                    }
                    
                    {
                        loggedIn ? 
                        <Link to="/dashboard" >{ username }</Link>
                        : null
                    }

                    {
                        loggedIn === true ? <LogoutButton /> : null
                    }

                </ul>
            </nav>
        </header>
    )
}

export default Navbar
