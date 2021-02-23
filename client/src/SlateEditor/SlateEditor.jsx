import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createEditor, Editor, Transforms, Element as SlateElement } from 'slate'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import Elements from './Elements'
import './SlateEditor.css'
import Leaf from './Leaf'
import Button from './Buttons/Button'
import axios from 'axios'

const SlateEditor = (props) => {

  const queryParams = new URLSearchParams(props.location.search)
  let idCopy;
  for (let param of queryParams.entries()) {
    if (param[0] === 'id') {
      idCopy = param[1]
    }
  }

  const [docId, setDocId] = useState(idCopy)
  
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState([])

  useEffect(() => {
    async function getSingleDoc() {
      const doc = await axios.get(`/api/docs/${docId}`)

      setValue(doc.data.data.doc.content)
    }

    getSingleDoc()
  }, [])

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
          <MarkButton format="uppercase" icon="keyboard_arrow_up" />
          <MarkButton format="lowercase" icon="keyboard_arrow_down" />

          <BlockButton format="heading-one" icon="looks_one" />
          <BlockButton format="heading-two" icon="looks_two" />
          <BlockButton format="left" icon="format_align_left" />
          <BlockButton format="center" icon="format_align_center" />
          <BlockButton format="right" icon="format_align_right" />
          <BlockButton format="justify" icon="format_align_justify" />

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
      active={isMarkActive(editor, format)}
      onMouseDown={(e) => {
        e.preventDefault()
        toggleMark(editor, format)
      }}
      icon={icon}
    />
  )
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(e) => {
        e.preventDefault()
        toggleBlock(editor, format)
      }}
      icon={icon}
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

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }

}

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(
    editor,
    {
      match: node => {
        return !Editor.isEditor(node) && SlateElement.isElement(node) && node.type === format
      }
    }
  )

  return !!match
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)

  Transforms.setNodes(
    editor,
    { type: isActive ? 'paragraph' : format },
    { match: node => Editor.isBlock(editor, node) }
  )
}

// const initialValue = [
//   {
//     type: 'paragraph',
//     children: [{ text: 'A line of text in a paragraph.' }],
//   },
// ]

export default SlateEditor;