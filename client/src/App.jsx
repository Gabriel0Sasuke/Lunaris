import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import { toastConfig } from './services/notify';
import { API_URL } from './services/api';

// Componentes
import Header from './components/header.jsx'
import Sidebar from './components/sidebar.jsx'
import Footer from './components/footer.jsx'
import Notifications from './components/notifications.jsx'
// Páginas
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import Cadastro from './pages/cadastro.jsx'
import { useAuth } from './context/AuthContext.jsx'; // Importe o hook

function App() {
  // Controlar Abertura do Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  //Controlar Abertura do Notifications
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // O AuthContext agora gerencia o usuário!
  const { usuario } = useAuth();
  
  return (
    <BrowserRouter>
      <Header setIsSidebarOpen={setIsSidebarOpen} setIsNotificationsOpen={setIsNotificationsOpen} isNotificationsOpen={isNotificationsOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Notifications isNotificationsOpen={isNotificationsOpen} />
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cadastro' element={<Cadastro />} />
        
      </Routes>
      <Footer />
      <ToastContainer {...toastConfig} />
    </BrowserRouter>
  )
}
export default App
