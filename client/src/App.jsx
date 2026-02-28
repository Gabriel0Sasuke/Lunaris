import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import { toastConfig } from './services/notify';
import { API_URL } from './services/api';

// Componentes
import Header from './components/header'
import Sidebar from './components/sidebar'
import Footer from './components/footer'
import Notifications from './components/notifications'
import { useAuth } from './context/AuthContext.jsx'; // Importe o hook
// Páginas
import Home from './pages/home'
import Login from './pages/login'
import Cadastro from './pages/cadastro'
import Browser from './pages/browser'
import Manga from './pages/manga'
import NotFound from './pages/notFound'
import Perfil from './pages/perfil'
import History from './pages/history'
import Library from './pages/library'
import Config from './pages/config'

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
        <Route path='/browser' element={<Browser />} />
        <Route path='/manga/:id' element={<Manga />} />
        <Route path='/perfil' element={<Perfil />} />
        <Route path='/history' element={<History />} />
        <Route path='/library' element={<Library />} />
        <Route path='/config' element={<Config />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
      <ToastContainer {...toastConfig} />
    </BrowserRouter>
  )
}
export default App

