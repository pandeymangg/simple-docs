import { useState } from "react"

const ErrorPage = (props) => {

    const [state] = useState(props.location.state)

    return (
        <div>
            <h1>Error!</h1>
            <p>{ state.message }</p>
        </div>
    )
}

export default ErrorPage
