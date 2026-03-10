import '../styles/plans.css';
import { useQuery} from '@tanstack/react-query'
import { PaymentService } from '../services/Payment/PaymentService';
import { MdOutlineClear } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const invoices = [
  { id: 1, plan: 'Profissional', date: '25/01/2026', amount: 'R$ 79,00' },
  { id: 2, plan: 'Profissional', date: '25/12/2025', amount: 'R$ 79,00' },
  { id: 3, plan: 'Profissional', date: '25/11/2025', amount: 'R$ 79,00' },
  { id: 4, plan: 'Básico', date: '25/10/2025', amount: 'R$ 29,00' },
  { id: 5, plan: 'Básico', date: '25/09/2025', amount: 'R$ 29,00' },
];

const paymentService = new PaymentService();

const Plans = () => {

  const [plan, setPlan] = useState()
  const [fatures, setFatures] = useState()
  const [messagePlan, setMessagePlan] = useState()
  const [user, setUsuario] = useState()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['plans'],
      queryFn: async () => {
        if (localStorage.getItem('user') === null) {
          const user = await userService.AboutUser();
          localStorage.setItem('user', JSON.stringify(user));
          setUsuario(user);
        } else {
          const user = JSON.parse(localStorage.getItem('user'));
          setUsuario(user);
        }
        const faturePlan = await paymentService.findPlanAndFatures()
        setFatures(faturePlan.invoices)
        setPlan(faturePlan.plan)
        return await paymentService.findAllPlans()
      },
      staleTime: Infinity
  })

  const navigatePage = useNavigate()

  async function handleCheckouPlan(planId) {

    const data = {
      planId: planId,
      successUrl: "https://www.youtube.com/shorts/KZVOLbxy6TQ",
      cancelUrl: "https://www.youtube.com/watch?v=vTc1chwcLm4"
    }

    const checkout = await paymentService.checkout(data)
    if (checkout.status == "link") {
      navigatePage(checkout.link)
    } else if(checkout.status == "updated") {
      setMessagePlan(checkout.message)
      refetch()
    }

  }

  return (
    <div className="plans-page">
      <h1>Escolha seu plano</h1>
      <p className="subtitle">Planos flexíveis que crescem com você</p>

      {/* Mensagem informando que o plano foi alterado */}
      {messagePlan && (
        <div className="message-plan" style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", padding: "20px"}}>
          <p style={{marginBottom: "20px", color: "green", fontWeight: "bold", fontSize: "20px", textAlign: "center", backgroundColor: "rgba(0, 128, 0, 0.2)", borderRadius: "10px", padding: "10px"}}>{messagePlan}</p>
        </div>
      )}

      <div className="pricing-grid" style={{paddingBottom: "80px"}}>
        {data && data.map((p, i) => {

          const features = JSON.parse(p.resources)
          const isMyPlan = user && user.plan.plan && user.plan.plan.id == p.id //plan && plan.id == p.id

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
              {isMyPlan ? <button disabled className="btn-outline" onClick={() => handleCheckouPlan(p.id)}>Seu plano atual</button> : <button className="btn-outline" onClick={() => navigatePage('/usuario/planos')}>Adiquirir</button> }
            </div>
          )

        })}
      </div>
      <div className="invoices-section">
        <h2>Faturas pagas</h2>
        <div className="invoices-list">
          {user && user.invoices.map((inv) => (
            <div key={inv.id} className="invoice-item">
              <div className="invoice-left">
                <span className="invoice-plan">Plano {inv.name}</span>
                <span className="invoice-date">{inv.date}</span>
              </div>
              <div className="invoice-right">
                <span className="invoice-amount">R$ {String(Number(inv.price).toFixed(2)).replace(".", ",")}</span>
                <span className="invoice-status" style={{color: inv.status !== "pago" && "red"}}>{inv.status}</span>
                <button className="invoice-download">Comprovante</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;
