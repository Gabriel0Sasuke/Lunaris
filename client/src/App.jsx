import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import { toastConfig } from './utils/notify';
import { API_URL } from './api/config';
import { notify } from './utils/notify'

// Componentes
import Header from './components/header'
import Sidebar from './components/sidebar'
import Footer from './components/footer'
import Notifications from './components/notifications'
import { useAuth } from './context/AuthContext.jsx'; 
import PrivateRoutes from './routes/PrivateRoutes.jsx';
import PublicRoutes from './routes/PublicRoute.jsx';
// Páginas
import Home from './pages/home'
import Login from './pages/login'
import Cadastro from './pages/cadastro'
import Browser from './pages/browser'
import Manga from './pages/manga'
import NotFound from './pages/notFound'
import Forbidden from './pages/forbidden'
import AuthRequired from './pages/authRequired'
import Perfil from './pages/perfil'
import History from './pages/history'
import Library from './pages/library'
import Config from './pages/config'
import Admin from './pages/admin'
import Scan from './pages/scan'
import Community from './pages/community'

function App() {
  // Controlar Abertura do Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  //Controlar Abertura do Notifications
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // O AuthContext agora gerencia o usuário!
  const { usuario } = useAuth();
  
  //Função pra atualizar o estado online do usuario
  const atualizarOnline = async () => {
    if (!usuario?.id) return;

    try {
      const resposta = await fetch(`${API_URL}/auth/online`, {
        method: 'POST',
        credentials: 'include',
      });
      let data = null;
      try {
        data = await resposta.json();
      } catch {}

      if (!resposta.ok) {
        console.error(data?.message || 'Erro ao atualizar status online.');
        return;
      }

      console.log(data?.message || 'Status atualizado.');
    } catch (error) {
      console.error('Falha ao atualizar status online:', error);
    }
  }
  useEffect(() => {
    // Se Estiver logado, atualizar seu status
    if(usuario != null){
      atualizarOnline();
    }else{
      return
    }
  }, [usuario]);
  return (
    <BrowserRouter>
      <Header setIsSidebarOpen={setIsSidebarOpen} setIsNotificationsOpen={setIsNotificationsOpen} isNotificationsOpen={isNotificationsOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Notifications isNotificationsOpen={isNotificationsOpen} />
      <Routes>
        {/* Rotas Públicas (Acessíveis a Todos) */}
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/browser' element={<Browser />} />
        <Route path='/manga/:id' element={<Manga />} />
        <Route path='/403' element={<Forbidden />} />

        {/* Rotas Públicas (Somente para Não-Logados) */}
        <Route element={<PublicRoutes />}>
          <Route path='/login' element={<Login />} />
          <Route path='/cadastro' element={<Cadastro />} />
          <Route path='/auth-required' element={<AuthRequired />} />
        </Route>

        {/* Rotas Privadas (Somente para Usuários Logados) */}
        <Route element={<PrivateRoutes />}>
          <Route path='/community' element={<Community />} />
          <Route path='/perfil' element={<Perfil />} />
          <Route path='/history' element={<History />} />
          <Route path='/library' element={<Library />} />
          <Route path='/config' element={<Config />} />
        </Route>
        
        {/* Rotas Privadas (Somente para Admins e Scanlators) */}
        <Route element={<PrivateRoutes AllowedRoles={['admin', 'scan']} />}>
          <Route path='/scan' element={<Scan />} />
        </Route>

          {/* Rotas Privadas (Somente para Admins) */}
        <Route element={<PrivateRoutes AllowedRoles={['admin']} />}>
          <Route path='/admin' element={<Admin />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
      <ToastContainer {...toastConfig} />
    </BrowserRouter>
  )
}
export default App

