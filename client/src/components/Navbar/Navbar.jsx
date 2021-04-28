import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import LogoutButton from '../LogoutButton'
import './Navbar.css'
import { io } from 'socket.io-client'

const socket = io()

const Navbar = () => {
    const { loggedIn, currentUser } = useContext(AuthContext)

    const [notificationsArrayLength, setNotificationsArrayLength] = useState([])

    const history = useHistory()

    async function getNotificationsLength() {
        try {
            const response = await axios.get('/api/users/notifications')
            setNotificationsArrayLength(response.data.notifications.length)

        } catch (err) {
            console.log(err.response)
            //setErrorMessage(err.response.data.message)
        }
    }

    let username

    if (currentUser) {
        username = <li>{currentUser.username}</li>
    }

    useEffect(() => {
        if(loggedIn === true) {
            getNotificationsLength()
        }
    })


    const socketFunc = (data) => {
        if (currentUser._id === data.notification.reciever) {
            //setTimeout(getNotifications)
            getNotificationsLength()
        }
    }

    const socketTest = () => {
        socket.on('notification-received', socketFunc)
    }

    useEffect(() => {
        if (loggedIn === true && currentUser) {
            socketTest()

            socket.on("notification-deleted-recieved", (data) => {
                if (data.status === "success") {
                    getNotificationsLength()
                }
            })

        }

    })

    return (
        <header>
            <div className="navbar" >
                <div className="container flex" >

                    {
                        loggedIn ?
                            <div  style={{ cursor: "pointer" }} onClick={ () => history.push("/dashboard") } >
                                <h1 className="main-heading"><span style={{ color: '#623C3D' }} >simple</span><span style={{ color: '#6B645C' }} >Docs</span></h1> 
                            </div>
                            : null
                    }


                    <nav>

                        <ul>

                            {
                                loggedIn === false && <li> <Link to="/">Home</Link> </li>
                            }

                            {
                                loggedIn === true ? null
                                    : <li> <Link to="/signup" >Sign Up</Link> </li>
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
                                loggedIn === true ? (
                                    <div style={
                                        { display: "flex" }
                                    } >
                                        <li>
                                            <Link to="/notifications" className="notification" >

                                                <span className="material-icons">
                                                    notifications
                                                </span>


                                                {
                                                    notificationsArrayLength > 0
                                                        ?<span className="badge">{notificationsArrayLength}</span>
                                                        : null
                                                }

                                            </Link>
                                        </li>

                                    </div>
                                ) : null
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
