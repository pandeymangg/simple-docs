import React from 'react'

// export const BoldLeaf = (props) => {
//     return (
//         <strong {...props.attributes} >{props.children}</strong>
//     )
// }

// export const ItalicLeaf = (props) => {
//     return (
//         <em { ...props.attributes } >{ props.children }</em>
//     )
// }

// export const UnderlineLeaf = (props) => {
//     return (
//         <u { ...props.attributes } >{ props.children }</u>
//     )
// }

// export const DefaultLeaf = (props) => {
//     return (
//         <span {...props.attributes} >{props.children}</span>
//     )
// }

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
    
    return <span {...attributes} >{children}</span>
}

export default Leaf