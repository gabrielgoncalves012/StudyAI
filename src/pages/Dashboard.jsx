import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/dashboard.css'


function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className={`app-container ${menuOpen ? 'menu-open' : ''}`}>

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <h2 className="sidebar-logo">StudyAI</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/concurso">Concurso</Link>
          <Link to="/cronograma">Cronograma</Link>
          <Link to="/questoes">Questões</Link>
          <Link to="/progresso">Progresso</Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">

        <div
         className="overlay"
         onClick={() => setMenuOpen(false)}
        ></div>
        
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <span className="topbar-title">Dashboard</span>
        </header>

        {/* Conteúdo */}
        <div className="dashboard">
          <div className="dashboard-header">
            <div>
              <h1>Olá, Estudante 👋</h1>
              <p>Organize seus estudos com ajuda da IA</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Concursos</span>
              <strong>0</strong>
            </div>
            <div className="stat-card">
              <span>Matérias</span>
              <strong>0</strong>
            </div>
            <div className="stat-card">
              <span>Questões</span>
              <strong>0</strong>
            </div>
            <div className="stat-card">
              <span>Aproveitamento</span>
              <strong>0%</strong>
            </div>
          </div>

          <div className="ai-section">
            <h2>🎯 Análise de Edital com IA</h2>

            <label>Nome do concurso</label>
            <input placeholder="Ex: Polícia Federal 2025" />

            <label>Link do edital (opcional)</label>
            <input placeholder="Cole o link do edital" />

            <button className="btn-primary">
              Analisar com IA
            </button>

            <div className="status">
              Status: aguardando informações
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
