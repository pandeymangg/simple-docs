import axios from "axios"
import { useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"

const Notifications = () => {

    //const { currentUser } = useContext(AuthContext)
    const [notificationsArray, setNotificationsArray] = useState([])

    async function getNotifications() {
        try {
            const response = await axios.get('/api/users/notifications')
            console.log(response.data)

            setNotificationsArray(response.data.notifications)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getNotifications()
    }, [])

    const acceptHandler = (senderId, docId, notificationId) => {
        //console.log(senderId, docId)
        async function acceptRequest() {

            try {
                const response = await axios.post(`/api/users/${docId}`, {
                    senderId: senderId
                })

                console.log(response.data)

                if (response.data.status === "success") {
                    const response = await axios.delete(`/api/notifications/${notificationId}`)
                    if(response.data.status === "success") {
                        getNotifications()
                    }
                }

            } catch (err) {
                console.log(err.message)
            }


            //console.log(response.data)
        }

        acceptRequest()

    }

    const declineHandler = (notificationId) => {
        async function declineRequest() {
            const response = await axios.delete(`/api/notifications/${notificationId}`)

            if(response.data.status === "success") {
                getNotifications()
            }

        }

        declineRequest()
    }

    return (
        <div>

            {
                notificationsArray
                    ? notificationsArray.map((notification, index) => {
                        if (notification) {
                            return <div key={index} >
                                <div>{notification.notification}</div>
                                <button
                                    onClick={
                                        () => {
                                            acceptHandler(notification.sender, notification.doc, notification._id)
                                        }
                                    }
                                >Accept</button>

                                <button
                                    onClick={
                                        () => declineHandler(notification._id)
                                    }
                                >Decline</button>
                            </div>
                        } else {
                            return null
                        }
                    })
                    : null
            }
        </div>
    )
}

export default Notifications
