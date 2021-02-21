import React from 'react'

const Home = (props) => {
    const clickHandler = () => {
        props.history.push({
            pathname: "/new"
        })
    }

    return (
        <button onClick={ clickHandler } >NEW</button>
    )
}

export default Home