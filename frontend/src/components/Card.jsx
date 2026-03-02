import { Emoji } from 'emoji-picker-react'
import '../styles/card.css'
import { MdClear } from "react-icons/md";

export default function Card({id, title, date, code, icon, color, onClick, onDelete }) {

  function calcularTempoDecorridoPassado(dataString) {
    // Extrair apenas ano, mês e dia
    const [ano, mes, dia] = dataString.split('T')[0].split('-').map(Number);
    
    // Criar datas ignorando horas
    const dataPassada = new Date(ano, mes - 1, dia);
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);
    dataPassada.setHours(0, 0, 0, 0);
    
    // Calcular diferença em dias
    const diferencaMs = dataAtual - dataPassada;
    const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return 'hoje';
    if (dias === 1) return 'ontem';
    if (dias < 30) return `há ${dias} dias`;
    if (dias < 365) {
        const meses = Math.floor(dias / 30);
        return `há ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    }
    const anos = Math.floor(dias / 365);
    return `há ${anos} ${anos === 1 ? 'ano' : 'anos'}`;
}

  function handleDelete(event) {
    event.stopPropagation()
    onDelete()
  }

  return (
    <>
      <div onClick={onClick} className="card" key={id}>
        {icon && <div className='card-content'></div>}
        {icon && <div className="card-icon">{icon}</div>}
        {code && (
          <div className='card-header'>
            <span className="card-emoji">{code}</span>
            
            <div className='card-options'>
              
              <div className='btn-clear' onClick={handleDelete}>
                <MdClear />
              </div>
              
            </div>

          </div>
        )}
          <h3 className="card-title">{title}</h3>
          {!icon && <p>{calcularTempoDecorridoPassado(date)}</p>}
      </div>
    </>
  )
}