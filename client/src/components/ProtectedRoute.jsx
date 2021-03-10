import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {

    const { loggedIn } = useContext(AuthContext)

    return (
        <Route {...rest} render={
            props => {
                if (loggedIn) {
                    return <Component {...rest} {...props} />
                } else {
                    return <Redirect to="/login" />
                }
            }
        } />
    )
}

export default ProtectedRoute;