import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createEditor, Editor, Transforms, Element as SlateElement } from 'slate'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import Elements from './Elements'
import './SlateEditor.css'
import Leaf from './Leaf'
import Button from './Buttons/Button'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { Redirect } from 'react-router'


const SlateEditor = (props) => {

  const queryParams = new URLSearchParams(props.location.search)
  let idCopy;
  for (let param of queryParams.entries()) {
    if (param[0] === 'id') {
      idCopy = param[1]
    }
  }

  //const [docId, setDocId] = useState(props.location.state.docId)
  const [docId] = useState(idCopy)
  //const [doc, setDoc] = useState()
  const [title, setTitle] = useState("")
  const [idStatus, setIdStatus] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorStatus, setErrorStatus] = useState("")

  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState([])

  const [timer, setTimer] = useState()

  const { loggedIn } = useContext(AuthContext)

  useEffect(() => {
    if (loggedIn) {
      if (!idCopy) {
        setIdStatus("false")
      } else {
        //console.log(currentUser)
        async function getSingleDoc() {
          try {
            const doc = await axios.get(`/api/docs/${docId}`)

            setValue(doc.data.data.doc.content)
            setTitle(doc.data.data.doc.name)



          } catch (err) {
            //console.log(err)
            setErrorStatus(err.response.status)
            setErrorMessage(err.response.data.message)
          }
        }

        getSingleDoc()

      }
    }

  }, [docId])

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

  const saveDocHandler = () => {
    async function saveDoc() {
      try {
        //const docId = props.location.state.docId
        await axios.patch(`/api/docs/${docId}`, {
          content: value
        })
        //console.log(updatedDoc)
      } catch (err) {
        //console.log(err.response.data)
        //console.log(err)
        setErrorStatus(err.response.status)
        setErrorMessage(err.response.data.message)
      }
    }

    saveDoc()
  }

  return (

    <div className="base-div" >

      {/* {
        loggedIn && errorMessage !== "" ? <Redirect to={{ pathname: 'error', state: { message: errorMessage, statusCode: errorStatus } }} />
          : null
      } */}

      {
        loggedIn && errorMessage === "You are not authorised to access this document!"
          ? <Redirect to={{ pathname: "/permission", state: { message: errorMessage, docId } }} />
          : null
      }

      {
        (loggedIn && errorMessage !== "You are not authorised to access this document!" && errorMessage !== "")
          ? <Redirect to={{ pathname: "/error", state: { message: errorMessage, statusCode: errorStatus } }} />
          : null
      }

      {
        loggedIn && idStatus === "false" ? <Redirect to="/" /> : null
      }

      {
        loggedIn ? null : <Redirect to="/login" />
      }

      <div className="doc-info" >
        <h3 className="doc-title" >Document Title: {title}</h3>

        {/* {
          collaborators
          ? (
            <select>
              <option> Collaborators </option>
              {
                collaborators.map((collaborator, index) => {
                  return (
                    <option key={ index } disabled >
                      { collaborator.username }
                    </option>
                  )
                })
              }
            </select>
          )
          : null
        } */}

        <button onClick={saveDocHandler} className="save-button">
          <span className="material-icons" >
            save
          </span>
        </button>

      </div>

      <Slate editor={editor} value={value} onChange={
        (value) => {
          setValue(value)
        }
      }
      >

        <div className="toolbar" >

          <MarkButton format="bold" icon="format_bold"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer} />

          <MarkButton format="italic" icon="format_italic"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer}
          />

          <MarkButton format="underline" icon="format_underline"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer}
          />

          <MarkButton format="code" icon="code"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer}
          />

          <MarkButton format="uppercase" icon="keyboard_arrow_up"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer}
          />

          <MarkButton format="lowercase" icon="keyboard_arrow_down"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer}
          />


          <BlockButton format="heading-one" icon="looks_one"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer}
          />

          <BlockButton format="heading-two" icon="looks_two"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer}
          />

          <BlockButton format="left" icon="format_align_left"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer}
          />

          <BlockButton format="center" icon="format_align_center"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer}
          />

          <BlockButton format="right" icon="format_align_right"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer}
          />

          <BlockButton format="justify" icon="format_align_justify"
            saveDoc={saveDocHandler}
            timer={timer}
            setTimer={setTimer}
          />

        </div>

        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}

          onKeyUp={
            () => {
              if (timer) {
                window.clearTimeout(timer)
              }

              setTimer(setTimeout(() => {
                //console.log("done")
                saveDocHandler()
              }, 1000))

            }
          }

          onKeyPress={
            () => {
              if (timer) {
                window.clearTimeout(timer)
              }
              //console.log("typing")
            }
          }


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

const MarkButton = ({ format, icon, saveDoc, timer, setTimer }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(e) => {
        e.preventDefault()
        toggleMark(editor, format)

        if (timer) {
          window.clearTimeout(timer)
        }

        setTimer(setTimeout(() => {
          //console.log("done")
          saveDoc()
        }, 1000))

      }}

      icon={icon}
    />
  )
}

const BlockButton = ({ format, icon, saveDoc, timer, setTimer }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(e) => {
        e.preventDefault()
        toggleBlock(editor, format)

        if (timer) {
          window.clearTimeout(timer)
        }

        setTimer(setTimeout(() => {
          //console.log("done")
          saveDoc()
        }, 1000))

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