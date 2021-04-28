import React from 'react'

const DocListItem = ({ doc, currentUser, viewDocHandler, manageDocumentHandler, deleteDocHandler }) => {
    return (
        <div className="single-doc" >
            <div className="name-div" >
                <h3
                    className="heading-secondary doc-name"
                    onClick={id => viewDocHandler(doc._id)}
                >
                    {doc.name}
                </h3>
            </div>

            {
                doc.collaborators.includes(currentUser._id)

                    ? <div className="user-role--div" >Collaborator</div>

                    : <div className="user-role--div" >Owner</div>
            }


            {
                doc.collaborators.includes(currentUser._id)
                    ? <div className="buttons--div" ></div>
                    : (<div className="buttons--div" >

                        <span
                            onClick={
                                (id) => manageDocumentHandler(
                                    doc._id
                                )
                            }
                            className="material-icons manage-btn"
                        >
                            settings
                        </span>

                        <span
                            className="material-icons delete-doc-icon"
                            onClick={(id) => deleteDocHandler(doc._id)}
                        >delete
                        </span>


                    </div>)
            }

        </div>
    )
}

export default DocListItem
