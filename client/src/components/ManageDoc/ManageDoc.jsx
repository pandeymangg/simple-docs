import axios from "axios"
import { useEffect, useRef, useState } from "react"

const ManageDoc = (props) => {

    const [state] = useState(props.location.state)
    const [inputTerm, setInputTerm] = useState("")
    const [title, setTitle] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [collaborators, setCollaborators] = useState([])
    const [loading, setLoading] = useState(true)

    async function getInitialStates() {
        const response = await axios.get(`/api/docs/populated/${state.id}`)

        //console.log(response.data.data.doc.name)
        //console.log(response.data.data.doc)
        //const collabs = response.data.data.doc.collaborators

        setTitle(response.data.data.doc.name)
        setCollaborators(response.data.data.doc.collaborators)

        //let usersArray = []
        // collabs.map(
        //     async collabId => {
        //         const response = await axios.get(
        //             `/api/users/getUser/${collabId}`
        //         )
        //         //console.log(response.data.username)
        //         //usersArray.push({ id: collabId, username: response.data.username })
        //         setCollaborators(
        //             (prevState) => {
        //                 return [...prevState, { id: collabId, username: response.data.username }]
        //             }
        //         )

        //     }
        // )

        setLoading(false)
    }

    useEffect(() => {
        getInitialStates()
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

    const removeCollab = (collaborator) => {
        async function removeInner() {

            try {
                //console.log(collaborator)
                const response = await axios.patch(
                    `/api/docs/${state.id}/removeCollaborator`,
                    { collabId: collaborator._id }
                )
                
                //console.log(response.data)
                if(response.data.status === "success") {
                    setCollaborators(
                        (prevState) => {
                            return prevState.filter(ele => ele._id !== collaborator._id)
                        }
                    )
                }

            } catch (err) {
                console.log(err)
            }

        }

        removeInner()

    }

    return (

        <>
            {
                loading === true ? <div className="medium progress"><div>Loading…</div></div>
                    : (
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

                            <div>
                                {
                                    collaborators.map(
                                        (collaborator, index) => {
                                            return (
                                                <div key={index} >
                                                    {collaborator.username}
                                                    <button
                                                        onClick={
                                                            () => {
                                                                removeCollab(collaborator)
                                                            }
                                                        }
                                                    >Remove</button>
                                                </div>
                                            )
                                        }
                                    )
                                }
                            </div>

                        </div>
                    )
            }
        </>

    )
}

export default ManageDoc
