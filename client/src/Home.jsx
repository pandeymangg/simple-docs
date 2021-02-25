import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Home = (props) => {
    const [title, setTitle] = useState("")
    const [docs, setDocs] = useState([])

    const clickHandler = async () => {
        async function createNewDoc() {
            const newDoc = await axios.post('/api/docs', {
                name: title
            })

            const docId = newDoc.data.data.doc._id
            return docId
        }

        const docId = await createNewDoc()

        const docIdString = `id=${docId}`

        props.history.push({
            pathname: "/new",
            search: docIdString
        })
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
            search: idString
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
            <form>

                <label>Title: </label>

                <input
                    type="text"
                    placeholder="Enter title of the document"
                    required
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                />

                <button
                    type="submit"
                    onClick={
                        (e) => {
                            e.preventDefault()
                            clickHandler()
                        }
                    }
                    disabled={!title} >
                    Create
                </button>

            </form>

            <div>
                {
                    docs.map(doc => {
                        return (
                            <div 
                                key={ doc._id } 
                                style={ { width: '90%', height: 'fit-content', padding: '10px', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent:'space-around' } }
                            >
                                <p>Name: { doc.name }</p>
                                <button onClick={ (id) => viewDocHandler(doc._id) } >View</button>
                                <button onClick={ (id) => deleteDocHandler(doc._id) } >Delete</button>
                            </div>
                        )
                    })
                }
            </div>

        </>
    )
}

export default Home