import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import io from 'socket.io-client'
import { useHistory } from 'react-router-dom'
const socket = io()

toast.configure()

const AuthContext = createContext()

const ToastNotification = ({ notification, onClick }) => {
    return (
        <div
            onClick={onClick}
        >
            <span>{ notification }</span>
        </div>
    )
}

const AuthContextProvider = (props) => {

    const [loggedIn, setLoggedIn] = useState(undefined)
    const [currentUser, setCurrentUser] = useState(undefined)

    const history = useHistory()

    const onClickHandler = () => {
        history.push({
            pathname: "/notifications"
        })
    }

    const socketFunc = (data) => {
        if (currentUser._id === data.notification.reciever && loggedIn === true) {
            const notification = data.notification.notification

            toast.dark(<ToastNotification notification={notification} onClick={onClickHandler} />, {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            })
        }
    }

    const socketTest = () => {

        //console.log("loggedIn")
        socket.on('notification-received', socketFunc)

    }

    useEffect(() => {

        if(loggedIn === true && currentUser) {
            socketTest()
        }

        // return () => {
        //     if(loggedIn === true) {
        //         socket.off('notification-received', socketFunc)
        //     }
        // }

    })

    async function getLoggedInState() {
        const response = await axios.get('/api/users/isLoggedIn', { withCredentials: true })
        setLoggedIn(response.data.loggedIn)
        setCurrentUser(response.data.user)

    }

    useEffect(() => {
        getLoggedInState()

    }, [])

    const contextValue = {
        loggedIn,
        currentUser,
        getLoggedInState
    }

    return (
        <AuthContext.Provider value={contextValue} >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext

export {
    AuthContextProvider
}
