import React from 'react'

const Button = ({ active, onMouseDown, icon }) => {

    return (
        <button
            className={`edit-button ${active ? 'edit-button-active' : ''}`}
            onMouseDown={onMouseDown}
        >
            <span className="material-icons" >
                {icon}
            </span>
        </button>
    )
}

export default Button