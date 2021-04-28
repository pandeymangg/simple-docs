import React, { useContext, useState } from 'react'
import axios from 'axios'
import AuthContext from '../../context/AuthContext'
import { Redirect, useHistory } from 'react-router'
import './Signup.css'

const Signup = () => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")


    //const [errorStatus, setErrorStatus] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const { loggedIn } = useContext(AuthContext)

    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const signupData = {
            username,
            email,
            password,
            passwordConfirm
        }

        try {
            await axios.post("/api/users/signup", signupData)

            history.push({
                pathname: '/login'
            })

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


            <h1>Signup</h1>

            {
                loggedIn ? <Redirect to="/dashboard" /> : null
            }

            {
                errorMessage
                    ? <div className="error-box" > <p className="error-text" > {errorMessage} </p> </div>
                    : null
            }


            <form className="login-form" onSubmit={(e) => handleSubmit(e)} >

                <div className="text-field" >

                    <input type="text" placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <span></span>
                    {/* <label>Email</label> */}
                </div>

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

                <div className="text-field" >
                    <input type="password" placeholder="Confirm Password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    <span></span>
                    {/* <label>Password</label> */}
                </div>

                {/* <div className="pass">
                    <p className="pass-text" >Forgot Password?</p>
                </div> */}

                <button
                    type="submit"
                    className="signup-button"
                >
                    Sign Up
                </button>

                {/* <div className="signup--link">
                    Not a member? Sign Up
                </div> */}

            </form>

        </div>
    )
}


export default Signup
