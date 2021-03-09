import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
    return (
        <header>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li> <Link to="/login" >Log In</Link> </li>
                    <li> <Link to="/signup" >Sign Up</Link> </li>
                </ul>
            </nav>
        </header>
    )
}

export default HomePage
