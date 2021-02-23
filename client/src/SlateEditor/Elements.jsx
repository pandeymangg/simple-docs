const Elements = ({ attributes, children, element }) => {
    switch(element.type) {
        case 'heading-one':
            return <h1 {...attributes} >{ children }</h1>

        case 'heading-two':
            return <h2 {...attributes} >{ children }</h2>

        case 'left':
            return <p style={{ textAlign: 'left' }} { ...attributes } >{ children }</p>

        case 'center':
            return <p style={{ textAlign: 'center' }} { ...attributes } >{ children }</p>
            
        case 'right':
            return <p style={{ textAlign: 'right' }} { ...attributes } >{ children }</p>
            
        case 'justify':
            return <p style={{ textAlign: 'justify', textJustify: 'inter-word' }} { ...attributes } >{ children }</p>

        default:
            return <p { ...attributes } >{ children }</p>
    }
}

export default Elements 