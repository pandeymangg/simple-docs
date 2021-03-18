import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import LogoutButton from './LogoutButton'
import './Navbar.css'

const Navbar = () => {
    const { loggedIn, currentUser } = useContext(AuthContext)

    let username

    if (currentUser) {
        username = <li>{currentUser.username}</li>
    }

    return (
        <header>
            <div className="navbar" >
                <div className="container flex" >

                    {
                        loggedIn ?
                            <h1 className="main-heading"><span style={{ color: '#623C3D' }} >simple</span><span style={{ color: '#6B645C' }} >Docs</span></h1>
                            : null
                    }


                    <nav>

                        <ul>

                            {
                                loggedIn === false && <li> <Link to="/">Home</Link> </li>
                            }

                            {
                                loggedIn === true ? null
                                    : <li> <Link to="/login" >Log In</Link> </li>
                            }

                            {
                                loggedIn ?
                                    <Link to="/dashboard" >{username}</Link>
                                    : null
                            }

                            {
                                loggedIn === true ? <li><Link to="/notifications">Notifications</Link></li> : null
                            }

                            {
                                loggedIn === true ? <LogoutButton /> : null
                            }


                        </ul>
                    </nav>
                </div>
            </div>
        </header>

    )
}

export default Navbar
