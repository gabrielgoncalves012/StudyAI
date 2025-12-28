import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'

function Register() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()

    if (nome && email && senha) {
      // futuramente: integração com backend
      navigate('/login')
    } else {
      alert('Preencha todos os campos')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <strong>StudyAI</strong>
        </div>

        <h2>Criar conta</h2>
        <p>Crie sua conta para começar a estudar com IA</p>

        <form onSubmit={handleSubmit}>
          <label>Nome</label>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button type="submit">Criar conta</button>
        </form>

        <div className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </div>

      </div>
    </div>
  )
}

export default Register
