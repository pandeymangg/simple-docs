import SlateEditor from './SlateEditor/SlateEditor'
import Home from './Home'
import { Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Route path="/" exact component={Home} />
      <Route path="/new" exact component={SlateEditor} />
    </>
  )
}

export default App