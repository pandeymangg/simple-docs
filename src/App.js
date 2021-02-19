import React, { useCallback, useMemo, useState } from 'react'
import { createEditor, Editor, Text, Transforms } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import Elements from './Elements'
import './App.css'
import Leaf from './Leaf'

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])

  const renderElement = useCallback(props => {

    if (props.element.type === "heading-one") {
      return <Elements {...props} />
    }
    if (props.element.type === "heading-two") {
      return <Elements {...props} />
    } else {
      return <Elements {...props} />
    }

  }, [])

  const renderLeaf = useCallback(props => {
    // switch (props.leaf.type) {
    //   case 'bold':
    //     return <BoldLeaf {...props} />

    //   case 'italic':
    //     return <ItalicLeaf {...props} />

    //   case 'underline':
    //     return <UnderlineLeaf {...props} />

    //   default: return <DefaultLeaf {...props} />
    // }

    // switch(props.leaf.type) {
    //   case 'bold':
    //     return <Leaf { ...props } />

    //   case 'italic':
    //     return <Leaf { ...props } />

    //   case 'underline':
    //     return <Leaf { ...props } />

    //   default:
    //     return <Leaf { ...props } />

    // }

    return <Leaf {...props} />

  }, [])

  return (
    <div className="base-div" >

      <Slate editor={editor} value={value} onChange={value => setValue(value)}>

        <div>

          <button onMouseDown={
            (e) => {
              e.preventDefault()
              const [match] = Editor.nodes(
                editor,
                { match: n => n.type === "heading-one" }
              )

              Transforms.setNodes(
                editor,
                { type: match ? 'paragraph' : 'heading-one' },
                { match: n => Editor.isBlock(editor, n) }
              )
            }
          } >H1</button>

          <button onMouseDown={
            (e) => {
              e.preventDefault()
              const [match] = Editor.nodes(
                editor,
                { match: n => n.type === "heading-two" }
              )

              Transforms.setNodes(
                editor,
                { type: match ? 'paragraph' : 'heading-two' },
                { match: n => Editor.isBlock(editor, n) }
              )
            }
          } >H2</button>


          <button
            onMouseDown={
              (e) => {
                e.preventDefault()
                toggleMark(editor, "bold")
              }
            }
          >B</button>

          <button
            onMouseDown={
              (e) => {
                e.preventDefault()
                toggleMark(editor, "italic")
              }
            }
          >I</button>

          <button
            onMouseDown={
              (e) => {
                e.preventDefault()
                toggleMark(editor, "underline")
              }
            }
          >U</button>

          <button onMouseDown={
            (e) => {
              e.preventDefault()
              toggleMark(editor, "code")
            }
          } >Code</button>

        </div>

        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {

            if (!event.ctrlKey) {
              return
            }

            switch (event.key) {

              case 'b':
                event.preventDefault()
                toggleMark(editor, "bold")
                break

              case 'i':
                event.preventDefault()
                toggleMark(editor, "italic")

              case 'u':
                event.preventDefault()
                toggleMark(editor, "underline")

              default: break

            }
          }}
        />
      </Slate>
    </div>
  )
}

const isMarkActive = (editor, format) => {
  // const [match] = Editor.nodes(editor, {
  //   match: n => n.format === true
  // })

  // return !!match
  let marks = Editor.marks(editor)
  let returnValue = marks ? marks[format] === true : false
  return returnValue
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  // Transforms.setNodes(
  //   editor,
  //   { [format]: isActive ? null : true },
  //   { match: n => Text.isText(n), split: true }
  // )

  if(isActive) {
    Editor.removeMark(editor, format) 
  } else {
    Editor.addMark(editor, format, true)
  }

}


export default App;