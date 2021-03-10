import { Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './Home'
import ProtectedRoute from './components/ProtectedRoute'
import SlateEditor from './SlateEditor/SlateEditor'
import { useContext } from 'react'
import AuthContext from './context/AuthContext'

function App() {

  const { loggedIn } = useContext(AuthContext)

  return (
    <>

      <Route path="/" component={HomePage} />
      
      {
        ( loggedIn === true || loggedIn === false ) && <Route path="/login" component={Login} />
      }


      {
        (loggedIn === true || loggedIn === false) && (
          <Route path="/new" exact component={SlateEditor} />
        )
      }

      {
        (loggedIn === true || loggedIn === false) && (
          <Route path="/view" exact component={SlateEditor} />
        )
      }

      {/* <Route path="/new" component={SlateEditor} />
      <Route path="/view" exact component={SlateEditor} /> */}

      {
        (loggedIn === true || loggedIn === false) && (
          <ProtectedRoute path="/dashboard" exact component={Home} />
        )
      }


    </>
  )
}

export default App