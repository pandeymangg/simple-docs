import { Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import Signup from './components/Signup'
import Login from './components/Login'
import { AuthContextProvider } from './context/AuthContext'

function App() {
  return (
    <AuthContextProvider>
      <Route path="/" component={HomePage} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
    </AuthContextProvider>
  )
}

export default App