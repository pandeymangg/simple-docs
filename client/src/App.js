import SlateEditor from './SlateEditor/SlateEditor'
import Home from './Home'
import DeleteDoc from './DeleteDoc'
import { Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Route path="/" exact component={Home} />
      <Route path="/new" exact component={SlateEditor} />
      <Route path="/view" exact component={SlateEditor} />
      <Route path="/delete" exact component={DeleteDoc} />
    </>
  )
}

export default App