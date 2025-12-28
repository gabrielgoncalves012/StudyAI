import '../styles/selectConcurso.css'
import { useNavigate } from 'react-router-dom'

function SelectConcurso() {
  const navigate = useNavigate()

  function selecionarConcurso() {
    navigate('/dashboard')
  }

  return (
    <div className="concurso-wrapper">
      <h1>Escolha seu concurso</h1>
      <p className="subtitle">
        Selecione o concurso para montar seu plano de estudos
      </p>

      <div className="concurso-list">
        <div className="concurso-card">
          <h3>INSS</h3>
          <p>Técnico do Seguro Social</p>
          <button onClick={selecionarConcurso}>
            Selecionar
          </button>
        </div>

        <div className="concurso-card">
          <h3>Polícia Federal</h3>
          <p>Agente</p>
          <button onClick={selecionarConcurso}>
            Selecionar
          </button>
        </div>

        <div className="concurso-card">
          <h3>Banco do Brasil</h3>
          <p>Escriturário</p>
          <button onClick={selecionarConcurso}>
            Selecionar
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectConcurso
