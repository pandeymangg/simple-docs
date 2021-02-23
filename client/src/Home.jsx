import React from 'react'

const Home = (props) => {
    const clickHandler = () => {
        props.history.push({
            pathname: "/new"
        })
    }

    return (
        <>
            <form>

                <label>Title: </label>
                <input type="text" placeholder="Enter title of the document" />
                <button type="submit" onClick={
                    (e) => {
                        e.preventDefault()
                        clickHandler()
                    }
                } >Create</button>

            </form>
        </>
    )
}

export default Home