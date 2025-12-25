import { Emoji } from 'emoji-picker-react'
import '../styles/card.css'

export default function Card({id, title, date, code, icon, color }) {
  return (
    <div className="card" key={id}>
      <div className='card-content' style={{backgroundColor: color}}>

      </div>
      {icon && <div className="card-icon">{icon}</div>}
      {code && <div className='card-emoji'><Emoji unified={code} size={24} /></div>}
        <h3 className="card-title">{title}</h3>
        <p>{date}</p>
    </div>
  )
}