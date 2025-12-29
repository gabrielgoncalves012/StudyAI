import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoTimeOutline } from "react-icons/io5";
import '../styles/dashboard.css'
import Card from '../components/Card';
import EmojiPicker, { Emoji } from 'emoji-picker-react';
import { IoMdAdd } from "react-icons/io";

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
          
          <section className='recent-section'>
            <div className='recent-header'>
              <IoTimeOutline className='recent-icon' />
              <span className='recent-title'>Atividades Recentes</span>
            </div>
            <ul className='recent-list'>
              <li className='recent-item'>
                <Card icon={<IoMdAdd color='#6b7280'/>} title={"Novo conograma"} color={"#7c4dff"} date={"_"}/>
              </li>
              <li className='recent-item'>
                <Card code={"1f3e6"} title={"Banco do brasil"} color={"#FFEF5F"} date={"1 dia atrás"}/>
              </li>
            </ul>
          </section>
          {/* <div className="ai-section">
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
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
