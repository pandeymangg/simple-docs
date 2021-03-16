import axios from "axios"
import { useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"

const Notifications = () => {

    //const { currentUser } = useContext(AuthContext)
    const [notificationsArray, setNotificationsArray] = useState([])

    const [accepted, setAccepted] = useState(false)

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
        //console.log(senderId, docId)
        async function acceptRequest() {

            try {
                const response = await axios.post(`/api/users/${docId}`, {
                    senderId: senderId
                })

                if (response.data.status === "success") {
                    setAccepted(true)
                }

            } catch (err) {
                console.log(err.message)
            }


            //console.log(response.data)
        }

        acceptRequest()
    }

    return (
        <div>

            {
                accepted ? <div> Sender added as a collaborator! </div> : null
            }

            {
                notificationsArray
                    ? notificationsArray.map((notification, index) => {
                        if (notification) {
                            return <div key={index} >
                                <div>{notification.notification}</div>
                                <button
                                    onClick={
                                        () => {
                                            acceptHandler(notification.sender, notification.doc)
                                        }
                                    }
                                >Accept</button>
                                <button>Decline</button>
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
