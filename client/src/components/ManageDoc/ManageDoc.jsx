import axios from "axios"
import { useEffect, useRef, useState } from "react"

const ManageDoc = (props) => {

    const [state, setState] = useState(props.location.state)
    const [inputTerm, setInputTerm] = useState("")
    const [title, setTitle] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        async function getDoc() {
            const response = await axios.get(`/api/docs/${state.id}`)

            //console.log(response.data.data.doc.name)
            setTitle(response.data.data.doc.name)

        }

        getDoc()
    }, [])

    const inputRef = useRef(null)

    const updateNameHandler = (inputTerm) => {
        async function updateName() {
            try {
                await axios.patch(`/api/docs/${state.id}`, {
                    name: inputTerm
                })

                //console.log(response.data)

                setTitle(inputTerm)
                setInputTerm("")
                inputRef.current.value = ""

            } catch (err) {
                console.log(err.response)
                setErrorMessage(err.response.data.message)
            }
        }

        updateName()
    }

    return (
        <div className="container" >
            <h2>{title}</h2>

            {
                errorMessage
                    ? ( <div>
                        {errorMessage}
                    </div> )
                    : null
            }

            <form
                onSubmit={
                    (e) => {
                        e.preventDefault()
                        updateNameHandler(inputTerm)
                    }
                }
            >
                <input type="text" placeholder="enter new name" ref={inputRef}
                    onChange={(e) => setInputTerm(e.target.value)}
                />
                <button type="submit" disabled={!inputTerm} >Update</button>
            </form>
        </div>
    )
}

export default ManageDoc
