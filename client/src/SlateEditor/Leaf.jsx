import React from 'react'


const Leaf = ({ attributes, children, leaf }) => {

    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }
    
    if(leaf.code) {
        children = <code style={{ width: 'fit-content', height: 'fit-content', background: '#eee' }} >{ children }</code>
    }

    if(leaf.uppercase) {
        children = <span style={{ textTransform: 'uppercase' }} >{ children }</span>
    }

    if(leaf.lowercase) {
        children = <span style={{ textTransform: 'lowercase' }} >{ children }</span>
    }
    
    return <span {...attributes} >{children}</span>
}

export default Leaf