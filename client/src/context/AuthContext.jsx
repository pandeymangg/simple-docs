import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

const AuthContext = createContext()

const AuthContextProvider = (props) => {

    const [loggedIn, setLoggedIn] = useState(undefined)
    const [currentUser, setCurrentUser] = useState(undefined)

    async function getLoggedInState() {
        const response = await axios.get('/api/users/isLoggedIn', {withCredentials: true})
        setLoggedIn(response.data.loggedIn)
        setCurrentUser(response.data.user)
    }

    useEffect(() => {
        getLoggedInState()
    }, [])

    const contextValue = {
        loggedIn,
        currentUser,
        getLoggedInState
    }

    return (
        <AuthContext.Provider value={ contextValue } >
            { props.children }
        </AuthContext.Provider>
    )
}

export default AuthContext

export {
    AuthContextProvider
}
