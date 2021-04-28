import axios from "axios"
import { useEffect, useState, useContext } from "react"
import { Redirect } from "react-router"
import AuthContext from "../../context/AuthContext"
import './Notifications.css'
import { useHistory } from 'react-router-dom'
import io from "socket.io-client"

const socket = io()

const Notifications = () => {

    const { loggedIn } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [notificationsArray, setNotificationsArray] = useState([])
    const [btnDis, setBtnDis] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const history = useHistory()

    // const socketFunc = (data) => {
    //     if (currentUser._id === data.notification.reciever) {
    //         //setTimeout(getNotifications)
    //         getNotifications()
    //     }
    // }

    // const socketTest = () => {

    //     //console.log("loggedIn")
    //     socket.on('notification-received', socketFunc)

    // }

    // useEffect(() => {
    //     if (loggedIn === true && currentUser) {
    //         socketTest()
    //     }
    // })

    async function getNotifications() {
 
        if (loggedIn) {
            try {
                const response = await axios.get('/api/users/notifications')
                //console.log(response.data)
                setNotificationsArray(response.data.notifications)
                setLoading(false)
                //buttonRef.current.disabled = true
                //setBtnDis(true)

            } catch (err) {
                //console.log(err)
                setErrorMessage(err.response.data.message)
            }
        } else {
            history.push({
                pathname: "/login"
            })
        }

        // try {
        //     const response = await axios.get('/api/users/notifications')
        //     //console.log(response.data)
        //     setNotificationsArray(response.data.notifications)
        //     setLoading(false)
        //     //buttonRef.current.disabled = true
        //     //setBtnDis(true)

        // } catch (err) {
        //     //console.log(err)
        //     setErrorMessage(err.response.data.message)
        // }
    }

    useEffect(() => {
        getNotifications()
    }, [])

    const acceptHandler = (senderId, docId, notificationId) => {
        //console.log(senderId, docId)
        async function acceptRequest() {

            try {
                setBtnDis(true)
                const response = await axios.post(`/api/users/${docId}`, {
                    senderId: senderId
                })

                //console.log(response.data)

                if (response.data.status === "success") {
                    const response = await axios.delete(`/api/notifications/${notificationId}`)
                    if (response.data.status === "success") {
                        getNotifications()
                        setBtnDis(false)

                        socket.emit("notification-deleted-sent", { status: "success" })
                        
                    }
                }

            } catch (err) {
                //console.log(err.response.data)
                setErrorMessage(err.response.data.message)
            }


            //console.log(response.data)
        }
        acceptRequest()

    }

    const declineHandler = (notificationId) => {
        async function declineRequest() {
            const response = await axios.delete(`/api/notifications/${notificationId}`)

            if (response.data.status === "success") {
                getNotifications()
                socket.emit("notification-deleted-sent", { status: "success" })
            }

        }

        declineRequest()
    }

    return (

        <>
            {
                loading === true ? <div className="medium progress" ><div>Loading...</div></div>
                    : (
                        <div className="notifications-container" >

                            {
                                errorMessage
                                    ? <Redirect to={{ pathname: "/error", state: { message: errorMessage } }} />
                                    : null
                            }

                            {
                                !loggedIn
                                    ? <Redirect to="/login" />
                                    : null
                            }

                            <div className="heading-secondary" >
                                <h2>Your Notifications</h2>
                            </div>

                            {
                                notificationsArray
                                    ? notificationsArray.map((notification, index) => {
                                        if (notification) {
                                            return (
                                                <div key={index} className="single-notification" >

                                                    <div className="notif-div" >{notification.notification}</div>

                                                    <div>
                                                        <button
                                                            onClick={
                                                                () => {
                                                                    acceptHandler(notification.sender, notification.doc, notification._id)
                                                                }
                                                            }
                                                            className="accept-btn"
                                                            disabled={btnDis}

                                                        >Accept</button>

                                                        <button
                                                            onClick={
                                                                () => declineHandler(notification._id)
                                                            }
                                                            className="decline-btn"
                                                            disabled={btnDis}
                                                        >Decline</button>

                                                    </div>

                                                </div>
                                            )
                                        } else {
                                            return null
                                        }
                                    })
                                    : null
                            }
                        </div>
                    )
            }
        </>
    )
}

export default Notifications
