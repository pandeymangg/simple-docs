import React, { useCallback, useMemo, useState } from 'react'
import { createEditor, Editor, Transforms } from 'slate'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import Elements from './Elements'
import './SlateEditor.css'
import Leaf from './Leaf'
import Button from './Buttons/Button'

const SlateEditor = () => {
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
    return <Leaf {...props} />

  }, [])

  return (
    <div className="base-div" >

      <Slate editor={editor} value={value} onChange={value => setValue(value)}>

        <div>

          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underline" />
          <MarkButton format="code" icon="code" />

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
                break

              case 'u':
                event.preventDefault()
                toggleMark(editor, "underline")
                break

              case '`':
                event.preventDefault()
                toggleMark(editor, "code")
                break

              default: break

            }
          }}
        />
      </Slate>
    </div>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={ isMarkActive(editor, format) }
      onMouseDown={(e) => {
        e.preventDefault()
        toggleMark(editor, format)
      }}
      icon={ icon }
    />
  )
}

const isMarkActive = (editor, format) => {
  let marks = Editor.marks(editor)
  let returnValue = marks ? marks[format] === true : false
  return returnValue
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if(isActive) {
    Editor.removeMark(editor, format) 
  } else {
    Editor.addMark(editor, format, true)
  }

}


export default SlateEditor;