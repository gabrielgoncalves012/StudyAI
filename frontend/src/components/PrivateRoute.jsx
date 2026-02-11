import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {

  const isAuthenticated = true
  

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute
