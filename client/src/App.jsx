import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import { toastConfig } from './utils/notify';
import { API_URL } from './api/config';

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

// Páginas de Erro ou Loading Global
import BootScreen from './pages/bootScreen/bootScreen.jsx';
import ServerOrInternetError from './pages/serverOrInternetError/serverOrInternetError.jsx';

function App() {
  // Verificar se o client tem conexão com o servidor
  const [serverIsLoading, setServerIsLoading] = useState(true);
  const [serverIsOnline, setServerIsOnline] = useState(false);

  useEffect(() => {
    const retryDelays = [0, 3000, 10000];
    let cancelled = false;

    const wait = (ms) => new Promise((resolve) => {
      const timer = setTimeout(resolve, ms);
      if (cancelled) {
        clearTimeout(timer);
      }
    });

    const checkServerConnection = async () => {
      for (const delay of retryDelays) {
        if (cancelled) return;

        if (delay > 0) {
          await wait(delay);
          if (cancelled) return;
        }

        const abortController = new AbortController();
        const requestTimeout = setTimeout(() => abortController.abort(), 6000);

        try {
          const response = await fetch(`${API_URL}/system/online`, {
            method: 'GET',
            credentials: 'include',
            signal: abortController.signal,
          });

          if (response.ok) {
            if (cancelled) return;
            setServerIsOnline(true);
            setServerIsLoading(false);
            return;
          }
        } catch {
          // Tenta novamente até acabar as 3 tentativas.
        } finally {
          clearTimeout(requestTimeout);
        }
      }

      if (!cancelled) {
        setServerIsOnline(false);
        setServerIsLoading(false);
      }
    };

    checkServerConnection();

    return () => {
      cancelled = true;
    };
  }, []);

  // Controlar Abertura do Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  //Controlar Abertura do Notifications
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // O AuthContext agora gerencia o usuário!
  const { usuario } = useAuth();
  
  useEffect(() => {
    // Se estiver logado, atualiza o status online.
    if (!usuario?.id) return;

    const atualizarOnline = async () => {
      try {
        const resposta = await fetch(`${API_URL}/auth/online`, {
          method: 'POST',
          credentials: 'include',
        });

        const data = await resposta.json();

        if (!resposta.ok) {
          console.error(data?.message || 'Erro ao atualizar status online.');
          return;
        }

        console.log(data?.message || 'Status atualizado.');
      } catch (error) {
        console.error('Falha ao atualizar status online:', error);
      }
    };

    atualizarOnline();
  }, [usuario]);
  return (
    serverIsLoading ? (
      <BootScreen />
    ) : serverIsOnline ? (
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
    ) : (
      <ServerOrInternetError />
    )
  )
}
export default App

