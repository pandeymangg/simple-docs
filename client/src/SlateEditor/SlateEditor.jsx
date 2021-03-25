import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
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
  const [collaborators, setCollaborators] = useState([])

  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState([])

  const { loggedIn, currentUser } = useContext(AuthContext)
  // const id = useRef(uuidv4())
  // const remote = useRef(false)

  useEffect(() => {
    //const docId = props.location.state.docId
    //let applyNewOps;
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

            const collabs = doc.data.data.doc.collaborators
            if(collabs) {
              collabs.map(async collab => {
                const response = await axios.get("/api/users/getUser", { id: collab })
                //console.log(response.data.username)
                setCollaborators(
                  (prevState) => {
                    return [...prevState, { id: collab, username: response.data.username }]
                  }
                )
              })
            }


          } catch (err) {
            //console.log(err)
            setErrorStatus(err.response.status)
            setErrorMessage(err.response.data.message)
          }
        }

        getSingleDoc()

        // if(currentUser) {
        //   socket.emit('join-room', { docId, user: currentUser._id })
        // }
        //socket.emit('join-room', { docId: docId, user: currentUser })

    //     applyNewOps = ({ editorId, ops, documentId }) => {
    //       //console.log(docId === documentId)
    //       // console.log(editorId, id.current)
    //       // console.log(editorId === id.current)
    //       if (editorId !== id.current && docId === documentId) {
    //         console.log("change happened in other")
    //         remote.current = true
    //         Editor.withoutNormalizing(editor, () => {
    //           ops.forEach(op => {
    //             editor.apply(op);
    //           });
    //         })
    //         remote.current = false;

    //       }
    //     }

    //     socket.on('new-remote-operations', applyNewOps)

    //   }

    }

    // return cleanUp => {
    //   console.log("cleaning up...")
    //   socket.off('new-remote-operations', applyNewOps)
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

        {
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
        }

        <button onClick={saveDocHandler} className="save-button">
          <span className="material-icons" >
            save
          </span>
        </button>

      </div>

      <Slate editor={editor} value={value} onChange={
        (value) => {
          setValue(value)

          // socket changes - for live editing...

          // if (currentUser) {
          //   const filterOperations = editor.operations.filter(operation => {

          //     if (operation === null) {
          //       return false
          //     }

          //     return (
          //       (operation.type !== "set_selection") &&
          //       (operation.type !== "set_value") &&
          //       (!operation.data || !"source" in operation.data)
          //     )
          //   }).map(operation => {
          //     return (
          //       {
          //         ...operation,
          //         data: { source: "one" }
          //       }
          //     )
          //   })

          //   if (filterOperations.length && !remote.current) {
          //     //emitter.emit(id.current, filterOperations)
          //     //console.log(filterOperations)
          //     socket.emit("new-operations", {
          //       editorId: id.current,
          //       ops: filterOperations,
          //       documentId: docId
          //     });

          //   }
          // }


        }
      }>

        <div className="toolbar" >

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