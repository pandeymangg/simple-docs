import { useState } from "react"

const ErrorPage = (props) => {

    const [state] = useState(props.location.state || "false")

    return (
        <div>

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
