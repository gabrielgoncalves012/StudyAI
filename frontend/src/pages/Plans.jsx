import '../styles/plans.css';

const plans = [
  {
    name: 'Básico',
    price: 'R$ 29',
    desc: 'Ideal para quem está começando.',
    features: ['1 usuário', '5 GB de armazenamento', 'Suporte por e-mail', 'Relatórios básicos'],
    featured: false,
  },
  {
    name: 'Profissional',
    price: 'R$ 79',
    desc: 'Para equipes que precisam de mais.',
    features: ['5 usuários', '50 GB de armazenamento', 'Suporte prioritário', 'Relatórios avançados', 'Integrações'],
    featured: true,
  },
  {
    name: 'Empresarial',
    price: 'R$ 199',
    desc: 'Solução completa para empresas.',
    features: ['Usuários ilimitados', '500 GB de armazenamento', 'Suporte 24/7', 'API dedicada', 'SLA garantido'],
    featured: false,
  },
];

const invoices = [
  { id: 1, plan: 'Profissional', date: '25/01/2026', amount: 'R$ 79,00' },
  { id: 2, plan: 'Profissional', date: '25/12/2025', amount: 'R$ 79,00' },
  { id: 3, plan: 'Profissional', date: '25/11/2025', amount: 'R$ 79,00' },
  { id: 4, plan: 'Básico', date: '25/10/2025', amount: 'R$ 29,00' },
  { id: 5, plan: 'Básico', date: '25/09/2025', amount: 'R$ 29,00' },
];

const Plans = () => {
  return (
    <div className="plans-page">
      <h1>Escolha seu plano</h1>
      <p className="subtitle">Planos flexíveis que crescem com você</p>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.name} className={`plan-card${plan.featured ? ' featured' : ''}`}>
            {plan.featured && <span className="plan-badge">Mais popular</span>}
            <h2>{plan.name}</h2>
            <div className="plan-price">
              {plan.price}<span>/mês</span>
            </div>
            <p className="plan-desc">{plan.desc}</p>
            <ul className="plan-features">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button className={`plan-btn ${plan.featured ? 'primary' : 'outline'}`}>
              Assinar agora
            </button>
          </div>
        ))}
      </div>

      <div className="invoices-section">
        <h2>Faturas pagas</h2>
        <div className="invoices-list">
          {invoices.map((inv) => (
            <div key={inv.id} className="invoice-item">
              <div className="invoice-left">
                <span className="invoice-plan">Plano {inv.plan}</span>
                <span className="invoice-date">{inv.date}</span>
              </div>
              <div className="invoice-right">
                <span className="invoice-amount">{inv.amount}</span>
                <span className="invoice-status">Pago</span>
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
