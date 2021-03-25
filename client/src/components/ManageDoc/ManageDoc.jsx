import axios from "axios"
import { useEffect, useRef, useState } from "react"

const ManageDoc = (props) => {

    const [state] = useState(props.location.state)
    const [inputTerm, setInputTerm] = useState("")
    const [title, setTitle] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [collaborators, setCollaborators] = useState([])

    const getCollaborators = async function (collabs) {
        if (collabs) {
            collabs.map(async collab => {
                //console.log(collab)
                const response = await axios.get(`/api/users/getUser/${collab}`)
                //console.log(response.data.username)
                //console.log(response)
                setCollaborators(
                    (prevState) => {
                        return [...prevState, { id: collab, username: response.data.username }]
                    }
                )
            })
        } else {
            setCollaborators([])
        }
    }

    useEffect(() => {
        async function getDoc() {
            const response = await axios.get(`/api/docs/${state.id}`)

            //console.log(response.data.data.doc.name)
            setTitle(response.data.data.doc.name)
            const collabs = response.data.data.doc.collaborators
            getCollaborators(collabs)
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
                setErrorMessage("")
            } catch (err) {
                console.log(err.response)
                setErrorMessage(err.response.data.message)
            }
        }

        updateName()
    }

    const removeCollaborator = (collaborator) => {
        async function remove() {
            //console.log(collaborator)
            const response = await axios.patch(`/api/docs/${state.id}/removeCollaborator`, {
                collabId: collaborator.id
            })
            //console.log(response.data)

            setCollaborators(response.data.doc.collaborators)

        }

        remove()
    }


    return (
        <div className="container" >
            <h2>{title}</h2>

            {
                errorMessage
                    ? (<div>
                        {errorMessage}
                    </div>)
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

            {
                collaborators
                    ? (
                        <div>
                            {
                                collaborators.map((collaborator, index) => {
                                    return (
                                        <div key={index} >
                                            {collaborator.username}
                                            <button
                                                onClick={
                                                    () => removeCollaborator(collaborator)
                                                }
                                            >Remove</button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                    : null
            }

        </div>
    )
}

export default ManageDoc
