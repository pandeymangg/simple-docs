import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import './Home.css'
import AuthContext from './context/AuthContext'
import { useHistory } from 'react-router'

const Home = (props) => {
    const [title, setTitle] = useState("")
    const [docs, setDocs] = useState([])
    const [errorMessage, setErrorMessage] = useState("")

    const [loading, setLoading] = useState(true)

    const { currentUser } = useContext(AuthContext)

    const history = useHistory()

    const clickHandler = async () => {
        async function createNewDoc() {
            // const newDoc = await axios.post('/api/docs', {
            //     name: title
            // }, { withCredentials: true })

            // const docId = newDoc.data.data.doc._id
            // return docId
            try {
                const newDoc = await axios.post('/api/docs', {
                    name: title
                }, { withCredentials: true })

                const docId = newDoc.data.data.doc._id
                return docId
            } catch (err) {
                //console.log(err.response)
                setErrorMessage(err.response.data.message)
            }
        }


        const docId = await createNewDoc()

        if (docId) {
            const docIdString = `id=${docId}`

            props.history.push({
                pathname: "/new",
                search: docIdString,
                //state: { docId }
            })
        }
    }

    async function getAllDocs() {
        const docs = await axios.get('/api/docs')

        setDocs(docs.data.data.docs)
        setLoading(false)
    }

    useEffect(() => {
        getAllDocs()
    }, [])

    const viewDocHandler = (id) => {
        const idString = `id=${id}`

        props.history.push({
            pathname: '/view',
            search: idString,
            //state: { docId: id }
        })
    }

    const deleteDocHandler = async (id) => {
        await axios.delete(`/api/docs/${id}`)

        props.history.push({
            pathname: "/delete"
        })

        // try {
        //     await axios.delete(`/api/docs/${id}`)
        //     getAllDocs()
        // } catch (err) {
        //     console.log(err)
        // }


        // props.history.push({
        //     pathname: '/delete'
        // })
    }

    const manageDocumentHandler = (id, title, collaborators) => {
        //const data = [id, title, collaborators]
        //console.log(data)

        history.push({
            pathname: '/manage',
            state: {
                id,
                title,
                collaborators
            }
        })

    }

    return (
        <>

            {/* <h1 className="heading-primary" >
                <span style={{ color: '#623C3D' }} >simple</span><span style={{ color: '#6B645C' }} >Docs</span>
            </h1> */}

            {
                loading === true 
                ? <div className="medium progress"><div>Loading…</div></div>
                : null
            }

            {
                loading === false ? (
                    <div className="dashboard-container" >

                        <div className="new-doc-card" >

                            <div className="add-new-doc" >
                                <span className="add-btn" disabled >
                                    <span className="material-icons" >
                                        add
                                    </span>
                                </span>

                                <h3 className="heading-secondary" >Add new document</h3>
                            </div>

                            <form className="add-new-doc-form" >

                                <div style={{ display: "flex" }} >
                                    <label className="doc-title" >Title </label>

                                    {
                                        errorMessage !== "" && <div className="error-box-home" > <p className="error-text-home" > {errorMessage} </p> </div>
                                    }

                                </div>

                                <input
                                    type="text"
                                    placeholder="Enter title of the document"
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                    }}
                                    className="doc-title-input"
                                />

                                <button
                                    type="submit"
                                    onClick={
                                        (e) => {
                                            e.preventDefault()
                                            clickHandler()
                                        }
                                    }
                                    disabled={!title}
                                    className="add-new-doc-btn"
                                >
                                    Add
                                </button>

                            </form>
                        </div>
                    </div>

                )
                    : null
            }

            {
                loading === false ?
                    (
                        <div className="docs-card" >
                            <div className="saved-docs-div" >
                                <span className="material-icons  saved-icon" >
                                    save
                                </span>
                                <h3 className="heading-secondary" >Saved Documents</h3>
                            </div>

                            {
                                docs.map(doc => {
                                    return (

                                        <div className="single-doc" key={doc._id} >
                                            <div className="name-manage--div" >
                                                <h3
                                                    className="heading-secondary doc-name"
                                                    onClick={id => viewDocHandler(doc._id)}
                                                >
                                                    {doc.name}
                                                </h3>

                                                {
                                                    // doc.collaborators.includes(currentUser._id)
                                                    doc.owner === currentUser._id
                                                        ? ( <span
                                                                onClick={
                                                                    (id) => manageDocumentHandler(
                                                                        doc._id
                                                                    )
                                                                }
                                                                className="material-icons manage-btn"
                                                            >
                                                                settings
                                                            </span>
                                                        )
                                                        : null
                                                }
                                            </div>

                                            {
                                                doc.collaborators.includes(currentUser._id)
                                                    ? <div className="user-role--div" >Collaborator</div>
                                                    : <div className="user-role--div" >Owner</div>
                                            }

                                            {
                                                doc.collaborators.includes(currentUser._id)
                                                    ? null
                                                    : <span
                                                        className="material-icons delete-doc-icon"
                                                        onClick={(id) => deleteDocHandler(doc._id)}
                                                    >delete</span>
                                            }



                                        </div>

                                    )
                                })
                            }

                        </div>
                    )
                    : null
            }

            {/* <div className="dashboard-container" >

                <div className="new-doc-card" >

                    <div className="add-new-doc" >
                        <span className="add-btn" disabled >
                            <span className="material-icons" >
                                add
                            </span>
                        </span>

                        <h3 className="heading-secondary" >Add new document</h3>
                    </div>

                    <form className="add-new-doc-form" >

                        <div style={{ display: "flex" }} >
                            <label className="doc-title" >Title </label>

                            {
                                errorMessage !== "" && <div className="error-box-home" > <p className="error-text-home" > {errorMessage} </p> </div>
                            }

                        </div>

                        <input
                            type="text"
                            placeholder="Enter title of the document"
                            onChange={(e) => {
                                setTitle(e.target.value)
                            }}
                            className="doc-title-input"
                        />

                        <button
                            type="submit"
                            onClick={
                                (e) => {
                                    e.preventDefault()
                                    clickHandler()
                                }
                            }
                            disabled={!title}
                            className="add-new-doc-btn"
                        >
                            Add
                        </button>

                    </form>
                </div>
            </div> */}

            {/* <div className="docs-card" >
                <div className="saved-docs-div" >
                    <span className="material-icons  saved-icon" >
                        save
                    </span>
                    <h3 className="heading-secondary" >Saved Documents</h3>
                </div>

                {
                    docs.map(doc => {
                        return (

                            <div className="single-doc" key={doc._id} >
                                <div className="name-manage--div" >
                                    <h3
                                        className="heading-secondary doc-name"
                                        onClick={id => viewDocHandler(doc._id)}
                                    >
                                        {doc.name}
                                    </h3>

                                    {
                                        doc.collaborators.includes(currentUser._id)
                                            ? null
                                            : <button
                                                onClick={
                                                    (id) => manageDocumentHandler(
                                                        doc._id
                                                    )
                                                }
                                                className="manage-btn"
                                            >
                                                Manage
                                            </button>
                                    }
                                </div>

                                {
                                    doc.collaborators.includes(currentUser._id)
                                        ? <div className="user-role--div" >Collaborator</div>
                                        : <div className="user-role--div" >Owner</div>
                                }

                                {
                                    doc.collaborators.includes(currentUser._id)
                                        ? null
                                        : <span
                                            className="material-icons delete-doc-icon"
                                            onClick={(id) => deleteDocHandler(doc._id)}
                                        >delete</span>
                                }



                            </div>

                        )
                    })
                }

            </div> */}

        </>
    )
}

export default Home