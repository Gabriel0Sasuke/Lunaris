import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useState } from 'react'

// Componentes
import Header from './components/header.jsx'
import Sidebar from './components/sidebar.jsx'
// Páginas
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import Cadastro from './pages/cadastro.jsx'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <BrowserRouter>
      <Header setIsSidebarOpen={setIsSidebarOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cadastro' element={<Cadastro />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
