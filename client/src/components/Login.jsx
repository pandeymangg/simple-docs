import React, { useContext, useState } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { Redirect, useHistory } from 'react-router'

const Signup = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loggedIn, getLoggedInState } = useContext(AuthContext)

    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const loginData = {
            email,
            password,
        }

        await axios.post("/api/users/login", loginData)

        getLoggedInState()
        history.push("/")

    }

    return (
        <div>

            {
                loggedIn ? <Redirect to="/dashboard" /> : null  
            }

            <form onSubmit={ (e) => handleSubmit(e) } >

                <input type="email" placeholder="enter email"
                    value={ email }
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input type="password" placeholder="enter password"
                    value={ password }
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                >
                    Log In
                </button>
            </form>
        </div>
    )
}


export default Signup
