import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import './Home.css'
import AuthContext from './context/AuthContext'

const Home = (props) => {
    const [title, setTitle] = useState("")
    const [docs, setDocs] = useState([])
    const [errorMessage, setErrorMessage] = useState("")

    const { currentUser } = useContext(AuthContext)

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
                console.log(err.response)
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

    useEffect(() => {
        async function getAllDocs() {
            const docs = await axios.get('/api/docs')

            setDocs(docs.data.data.docs)
        }

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
            pathname: '/delete'
        })
    }

    return (
        <>
            {/* <h1 className="heading-primary" >
                <span style={{ color: '#623C3D' }} >simple</span><span style={{ color: '#6B645C' }} >Docs</span>
            </h1> */}

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
                                <h3
                                    className="heading-secondary doc-name"
                                    onClick={id => viewDocHandler(doc._id)}
                                >
                                    {doc.name}
                                </h3>
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

                            // <div
                            //     key={doc._id}
                            //     className="single-doc"
                            // >
                            //     <p>Name: {doc.name}</p>
                            //     <button onClick={(id) => viewDocHandler(doc._id)} >View</button>
                            //     <button onClick={(id) => deleteDocHandler(doc._id)} >Delete</button>
                            // </div>

                        )
                    })
                }

            </div>

        </>
    )
}

export default Home