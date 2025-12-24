import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function Header() {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/questoes">Questões</Link>
        <button onClick={handleLogout}>Sair</button>
      </nav>
    </header>
  )
}

export default Header
