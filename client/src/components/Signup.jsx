import React, { useState } from 'react'
import axios from 'axios'

const Signup = () => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        const signupData = {
            username,
            email,
            password,
            passwordConfirm
        }

        const response = await axios.post("/api/users/signup", signupData)

        console.log(response)

    }

    return (
        <div>
            <form onSubmit={ (e) => handleSubmit(e) } >
                <input type="text" placeholder="enter username"
                    value={ username }
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input type="email" placeholder="enter email"
                    value={ email }
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input type="password" placeholder="enter password"
                    value={ password }
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input type="password" placeholder="verify password"
                    value={ passwordConfirm }
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                />

                <button
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}


export default Signup
