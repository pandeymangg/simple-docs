import React, { useState } from 'react'
import axios from 'axios'

const Signup = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        const loginData = {
            email,
            password,
        }

        const response = await axios.post("/api/users/login", loginData)

        console.log(response)

    }

    return (
        <div>
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
