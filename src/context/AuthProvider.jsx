import { useState } from 'react'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('auth')
  )

  const [concurso, setConcurso] = useState(null)

  function login() {
    localStorage.setItem('auth', 'true')
    setIsAuthenticated(true)
  }

  function logout() {
    localStorage.removeItem('auth')
    setIsAuthenticated(false)
    setConcurso(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        concurso,
        setConcurso,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
