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

    const acceptHandler = (senderId, docId) => {
        console.log(senderId, docId)
        async function acceptRequest() {
            const response = await axios.post(`/api/users/${docId}`, {
                senderId: senderId
            })

            console.log(response.data)
        }

        acceptRequest()
    }

    return (
        <div>
            {
                notificationsArray
                    ? notificationsArray.map(notification => {
                        if (notification) {
                            return <>
                                <div>{notification.type}</div>
                                <div>{notification.notification}</div>
                                <div>{notification.doc}</div>
                                <div>{notification.sender}</div>
                                <button
                                    onClick={
                                        () => {
                                            acceptHandler(notification.sender, notification.doc)
                                        }
                                    }
                                >Accept</button>
                                <button>Decline</button>
                            </>
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
