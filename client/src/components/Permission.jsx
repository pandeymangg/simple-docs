import axios from "axios"
import { useContext } from "react"
import AuthContext from "../context/AuthContext"

const Permission = (props) => {

    const { currentUser } = useContext(AuthContext)

    async function handleClick() {
        const docId = props.location.state.docId

        const response = await axios.get(`/api/docs/getOwner/${docId}`)
        const owner = response.data.owner

        // const result = await axios.post(`/api/users/${owner}/notifications/requestAccess`, {
        //     docId,
        //     senderId: currentUser._id
        // })

        const result = await axios.post(`/api/users/notifications/requestAccess`, {
            docId,
            //senderId: currentUser._id
        })

        console.log(result.data)

    }

    return (
        <div>

            <p>{props.location.state.message}</p>


            <button
                onClick={
                    () => handleClick()
                }
            >Send request</button>

        </div>
    )
}

export default Permission
