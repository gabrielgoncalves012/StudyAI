import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "../styles/home.css";
import heroDashboard from "../../public/hero.png";
import { PaymentService } from "../services/Payment/PaymentService";
import { MdOutlineClear } from "react-icons/md";
import { useNavigate } from 'react-router-dom'

/* ─── ícones inline (svg) ──────────────────────────── */
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const ChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const IconUpload = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);
const IconSettings = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconBrain = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
  </svg>
);
const IconBook = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </svg>
);
const IconTarget = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IconRefresh = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);
const IconChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
  </svg>
);
const IconFile = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
  </svg>
);
const IconClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ─── DADOS ───────────────────────────────────────── */
const FAQ_ITEMS = [
  { q: "Como faço o upload do edital?", a: "Basta copiar o link do PDF do edital (Diário Oficial, site da banca) ou fazer upload do arquivo. Nosso sistema extrai automaticamente todo o conteúdo programático." },
  { q: "O sistema funciona para qualquer concurso?", a: "Sim! Concursos federais, estaduais, municipais, tribunais, bancos, polícia — qualquer edital em formato PDF pode ser processado." },
  { q: "Posso alterar meu plano depois?", a: "Sim, você pode fazer upgrade ou downgrade a qualquer momento. A diferença é calculada proporcionalmente." },
  { q: "Como são definidas as revisões?", a: "Usamos um algoritmo baseado na curva do esquecimento de Ebbinghaus, adaptado para seu desempenho em cada matéria." },
  { q: "O StudyAI tem aplicativo mobile?", a: "Ainda não, mas nosso site é totalmente responsivo e funciona perfeitamente no celular." },
];

const BENEFITS = [
  { icon: <IconBook />,    title: "Leitura Automática de Editais",  desc: "Upload do PDF e extraímos todo o conteúdo programático automaticamente." },
  { icon: <IconTarget />,  title: "Priorização Inteligente",         desc: "Mais tempo para matérias com maior peso no edital do seu concurso." },
  { icon: <IconRefresh />, title: "Revisões Espaçadas",              desc: "Baseado na curva do esquecimento de Ebbinghaus para retenção máxima." },
  { icon: <IconChart />,   title: "Analytics de Desempenho",         desc: "Veja seu progresso em cada matéria com relatórios detalhados." },
  { icon: <IconFile />,    title: "Questões de concurso",      desc: "500k+ questões atualizadas geradas por IA." },
  { icon: <IconClock />,   title: "Cronograma semanal",              desc: "Saiba quais dias estudar quais materias" },
];

const POPULAR = [
  "TRF (Tribunal Regional Federal)",
  "Banco do Brasil",
  "Caixa Econômica",
  "Polícia Federal",
  "Receita Federal",
];

/* ─── COMPONENTE FAQ ──────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button className="faq-btn" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <ChevronDown />
      </button>
      <div className="faq-body"><p>{a}</p></div>
    </div>
  );
}

const paymentService = new PaymentService()

/* ─── PÁGINA PRINCIPAL ────────────────────────────── */
export default function Home() {
  const [heroInput,   setHeroInput]   = useState("");
  const [editalInput, setEditalInput] = useState("");
  const [plan, setPlan] = useState()

  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const myPlan = await paymentService.returnPlanActual()
      setPlan(myPlan)
      return await paymentService.findAllPlans()
    }
  })

  const navigatePage = (data) => {

    localStorage.setItem('destino', JSON.stringify(data))
    console.log("data")
  
    navigate(`/login`)
  
  }

  return (
    <div className="min-h-screen home">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="hero-section gradient-hero">
        <div className="hero-bg gradient-radial-grid" />

        <div className="hero-content">
          <div className="container">
            <div className="hero-grid">

              {/* esquerda */}
              <div className="hero-left animate-fade-up">

                {/* badge */}
                <div className="hero-badge">
                  <span className="hero-badge-dot animate-pulse" />
                  <span className="hero-badge-text">
                    Novo: Leitura automática de editais com IA
                  </span>
                </div>

                {/* título */}
                <h1 className="hero-title">
                  Estude com <span className="text-gradient">Inteligência</span> para Concurso
                </h1>

                {/* subtítulo */}
                <p className="hero-sub">
                  O StudyAI cria cronogramas personalizados baseados no edital do seu
                  concurso, sua rotina e desempenho.
                </p>

                {/* input + CTA */}
                <div className="hero-input-row">
                  <input
                    type="text"
                    className="hero-input"
                    placeholder="Cole o link do edital ou selecione o concurso..."
                    value={heroInput}
                    onChange={e => setHeroInput(e.target.value)}
                  />
                  <button className="btn-cta gradient-cta" onClick={() => navigatePage('/dashboard')}>
                    GERAR MEU CRONOGRAMA
                  </button>
                </div>

                {/* trust */}
                <div className="hero-trust">
                  <span>✓ Suporte</span>
                  <span>✓ Planos gratuito</span>
                  <span>✓ Cancela quando quiser</span>
                </div>
              </div>

              {/* direita — imagem */}
              <div className="hero-right animate-float">
                <img
                  src={heroDashboard}
                  alt="Dashboard do StudyAI mostrando cronograma de estudos"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EDITAL
      ══════════════════════════════════════════ */}
      <section className="section-edital" id="edital">
        <div className="container">
          <h2 className="section-title">Comece pelo Edital</h2>
          <p className="section-sub">
            Cole o link do PDF do edital ou escolha um dos concursos mais populares
          </p>

          <div className="edital-grid">
            {/* card 1 */}
            <div className="edital-card">
              <div className="edital-card-header">
                <span className="edital-step">1</span>
                <h3>Cole o link do edital (PDF)</h3>
              </div>
              <input
                type="text"
                className="edital-input"
                placeholder="https://exemplo.com/edital.pdf"
                value={editalInput}
                onChange={e => setEditalInput(e.target.value)}
              />
              <button className="btn-cta-full gradient-cta" onClick={() => navigatePage('/dashboard')}>Analisar Edital →</button>
            </div>

            {/* card 2 */}
            <div className="edital-card">
              <div className="edital-card-header">
                <span className="edital-step">2</span>
                <h3>Ou selecione um concurso popular</h3>
              </div>
              <div className="edital-list">
                {POPULAR.map(p => (
                  <button key={p} className="edital-list-btn">{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMO FUNCIONA
      ══════════════════════════════════════════ */}
      <section className="section-how" id="como-funciona">
        <div className="container">
          <h2 className="section-title">Como Funciona</h2>
          <p className="section-sub">Em 3 passos simples, tenha seu cronograma personalizado</p>

          <div className="how-grid">
            {[
              { icon: <IconUpload />,   step: "PASSO 01", title: "Upload do Edital",        desc: "Nosso sistema lê automaticamente o edital e identifica todas as matérias, pesos e conteúdos programáticos." },
              { icon: <IconSettings />, step: "PASSO 02", title: "Configure sua Rotina",     desc: "Informe horas disponíveis, dias da semana, matérias prioritárias e nível de conhecimento." },
              { icon: <IconBrain />,    step: "PASSO 03", title: "Receba seu Cronograma IA", desc: "Um plano de estudos completo com ciclos de revisão, questões sugeridas e acompanhamento." },
            ].map(item => (
              <div key={item.step} className="how-item">
                <div className="how-icon">{item.icon}</div>
                <div className="how-step">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BENEFÍCIOS
      ══════════════════════════════════════════ */}
      <section className="section-benefits" id="beneficios">
        <div className="container">
          <h2 className="section-title">
            Tudo que você precisa para{" "}
            <span className="text-gradient">passar no concurso</span>
          </h2>
          <p className="section-sub">
            Ferramentas inteligentes que transformam sua rotina de estudos
          </p>

          <div className="benefits-grid">
            {BENEFITS.map(b => (
              <div key={b.title} className="benefit-card">
                <div className="benefit-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DEMO
      ══════════════════════════════════════════ */}
      <section className="section-demo" id="demo">
        <div className="container">
          <h2 className="section-title">Veja o StudyAI em ação</h2>
          <p className="section-sub">
            Dashboard intuitivo com tudo que você precisa para organizar seus estudos
          </p>

          <div className="demo-wrapper">
            <div className="demo-browser">
              <div className="demo-browser-bar">
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  <span className="demo-dot demo-dot-r" />
                  <span className="demo-dot demo-dot-y" />
                  <span className="demo-dot demo-dot-b" />
                </div>
                <div className="demo-url">app.studyai.com.br/dashboard</div>
              </div>
              <img src={heroDashboard} alt="Preview do dashboard StudyAI" loading="lazy" />
            </div>

            <div className="demo-stats">
              {[
                { strong: "Matérias organizadas",  span: "Por peso do edital" },
                { strong: "Progresso semanal",      span: "Acompanhe em tempo real" },
                { strong: "Checklist diário",       span: "Nunca perca o foco" },
              ].map(s => (
                <div key={s.strong} className="demo-stat">
                  <strong>{s.strong}</strong>
                  <span>{s.span}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PREÇOS
      ══════════════════════════════════════════ */}
      <section className="section-pricing" id="precos">
        <div className="container">
          <h2 className="section-title">Planos e Preços</h2>
          <p className="section-sub">Planos que cabem no seu bolso</p>

          <div className="pricing-grid">
            {data && data.map((p, i) => {

              const features = JSON.parse(p.resources)
              const isMyPlan = p.id == plan.id


              return (
                <div className={`pricing-card ${i === 1 ? "featured" : ""}`} key={p.id}>
                  {i === 1 && <div className="pricing-badge gradient-cta">Mais popular</div>}
                  <h3>{p.name}</h3>
                  <div><span className="pricing-price">R$ {String(Number(p.price).toFixed(2)).replace(".", ",")}</span><span className="pricing-period">/mês</span></div>
                  <ul className="pricing-features">
                    <li >{features.cronogramAccess == true ? <><CheckIcon /> Acesso aos cronogramas</>  : (<><MdOutlineClear color="red"/> Sem acesso aos cronogramas</>)}</li>
                    <li>{features.cronogramAmount > 0 ? <CheckIcon /> : <MdOutlineClear color="red"/>}{ features.cronogramAmount == 0 ? "Não gera cronogramas" : features.cronogramAmount == 1 ? `${features.cronogramAmount} cronograma/mês` : `${features.cronogramAmount} cronogramas/mês` } </li>
                    <li><CheckIcon/> {features.questionAmount} Questionarios por mês </li>
                  </ul>
                  {isMyPlan ? <button disabled className="btn-outline" onClick={() => navigatePage('/usuario/planos')}>Seu plano atual</button> : <button className="btn-outline" onClick={() => navigatePage('/usuario/planos')}>Adiquirir</button> }
                </div>
              )

            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════ */}
      <section className="section-faq" id="faq">
        <div className="container">
          <h2 className="section-title">Perguntas Frequentes</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map(item => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════ */}
      <section className="section-cta-final gradient-hero">
        <div className="hero-bg gradient-radial-grid cta-bg" />
        <div className="container cta-content">
          <h2>Pronto para transformar seus estudos?</h2>
          <p>Mais de 5.000 concurseiros já estão usando o StudyAI. Comece grátis agora.</p>
          <div className="cta-btns">
            <button className="btn-cta gradient-cta" style={{ padding: "1rem 2rem", fontSize: "1rem", fontWeight: 700 }}>
              QUERO TESTAR GRÁTIS
            </button>
            <button className="btn-outline-light">VER CONCURSOS DISPONÍVEIS</button>
          </div>
          <p className="cta-note">Sem pegadinhas. 7 dias grátis, cancela quando quiser.</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <div className="footer-logo gradient-cta">S</div>
                <span>StudyAI</span>
              </div>
              <p className="footer-desc">
                Estudo inteligente para concursos públicos. Cronogramas personalizados com IA
                para maximizar sua aprovação.
              </p>
              <div className="footer-social">
                {["Instagram","YouTube","TikTok","LinkedIn"].map(s => (
                  <a key={s} href="#">{s}</a>
                ))}
              </div>
            </div>

            <div className="footer-col">
              <h4>Produto</h4>
              <ul>
                {["Sobre","Como funciona","Preços","Blog"].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Suporte</h4>
              <ul>
                {["Ajuda","Termos","Privacidade"].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>StudyAI © 2026 — Estudo inteligente para concursos</p>
          </div>
        </div>
      </footer>

    </div>
  );
}