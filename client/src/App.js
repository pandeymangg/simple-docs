// import SlateEditor from './SlateEditor/SlateEditor'
// import Home from './Home'
// import DeleteDoc from './DeleteDoc'
import { Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import Signup from './components/Signup'
import Login from './components/Login'


function App() {
  return (
    <>
      <Route path="/" component={ HomePage }  />
      <Route path="/signup" component={ Signup }  />
      <Route path="/login" component={ Login }  />
    </>
  )
}

export default App