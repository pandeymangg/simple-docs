import React, { useState } from 'react'
import axios from 'axios'

const Home = (props) => {
    const [title, setTitle] = useState("")
    

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

    return (
        <>
            <form>

                <label>Title: </label>
                
                <input 
                    type="text" 
                    placeholder="Enter title of the document" 
                    required
                    onChange={ (e) => {
                        setTitle(e.target.value)
                    } }
                />

                <button 
                    type="submit" 
                    onClick={
                    (e) => {
                        e.preventDefault()
                        clickHandler()
                    }
                }
                disabled={ !title } >
                    Create
                </button>

            </form>
        </>
    )
}

export default Home