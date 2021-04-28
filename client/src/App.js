import { Route } from 'react-router-dom'
import HomePage from './components/HomePage/HomePage'
import Login from './components/Login/Login'
import Home from './Home'
import ProtectedRoute from './components/ProtectedRoute'
import SlateEditor from './SlateEditor/SlateEditor'
import { useContext } from 'react'
import AuthContext from './context/AuthContext'
import ErrorPage from './components/ErrorPage/ErrorPage'
import Permission from './components/Permission/Permission'
import Notifications from './components/Notifications/Notifications'
import Navbar from './components/Navbar/Navbar'
import DeleteDoc from './DeleteDoc'
import Signup from './components/Signup/Signup'
import Footer from './components/Footer/Footer'
import ManageDoc from './components/ManageDoc/ManageDoc'

function App() {

  const { loggedIn } = useContext(AuthContext)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }} >

      <Navbar />

      <div className="app-main" style={{ flex: '1 0 auto' }} >
        {
          (loggedIn === true || loggedIn === false) && <Route path="/" exact component={HomePage} />
        }


        {
          (loggedIn === true || loggedIn === false) && <Route path="/login" component={Login} />
        }

        {
          (loggedIn === true || loggedIn === false) && <Route path="/signup" component={Signup} />
        }


        {
          (loggedIn === true || loggedIn === false) && (
            <Route path="/view" exact component={SlateEditor} />
          )
        }

        {
          (loggedIn === true || loggedIn === false) && (
            <Route path="/new" exact component={SlateEditor} />
          )
        }

        {
          (loggedIn === true || loggedIn === false) && (
            <ProtectedRoute path="/dashboard" exact component={Home} />
          )
        }

        <Route path="/error" exact render={(props) => <ErrorPage {...props} />} />

        {
          (loggedIn === true || loggedIn === false)
          &&
          <Route path="/permission" exact render={
            (props) => <Permission {...props} />
          } />
        }

        {
          (loggedIn === true || loggedIn === false) && <Route path="/notifications" component={Notifications} />
        }

        {
          loggedIn === true && <Route path="/delete" component={DeleteDoc} />
        }

        {
          (loggedIn === true)
          && <Route
            path="/manage"
            exact
            render={(props) => <ManageDoc {...props} />}
          />
        }

      </div>

      <Footer />

    </div>
  )
}

export default App