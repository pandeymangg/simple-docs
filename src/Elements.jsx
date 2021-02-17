const Elements = ({ attributes, children, element }) => {
    switch(element.type) {
        case 'heading-one':
            return <h1 {...attributes} >{ children }</h1>

        case 'heading-two':
            return <h2 {...attributes} >{ children }</h2>

        default:
            return <p { ...attributes } >{ children }</p>
    }
}

export default Elements 