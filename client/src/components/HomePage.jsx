import React, { useContext } from 'react'
import { Redirect } from 'react-router'
import AuthContext from '../context/AuthContext'
import Navbar from './Navbar'

const HomePage = () => {

    const { loggedIn } = useContext(AuthContext)

    const homeNotLoggedIn = <div>
        <h1>Simple Docs</h1>
        <p>Web app for managing documents with a built in rich text editor!</p>
    </div>

    return (
        <>
            {/* <Navbar /> */}

            {
                loggedIn ? <Redirect to="/dashboard" /> : homeNotLoggedIn
            }

        </>

    )
}

export default HomePage
