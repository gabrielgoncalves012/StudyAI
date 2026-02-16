import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoTimeOutline } from "react-icons/io5";
import '../styles/dashboard.css'
import Card from '../components/Card';
import EmojiPicker, { Emoji } from 'emoji-picker-react';
import { IoMdAdd } from "react-icons/io";
import { FaBars, FaTimes } from 'react-icons/fa'; // Font Awesome
import Modal from '../components/Modal';
import { CronogramaService } from '../services/CronogramaService/CronogramService';
import { useQuery } from '@tanstack/react-query';

const cronogramaService = new CronogramaService();

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [cronogramDeleteId, setCronogramDeleteId] = useState()
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [cronogramSending, setCronogramSending] = useState(false)
  const colors = ["43aa8b", "b1a7a6", "f2cd00", "161a1d", "1961ae", "61007d"]
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState("")
  const [cargoArea, setCargoArea] = useState("")
  const [horasDiarias, setHorasDiarias] = useState(0)
  const [colorSelected, setColorSelected] = useState(colors[0])
  const [emojCode, setEmojiCode] = useState("1f3e6")

  const navigate = useNavigate()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cronogramas'],
      queryFn: async () => {
        const cronogramaService = new CronogramaService();
        return await cronogramaService.findAllCronogramas()
      }
  })

  const handleCraateCronograma = async () => {
    setCronogramSending(true)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('concurso', title);
    formData.append('cargo_area', cargoArea);
    formData.append('horasDiarias', horasDiarias);
    formData.append('colorCode', colorSelected);
    formData.append('emojCode', emojCode);
    
    const res = await cronogramaService.createCronograma(formData)
    console.log(res)
    setModalOpen(false)
    setCronogramSending(false)
    refetch()
  }

  const handleDeleteCronograma = (id) => {
    setCronogramDeleteId(id)
    setModalDeleteOpen(true)
  }

  const confirmDeleteCronogram = async () => {
    await cronogramaService.deleteCronograma(cronogramDeleteId)
    setCronogramDeleteId("")
    setModalDeleteOpen(false)
    refetch()
  }
   
  return (
    <div className={`app-container ${menuOpen ? 'menu-open' : ''}`}>
      <Modal isOpen={modalDeleteOpen} onClose={() => setModalDeleteOpen(false)}>
        <div className='modal-delete'>
          <h2>Tem certeza de que deseja excluir o cronograma?</h2>
          <div className='buttons'>
            <button onClick={confirmDeleteCronogram}>Confirmar</button>
            <button style={{backgroundColor: "red"}} onClick={() => {
              setCronogramDeleteId("")
              setModalDeleteOpen(false)
            }}>Cancelar</button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {cronogramSending ? (
          <div className='cronogram-sending'>
            <h2>Gerando Cronograma...</h2>
            <p>Isso pode levar um tempo, dependendo do tamanho do edital. Aguarde...</p>
          </div>
        ): (        
          <div className='form-cronograma'>
            <h2>Criar Novo Cronograma</h2>

            <div className='form-group'>
              <label>Edital</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
            </div>

            <div className='form-group'>
              <label>Nome do Cronograma</label>
              <input placeholder="Ex: Cronograma para Polícia Federal" onChange={(e) => setTitle(e.target.value)}/>
            </div>

            <div className='form-group'>
              <label>Nome exato do cargo</label>
              <input placeholder="Ex: Agente" onChange={(e) => setCargoArea(e.target.value)}/>
            </div>

            <div className='form-group'>
              <label>Quantidade de horas por dia de estudo</label>
              <input placeholder="Ex: Cronograma para Polícia Federal" type='number' onChange={(e) => setHorasDiarias(e.target.value)}/>
            </div>

            <div className='color-picker'>
                <label>Cor do Cronograma</label>
                <div className='color-options'>
                  {colors.map(color => (
                  <div key={color} className='color-option' style={{backgroundColor: `#${color}`, color: `#${color}`, border: color === colorSelected ? '4px solid black' : 'none'}} onClick={() => setColorSelected(color)}> .</div>
                ))}
                </div>
            </div>

            <div>
              <label>Emoji</label>

              <button onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}>
                {emojiPickerOpen ? <EmojiPicker onEmojiClick={(emoji) => {
                  setEmojiCode(emoji.unified)
                  setEmojiPickerOpen(false)
                }} /> : <Emoji unified={emojCode} size={24} />}
              </button>
              
            </div>

            <button className="btn-primary" onClick={handleCraateCronograma}>
              Criar Cronograma
            </button>
          </div>
        )}
      </Modal>

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
            <FaBars size={24} />
          </button>

          
        </header>

        {/* Conteúdo */}
        <div className="dashboard">
          <div className="dashboard-header">
            <div>
              <h1>Olá, Estudante!👋</h1>
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
                <Card icon={<IoMdAdd color='#6b7280'/>} title={"Novo Conograma"} onClick={() => setModalOpen(true)} color={"#7c4dff"} date={""}/>
              </li>

              {isLoading && <p>Carregando cronogramas...</p>}
              {error && <p>Erro ao carregar cronogramas: {error.message}</p>}
              {data && data.map(cronograma => (
                <li key={cronograma.id} className='recent-item'>
                  <Card code={cronograma.emojCode} title={cronograma.concurso} color={`#${cronograma.colorCode}`} date={cronograma.accessDate} onClick={() => navigate(`/cronograma/${cronograma.id}`)} onDelete={()=> handleDeleteCronograma(cronograma.id)}/>
                </li>
              ))}

            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
