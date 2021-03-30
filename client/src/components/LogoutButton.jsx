import axios from "axios"
import { useContext } from "react"
import AuthContext from "../context/AuthContext"

const LogoutButton = () => {

    const { getLoggedInState } = useContext(AuthContext)

    async function logout() {
        await axios.get('/api/users/logout')
        getLoggedInState()
        window.location.reload()
    }

    return (
        <div>
            <button
                onClick={logout}
                style={{
                    padding: '10px',
                    width: "100px",
                    backgroundColor: 'teal',
                    border: 'none',
                    outline: 'none',
                    cursor: "pointer",
                    color: '#eee',
                    borderRadius: "15px",
                    fontFamily: "Cutive, serif"
                }}
            >
                Log Out
            </button>

            {/* <a
                onClick={logout}
                href="/login"
                style={{
                    padding: '10px',
                    width: "100px",
                    backgroundColor: 'teal',
                    border: 'none',
                    outline: 'none',
                    cursor: "pointer",
                    color: '#eee',
                    borderRadius: "15px",
                    fontFamily: "Cutive, serif"
                }}
            >
                Log Out
            </a> */}

        </div>
    )
}

export default LogoutButton
