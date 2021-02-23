import React, { useState } from 'react'
import axios from 'axios'

const Home = (props) => {
    const [title, setTitle] = useState("")

    const clickHandler = () => {
        async function createNewDoc() {
            const newDoc = await axios.post('/api/docs', {
                name: title
            })

            console.log(newDoc.data.data.doc)
        }

        createNewDoc()

        props.history.push({
            pathname: "/new"
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