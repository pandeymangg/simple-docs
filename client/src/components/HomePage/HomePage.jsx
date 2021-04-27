import React, { useContext } from 'react'
import { Redirect } from 'react-router'
import { useHistory } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import './HomePage.css'

const HomePage = () => {

    const { loggedIn } = useContext(AuthContext)
    const history = useHistory()
    let imageName = require("../../images/simpleDocsSS1.JPG")

    const homeNotLoggedIn = (
        <div className="main-div" >

            <div className="main-heading--div" >
                <h1 className="main-heading"><span style={{ color: '#623C3D' }} >simple</span><span style={{ color: '#6B645C' }} >Docs</span></h1>
            </div>

            <div className="main-content--div" >
                <div className="main-content-image--div" >
                    <img src={imageName.default} height="300" width="450" alt="simpleDocsSS"  ></img>
                </div>

                <div className="headerDivider" ></div>

                <div className="main-content-content--div">
                    {/* Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi nobis perferendis veritatis odit minus quibusdam reiciendis vero temporibus error repellendus. */}

                    <h2 className="heading-secondary-home" >Web app for managing documents!</h2>
                    <p>
                        
                        With a simple rich text editor made with slatejs!
                        Manage documents easily without any hassle.
                        Users can now also be added / removed as collaborators.
                        With live notifications and badges.
                        Live collaboration is now a feature!

                    </p>

                    <button className="login-button--sm"
                        onClick={
                            () => {
                                history.push("/login")
                            }
                        }
                    >Log In</button>

                </div>

            </div>

        </div>
    )

    return (
        <>
            {/* <Navbar /> */}

            {
                loggedIn ? <Redirect to="/dashboard" /> : homeNotLoggedIn
            }

        </>

    )
}

export default HomePage
