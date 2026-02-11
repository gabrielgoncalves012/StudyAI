import { Emoji } from 'emoji-picker-react'
import '../styles/card.css'

export default function Card({id, title, date, code, icon, color, onClick }) {

  function calcularTempoDecorrido(dataString) {
    // Converter a string da data para objeto Date
    const dataPassada = new Date(dataString);
    const dataAtual = new Date();
    
    // Calcular diferença em milissegundos
    const diferencaMs = dataAtual - dataPassada;
    
    // Calcular diferenças básicas
    const segundos = Math.floor(diferencaMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    // Calcular meses e anos aproximados
    const anos = Math.floor(dias / 365);
    const meses = Math.floor(dias / 30.44); // Média de dias por mês
    const mesesRestantes = Math.floor((dias % 365) / 30.44);
    
    // Decidir a melhor unidade para exibir
    if (dias < 30) {
        return `${dias} ${dias === 1 ? 'dia' : 'dias'} atrás`;
    } else if (dias < 365) {
        if (meses === 1) {
            return `1 mês atrás`;
        } else {
            return `${meses} meses atrás`;
        }
    } else {
        if (anos === 1) {
            return `1 ano atrás`;
        } else {
            // Formato mais detalhado para anos completos
            return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'} atrás`;
        }
    }
  }

  return (
    <div onClick={onClick} className="card" key={id}>
      <div className='card-content' style={{backgroundColor: color}}>

      </div>
      {icon && <div className="card-icon">{icon}</div>}
      {code && <div className='card-emoji'><Emoji unified={code} size={24} /></div>}
        <h3 className="card-title">{title}</h3>
        <p>{calcularTempoDecorrido(date)}</p>
    </div>
  )
}