import { useState } from "react"
import './ErrorPage.css'

const ErrorPage = (props) => {

    const [state] = useState(props.location.state || "false")

    let errorMessage = null;
    if(state.message) {
        if(state.message === "Cannot read property 'owner' of null") {
            errorMessage = "The owner has most likely deleted this document!"
        }
        if(state.message === "you are already a collaborator!") {
            errorMessage = "The user requesting access is already an owner!"
        }
        else {
            errorMessage = state.message
        }
    }

    return (
        <div className="error-div--main" >

            <div className="error--div" >
                <div className="oops-div" >
                    <h1 className="gradient-text" >Oops!</h1>
                </div>
            </div>

            <div className="error">

                {
                    state !== "false" && state.statusCode
                        ? <div> <h1 className="error-code" > {state.statusCode} Error! </h1> </div>
                        : <div><h1 className="error-code" >Error!</h1></div>
                }

                {
                    state !== "false" && state.message
                    ? <div> <h2 className="error-message" > { errorMessage } </h2> </div>
                    : null
                }

            </div>


        </div>
    )
}

export default ErrorPage
