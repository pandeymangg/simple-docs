import React from 'react'

const CollabListItem = ({ collaborator, removeCollab }) => {
    return (
        <div className="collaborators-div" >
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

export default CollabListItem
