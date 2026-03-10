import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import { QueryApp } from './context/QueryClient'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryApp>
      <App />
    </QueryApp>
  </React.StrictMode>
)
