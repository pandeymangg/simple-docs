import axios from "axios"
import { useContext } from "react"
import { Redirect } from "react-router"
import AuthContext from "../context/AuthContext"
import './Permission.css'

const Permission = (props) => {

    const { loggedIn } = useContext(AuthContext)

    //const [state, setState] = useState(props.location.state || "false")

    async function handleClick() {
        const docId = props.location.state.docId

        // const result = await axios.post(`/api/users/${owner}/notifications/requestAccess`, {
        //     docId,
        //     senderId: currentUser._id
        // })

        await axios.post(`/api/users/notifications/requestAccess`, {
            docId,
            //senderId: currentUser._id
        })

        //console.log(result.data)

    }

    return (

        <div className="main" >

            {
                !loggedIn
                ? <Redirect to='/login' />
                : null
            }

            {
                props.location.state
                    ? (
                        <div className="permission-container" >

                            <div className="err-div" >
                                <h1>401</h1>
                            </div>

                            <div className="content-div">
                                <h2>{props.location.state.message}</h2>
                                <button
                                    className="send-request-btn"
                                    onClick={
                                        () => handleClick()
                                    }
                                >Send request</button>
                            </div>

                        </div>
                    )
                    : <Redirect to="/" />
            }

        </div>
    )
}

export default Permission
