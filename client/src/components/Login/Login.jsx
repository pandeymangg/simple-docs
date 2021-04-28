import React, { useContext, useState } from 'react'
import axios from 'axios'
import AuthContext from '../../context/AuthContext'
import { Redirect, useHistory } from 'react-router'
import './Login.css'

const Signup = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    //const [errorStatus, setErrorStatus] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const { loggedIn, getLoggedInState } = useContext(AuthContext)

    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const loginData = {
            email,
            password,
        }

        try {
            await axios.post("/api/users/login", loginData)

            getLoggedInState()
            history.push("/dashboard")
        } catch (err) {
            //console.log(err.response.data)
            if (err.response.data.status === "fail") {
                setErrorMessage(err.response.data.message)
                //setErrorStatus(err.response.data.status)
            }
        }

    }

    return (
        <div className="center" >


            <h1>Login</h1>

            {
                loggedIn ? <Redirect to="/dashboard" /> : null
            }

            {
                errorMessage
                    ? <div className="error-box" > <p className="error-text" > { errorMessage } </p> </div>
                    : null
            }

            <form className="login-form" onSubmit={(e) => handleSubmit(e)} >

                <div className="text-field" >
                    <input type="email" placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <span></span>
                    {/* <label>Email</label> */}
                </div>

                <div className="text-field" >
                    <input type="password" placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span></span>
                    {/* <label>Password</label> */}
                </div>

                <div className="pass">
                    <p className="pass-text" >Forgot Password?</p>
                </div>

                <button
                    type="submit"
                    className="login-button"
                >
                    Log In
                </button>

                {/* <div className="signup--link">
                    Not a member? Sign Up
                </div> */}

            </form>

        </div>
    )
}


export default Signup
