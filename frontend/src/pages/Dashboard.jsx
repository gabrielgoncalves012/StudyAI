import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "../styles/dashboard.css";
import { useQuery } from "@tanstack/react-query";
import { CronogramaService } from '../services/CronogramaService/CronogramService'
import { useNavigate } from 'react-router-dom'
import UserMenuComponent from "../components/UserMenuComponent";
import { UsuarioService } from "../services/Usuario/UsuarioService";

const COLORS = ["#43aa8b", "#b1a7a6", "#f2cd00", "#161a1d", "#1961ae", "#61007d"];

const NEWS = [
  { title: "INSS abre 1.000 vagas para nível médio", date: "01/03/2026", type: "federal"},
  { title: "TJ-SP publica edital com 200 vagas", date: "28/02/2026", type: "estadual"},
  { title: "Prefeitura de BH abre concurso", date: "25/02/2026", type: "municipal"},
  { title: "Receita Federal confirma novo concurso", date: "20/02/2026", type: "federal"},
];

const cronogramaService = new CronogramaService();
const userService = new UsuarioService();

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [fileName, setFileName] = useState("");
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
  const [usuario, setUsuario] = useState()

  const navigate = useNavigate()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cronogramas'],
      queryFn: async () => {
        return await cronogramaService.findAllCronogramas()
      },
      staleTime: Infinity,
      gcTime: 24 * 60 * 60 * 1000
  })

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('user') === null) {
        const user = await userService.AboutUser();
        localStorage.setItem('user', JSON.stringify(user));
        setUsuario(user);
      } else {
        const user = JSON.parse(localStorage.getItem('user'));
        setUsuario(user);
      }
    };
  
    fetchUser();
  }, []);

  const handleCraateCronograma = async (e) => {

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
        
        setResponseCronograma(cronogramaRes.data)
        return
      }

      console.log(cronogramaRes)
  
    setModalOpen(false)
    setCronogramSending(false)
    refetch()
  }

  const statusLabel = { active: "Ativo", paused: "Pausado", completed: "Concluído" };
  const statusClass = { active: "status-active", paused: "status-paused", completed: "status-completed" };
  const newsEmoji = { federal: "🇧🇷", estadual: "📍", municipal: "🏘️" };

  return (
    <div className="app-container">
      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            📅 <span>CronoStudy</span>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-link active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Início
          </button>
          <button className="sidebar-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Meus Cronogramas
          </button>
          <button className="sidebar-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Desempenho
          </button>
          <button className="sidebar-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            Configurações
          </button>
        </nav>
        <div className="sidebar-footer">
          <p className="sidebar-footer-text">CronoStudy v1.0 © 2026</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
            </button>
            <h1 className="header-title" style={{margin: 0}}>📅 StudyAi</h1>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span className="notification-badge" />
            </button>
            <UserMenuComponent name={usuario && String(usuario.user.name)}>
              <div className="user-menu">
                <div className="user-avatar">{usuario && String(usuario.user.name).slice(0, 1)}</div>
                <div className="user-info">
                  <span className="user-name">{usuario && String(usuario.user.name)}</span>
                  <span className="user-role">Plano {usuario && String(usuario.plan.plan.name)}</span>
                </div>
              </div>
            </UserMenuComponent>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {/* Section Header */}
          <div className="section-header">
            <div >
              <h2 className="section-title" style={{textAlign: "left"}}>Meus Cronogramas</h2>
              <p className="section-subtitle">Gerencie seus cronogramas de estudo para concursos</p>
            </div>
            <button className="btn-create" onClick={() => setModalOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Novo Cronograma
            </button>
          </div>

          {/* Schedule Grid */}
          <div className="schedule-grid">
            {data && data.map((s) => (
              <div className="schedule-card" key={s.id} onClick={() => navigate(`/cronograma/${s.id}`)}>
                <div className="schedule-card-accent" style={{ background: s.colorCode }} />
                <div className="schedule-card-header">
                  <span className="schedule-card-emoji">{s.emojCode}</span>
                  <span className={`schedule-card-status ${statusClass.active}`}>{statusLabel.active}</span>
                </div>
                <h3 className="schedule-card-title">{s.concurso}</h3>
                <p className="schedule-card-cargo">{s.cargo}</p>
                <div className="schedule-card-meta">
                  <span className="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    2h/dia
                  </span>
                  <span className="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                    {s.topicLength} topicos
                  </span>
                  <span className="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {s.date}
                    {new Date(s.dateCreated).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Section */}
          <div className="dashboard-section">
            {/* Stats */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  Resumo de Estudo (Não está funcionando por enquanto)
                </h3>
              </div>
              <div className="dashboard-card-body">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">4</div>
                    <div className="stat-label">Cronogramas</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">15h</div>
                    <div className="stat-label">Horas/dia</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">50</div>
                    <div className="stat-label">Matérias</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">87%</div>
                    <div className="stat-label">Progresso</div>
                  </div>
                </div>
              </div>
            </div>

            {/* News */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2"/></svg>
                  Notícias de Concursos (Não está funcionando por enquanto)
                </h3>
              </div>
              <div className="dashboard-card-body">
                <div className="news-list">
                  {NEWS.map((n, i) => (
                    <div className="news-item" key={i}>
                      <div className={`news-badge ${n.type}`}>{newsEmoji[n.type]}</div>
                      <div className="news-content">
                        <p className="news-title">{n.title}</p>
                        <span className="news-date">{n.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => { setModalOpen(false); setShowEmojiPicker(false); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Criar novo cronograma</h2>
              <button className="modal-close" onClick={() => { setModalOpen(false); setShowEmojiPicker(false); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              {/* File Upload */}
              <div className="form-group">
                <label className="form-label">Arquivo do Edital</label>
                <div className={`file-upload ${fileName ? "has-file" : ""}`}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {setFileName(e.target.files?.[0]?.name || ""); setFile(e.target.files?.[0])}}
                  />
                  <div className="file-upload-icon">{fileName ? "✅" : "📎"}</div>
                  <p className="file-upload-text">
                    {fileName ? "" : <><strong>Clique para enviar</strong> ou arraste o arquivo</>}
                  </p>
                  {fileName && <p className="file-name">{fileName}</p>}
                </div>
              </div>

              {/* URL do Edital */}
              <div className="form-group">
                <label className="form-label">URL do Edital</label>
                <input className="form-input" onChange={(e) => setUrl(e.target.value)} value={url} type="url" placeholder="https://exemplo.com/edital.pdf" />
              </div>

              {/* Nome do Cronograma */}
              <div className="form-group">
                <label className="form-label">Nome do Cronograma</label>
                <input className="form-input" type="text" placeholder="Ex: Concurso INSS 2026" onChange={(e) => setTitle(e.target.value)} value={title} />
              </div>

              {/* Cargo */}
              <div className="form-group">
                <label className="form-label">Nome exato do Cargo</label>
                <input className="form-input" type="text" placeholder="Ex: Técnico do Seguro Social" onChange={(e) => setCargoArea(e.target.value)} value={cargoArea} />
              </div>

              {/* Horas */}
              <div className="form-group">
                <label className="form-label">Horas disponíveis para estudar (por dia)</label>
                <input className="form-input" type="number" placeholder="Ex: 4" min="1" max="16" onChange={(e) => setHorasDiarias(e.target.value)} value={horasDiarias} />
              </div>

              {/* Color Picker */}
              <div className="form-group">
                <label className="form-label">Cor do Cronograma</label>
                <div className="color-picker-grid">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${colorSelected === color ? "selected" : ""}`}
                      style={{ background: color }}
                      onClick={() => setColorSelected(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Emoji Picker */}
              <div className="form-group">
                <label className="form-label">Emoji</label>
                <div className="emoji-picker-container">
                  <button className="emoji-trigger" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <span className="emoji-trigger-icon">{emojCode}</span>
                    <span className="emoji-trigger-text">Clique para escolher um emoji</span>
                  </button>
                  {showEmojiPicker && (
                    <div className="emoji-dropdown">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          setEmojiCode(emojiData.emoji);
                          setShowEmojiPicker(false);
                        }}
                        width={320}
                        height={380}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button className="btn-generate" onClick={handleCraateCronograma}>
                {cronogramSending ? (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}>
                    <style>{`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                  </div>
                ) : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
                {cronogramSending ? <>pode demorar até 5 minutos</>: <>Gerara Cronograma</>}
              </button>

              {messageFormIncomplete && (
                <div className="message-form-incomplete" style={{ color: "red" }}>
                  <p>Por favor, preencha todos os campos obrigatórios.</p>
                </div>
              )}
              {responseCronograma && (
                <div style={{ color: "green" }}>
                  <p>{responseCronograma.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
