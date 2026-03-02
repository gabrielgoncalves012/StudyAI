import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import Register from './pages/Register'
import SelectConcurso from './pages/SelectConcurso'
import Cronograma from './pages/Cronograma'
import Plans from './pages/Plans'

function App() {

  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/selecionar-concurso" element={<SelectConcurso />} />
        <Route  path='/cronograma/:id' element={<Cronograma/>}/>
        <Route path='/usuario/planos' element={<Plans/>}/>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
