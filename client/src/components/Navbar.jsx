import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Navbar = () => {
    const { loggedIn, currentUser } = useContext(AuthContext)

    let isLoggedIn = loggedIn
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
                        isLoggedIn === true ? <li> <Link to="/login" >Log Out</Link> </li>
                        : <li> <Link to="/login" >Log In</Link> </li>
                    }
                    
                    {
                        isLoggedIn ? 
                        <Link to="/dashboard" >{ username }</Link>
                        : null
                    }
                </ul>
            </nav>
        </header>
    )
}

export default Navbar
