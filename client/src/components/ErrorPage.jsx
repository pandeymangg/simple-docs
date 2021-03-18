import { useState } from "react"
import './ErrorPage.css'

const ErrorPage = (props) => {

    const [state] = useState(props.location.state || "false")

    return (
        <div className="error-div--main" >

            <div className="error--div" >
                <div className="oops-div" >
                    <h1 className="gradient-text" >Oops!</h1>
                </div>
            </div>

            {
                state !== "false" && state.statusCode ? <h1>{state.statusCode} Error!</h1> : <h1>Error!</h1>
            }

            {
                state !== "false" && state.message ? <p>{state.message}</p> : null
            }

        </div>
    )
}

export default ErrorPage
