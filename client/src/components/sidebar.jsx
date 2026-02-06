// React
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// CSS
import '../assets/styles/sidebar.css';

// Ícones
import close from '../assets/ui/close.svg';
import person from '../assets/ui/person.svg';
import settings from '../assets/ui/settings.svg';
import library from '../assets/ui/library.svg';
import history from '../assets/ui/history.svg';
import logoutIcon from '../assets/ui/logout.svg';

import profileIcon from '../assets/icons/profile.svg';

//Services
import { notify } from '../services/notify';
import { API_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Sidebar( { isSidebarOpen, setIsSidebarOpen } ) {
    const { usuario, setUsuario } = useAuth();
    const navigate = useNavigate();
    
    function link(path) {
        navigate(path);
        setIsSidebarOpen(false);
    }
    const handleLogout = async () => {
        try {
          const resposta = await fetch(`${API_URL}/auth/logout`, { credentials: 'include' });
          if (resposta.ok) {
            const data = await resposta.json();
            notify.success(data.message);
            setUsuario(null);
            setIsSidebarOpen(false);
          } else {
            const data = await resposta.json();
            notify.error(data.message);
          }
        } catch (error) {
          console.error(error);
          notify.error('Erro ao fazer logout');
        }
    }
    return (
        <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>

            <div className='exit' onClick={() => setIsSidebarOpen(false)}>
                <img src={close} onContextMenu={(e) => e.preventDefault()} />
            </div>
            
            <div className='profile_info'>
                <div className='section'>
                    <div className='profileZoom'><img  src={profileIcon} onContextMenu={(e) => e.preventDefault()} /></div>
                    <div className='card'>Nv. {usuario ? usuario.nivel : 0}</div>
                </div>
                <h3>{usuario ? usuario.username : "Nome do Usuario"}</h3>
                <h4>{usuario ? usuario.titulo : "Leitor Não Verificado"}</h4>
            </div>
                <div className='linha'></div>
            <div className='buttons'>
                {usuario ? (
                    <button className='SideButton'><img src={person} alt="Meu Perfil" /> Meu Perfil</button>
                ) : (
                    <button className='SideButton' onClick={() => link('/login')}><img src={person} alt="Faça Login ou Cadastre-se" /> Login/Cadastro</button>
                )}
                <button className='SideButton'><img src={library} alt="Minha Biblioteca" /> Minha Biblioteca</button>
                <button className='SideButton'><img src={history} alt="Histórico" /> Histórico</button>
                <button className='SideButton'><img src={settings} alt="Configurações" /> Configurações</button>
            </div>
                {usuario ? <div className='linha' id='exitLinha'></div> : ""}
            {usuario ? <button className='ExitButton' onClick={handleLogout}><img src={logoutIcon} alt="Log-Out" /> Log-Out</button>
            : ""}

            <div className='blankScreen' onClick={() => setIsSidebarOpen(false)}></div>
        </div>
    );
}

export default Sidebar;