import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoTimeOutline } from "react-icons/io5";
import '../styles/dashboard.css'
import Card from '../components/Card';
import EmojiPicker, { Emoji } from 'emoji-picker-react';
import { IoMdAdd } from "react-icons/io";
import { FaBars, FaTimes } from 'react-icons/fa'; // Font Awesome
import { CiUser } from "react-icons/ci";
import Modal from '../components/Modal';
import { CronogramaService } from '../services/CronogramaService/CronogramService';
import { useQuery } from '@tanstack/react-query';
import UserMenuComponent from '../components/UserMenuComponent';

const cronogramaService = new CronogramaService();
const COLORS = ["43aa8b", "b1a7a6", "f2cd00", "161a1d", "1961ae", "61007d"];

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [cronogramDeleteId, setCronogramDeleteId] = useState()
  const [cronogramSending, setCronogramSending] = useState(false)
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [cargoArea, setCargoArea] = useState("")
  const [horasDiarias, setHorasDiarias] = useState(0)
  const [colorSelected, setColorSelected] = useState(COLORS[0])
  const [emojCode, setEmojiCode] = useState()
  const [messageFormIncomplete, setMessageFormIncomplete] = useState(false)
  const [responseCronograma, setResponseCronograma] = useState()

  const navigate = useNavigate()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cronogramas'],
      queryFn: async () => {
        const cronogramaService = new CronogramaService();
        return await cronogramaService.findAllCronogramas()
      }
  })

  const handleCraateCronograma = async (e) => {

    console.log()

    e.preventDefault();

    if((file === null && url === "") || title === "" || cargoArea === "" || horasDiarias === 0 || colorSelected === "" || emojCode === "") {
      setMessageFormIncomplete(true)
      return
    }

    setCronogramSending(true)
    const formData = new FormData();
    formData.append('file', file);
    if (url !== "") {
      formData.append('url', url); 
    }
    formData.append('concurso', title);
    formData.append('cargo_area', cargoArea);
    formData.append('horasDiarias', horasDiarias);
    formData.append('colorCode', colorSelected);
    formData.append('emojCode', emojCode);
    
    const cronogramaRes = await cronogramaService.createCronograma(formData)
      if (cronogramaRes.status === 403) {
        setResponseCronograma(cronogramaRes)
        return
      }
  
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
      {(cronogramSending) ? (<>{modalOpen && (
        <>
        <div className="modal-overlay" onClick={() => {setModalOpen(false); setCronogramSending(false)}}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => {setModalOpen(false); setCronogramSending(false)}}>
              ✕
            </button>
            {responseCronograma ? (
              <>
                <h2>{responseCronograma.data.message}</h2>
                <div style={{width: "100%", height: "1px", backgroundColor: "gray"}}></div>
                <p>{responseCronograma.data.description}</p>
                <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                  <button onClick={() => navigate('/usuario/planos')} >Alterar plano</button>
                </div>
              </>
            ): (
              <>
                <h2>Gerando Cronograma...</h2>
                <div style={{width: "100%", height: "1px", backgroundColor: "gray"}}></div>
                <p>Isso pode levar até 5 minutos, dependendo do tamanho do edital. Aguarde...</p>
              </>
            )}
          </div>
        </div>

        </>
      )}</>) : (
        <>

        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                ✕
              </button>
              <h2>Criar novo cronograma</h2>

              <form className="modal-form" onSubmit={handleCraateCronograma}>
                {/* File upload */}
                <div className="form-group">
                  <label>Arquivo do edital</label>
                  <div className={`file-upload-area${file ? " has-file" : ""}`}>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0] || null)}
                    />
                    <div className="file-upload-icon">📄</div>
                    <div className="file-upload-text">
                      {file ? "" : <>Clique ou arraste para <strong>enviar arquivo</strong></>}
                    </div>
                    {file && <div className="file-name">{file.name}</div>}
                  </div>
                </div>

                {/* URL */}
                <div className="form-group">
                  <label>URL do edital</label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com/edital.pdf"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                {/* Nome */}
                <div className="form-group">
                  <label>Nome do cronograma</label>
                  <input
                    type="text"
                    placeholder="Ex: Concurso INSS 2025"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Cargo */}
                <div className="form-group">
                  <label>Nome exato do cargo</label>
                  <input
                    type="text"
                    placeholder="Ex: Técnico do Seguro Social"
                    value={cargoArea}
                    onChange={(e) => setCargoArea(e.target.value)}
                  />
                </div>

                {/* Horas */}
                <div className="form-group">
                  <label>Horas disponíveis para estudar</label>
                  <input
                    type="number"
                    placeholder="Ex: 4"
                    min="1"
                    value={horasDiarias}
                    onChange={(e) => setHorasDiarias(e.target.value)}
                  />
                </div>

                {/* Cores */}
                <div className="form-group">
                  <label>Cor do cronograma</label>
                  <div className="color-options">
                    {COLORS.map((c) => (
                      <div
                        key={c}
                        className={`color-circle${colorSelected === c ? " selected" : ""}`}
                        style={{ backgroundColor: `#${c}` }}
                        onClick={() => setColorSelected(c)}
                      />
                    ))}
                  </div>
                </div>

                {/* Emoji */}
                <div className="form-group emoji-section">
                  <label>Emoji</label>
                  <button
                    type="button"
                    className="emoji-toggle-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    {emojCode ? (
                      <span className="emoji-selected">{emojCode}</span>
                    ) : (
                      "😀 Escolher emoji"
                    )}
                  </button>
                  {showEmojiPicker && (
                    <div className="emoji-picker-wrapper">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          setEmojiCode(emojiData.emoji);
                          setShowEmojiPicker(false);
                        }}
                        width="100%"
                        height={350}
                        searchPlaceholder="Buscar emoji..."
                        previewConfig={{ showPreview: false }}
                      />
                    </div>
                  )}
                </div>

                <button type="submit" className="submit-btn">
                  Gerar
                </button>

                {messageFormIncomplete && (
                <p className="error-message" style={{ color: 'red' }}>
                  Por favor, preencha todos os campos.
                </p>
                )}
              </form>
            </div>
          </div>
        )}
        
        </>
      )}
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
          <UserMenuComponent/>

          
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
              {error && <p></p>}
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
