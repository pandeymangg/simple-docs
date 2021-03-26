import axios from "axios"
import { useEffect, useRef, useState } from "react"
import './ManageDoc.css'
import { Redirect } from 'react-router-dom'

const ManageDoc = (props) => {

    const stateProp = props.location.state ? props.location.state.id : null
    //const [state] = useState(props.location.state)
    const [id] = useState(stateProp)
    const [inputTerm, setInputTerm] = useState("")
    const [title, setTitle] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [collaborators, setCollaborators] = useState([])
    const [loading, setLoading] = useState(true)

    async function getInitialStates() {
        const response = await axios.get(`/api/docs/populated/${id}`)

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
                await axios.patch(`/api/docs/${id}`, {
                    name: inputTerm
                })

                //console.log(response.data)

                setTitle(inputTerm)
                setInputTerm("")
                inputRef.current.value = ""
                setErrorMessage("")
            } catch (err) {
                //console.log(err.response.data)
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
                    `/api/docs/${id}/removeCollaborator`,
                    { collabId: collaborator._id }
                )

                //console.log(response.data)
                if (response.data.status === "success") {
                    setCollaborators(
                        (prevState) => {
                            return prevState.filter(ele => ele._id !== collaborator._id)
                        }
                    )
                }

            } catch (err) {
                //console.log(err)
                setErrorMessage(err.response.data.message)
            }

        }

        removeInner()

    }

    return (

        <div>
            {
                props.location.state
                    ? (
                        <div>

                            {
                                errorMessage
                                    ? <Redirect to={{ pathname: "/error", state: { message: errorMessage } }} />
                                    : null
                            }

                            {
                                loading === true ? <div className="medium progress"><div>Loading…</div></div>
                                    : (
                                        <div className="container" >
                                            <div className="new-doc-card mt-50" >

                                                <div className="add-new-doc">
                                                    <span className="add-btn" disabled >
                                                        <span className="material-icons" >
                                                            edit
                                                        </span>
                                                    </span>

                                                    <h3 className="heading-secondary" >Rename document</h3>
                                                </div>

                                                <form className="add-new-doc-form"
                                                    onSubmit={
                                                        (e) => {
                                                            e.preventDefault()
                                                            updateNameHandler(inputTerm)
                                                        }
                                                    }
                                                >
                                                    <div style={{ display: "flex" }} >
                                                        <label className="doc-title" > {title} </label>

                                                        {/* {
                                errorMessage !== "" && <div className="error-box-home" > <p className="error-text-home" > {errorMessage} </p> </div>
                            } */}

                                                    </div>

                                                    <input
                                                        type="text"
                                                        placeholder="Enter new name"
                                                        ref={inputRef}
                                                        onChange={(e) => setInputTerm(e.target.value)}
                                                        className="doc-title-input"
                                                    />

                                                    <button
                                                        type="submit"
                                                        disabled={!inputTerm}
                                                        className="add-new-doc-btn"
                                                    >
                                                        Update
                                                    </button>

                                                </form>
                                            </div>

                                            {/* <h3>{title}</h3>

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
                </form> */}

                                            <div className="docs-card" >

                                                <div className="saved-docs-div" >
                                                    <span className="material-icons  saved-icon" >
                                                        group
                                                    </span>
                                                    <h3 className="heading-secondary" >Collaborators</h3>
                                                </div>

                                                {
                                                    collaborators.map(
                                                        (collaborator, index) => {
                                                            return (
                                                                <div key={index} className="collaborators-div" >
                                                                    <div className="username-div" >
                                                                        <p>{collaborator.username}</p>
                                                                    </div>
                                                                    <span className="material-icons remove-btn"
                                                                        onClick={
                                                                            () => {
                                                                                removeCollab(collaborator)
                                                                            }
                                                                        }
                                                                    >close</span>
                                                                </div>
                                                            )
                                                        }
                                                    )
                                                }
                                            </div>

                                        </div>
                                    )
                            }
                        </div>
                    )
                    : null
        }
        </div>


    )
}

export default ManageDoc
