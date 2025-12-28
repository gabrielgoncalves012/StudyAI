import { Link } from 'react-router-dom'
import '../styles/home.css'

function Home() {
  return (
    <div className="home-wrapper">
      <header className="home-header">
        <div className="container header-content">
          <div className="logo">
            <strong className="logo">StudyAI</strong>
          </div>

          <nav className="header-actions">
            <Link to="/login" className="link-login">Entrar</Link>
            <Link to="/register" className="btn-primary">Começar Grátis</Link>
          </nav>
        </div>
      </header>

      <main className="hero">
        <div className="container hero-content">
         

          <h1>
            Prepare-se para{' '}
            <span className="highlight-purple">concursos</span>{' '}
            <span className="highlight-blue">públicos</span>
            <br />
            com inteligência artificial
          </h1>

          <p>
            Análise automática de editais, cronogramas personalizados e questões
            geradas por IA. Tudo que você precisa para ser aprovado.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-primary">
              Começar Agora →
            </Link>
            <button className="btn-outline">Saiba Mais</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
