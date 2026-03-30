// React
import { useNavigateTo } from '../../hooks/useNavigateTo';
// CSS
import './sidebar.css';

// Ícones
import close from '../../assets/ui/close.svg';
import person from '../../assets/ui/person.svg';
import settings from '../../assets/ui/settings.svg';
import library from '../../assets/ui/library.svg';
import history from '../../assets/ui/history.svg';
import logoutIcon from '../../assets/ui/logout.svg';
import openbook from '../../assets/ui/openbook.svg';
import shield from '../../assets/ui/shield.svg';

import profileIcon from '../../assets/icons/profile.svg';

//Services
import { notify } from '../../utils/notify';
import { API_URL } from '../../api/config';
import { useAuth } from '../../context/AuthContext';
import { calcularXp } from '../../utils/nivelUser';

function Sidebar( { isSidebarOpen, setIsSidebarOpen } ) {
    const { usuario, setUsuario } = useAuth();
    const navigateTo = useNavigateTo();
    const profileImage = usuario?.foto || profileIcon;
    
    function link(path) {
        navigateTo(path);
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
                } catch {
          notify.error('Erro ao fazer logout');
        }
    }
    return (
        <>
        <div className={`blankScreen ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
        <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>

            <div className='exit' onClick={() => setIsSidebarOpen(false)}>
                <img src={close} onContextMenu={(e) => e.preventDefault()} />
            </div>
            
            <div className='profile_info'>
                <div className='section'>
                    <div className='profileZoom'><img src={profileImage} onError={(e) => { e.currentTarget.src = profileIcon; }} onContextMenu={(e) => e.preventDefault()} /></div>
                    <div className='card'>Nv. {usuario ? calcularXp(usuario.xp) : 0}</div>
                </div>
                <h3>{usuario ? usuario.username : "Nome do Usuario"}</h3>
                <h4>{usuario ? usuario.titulo : "Leitor Não Verificado"}</h4>
            </div>
                <div className='linha'></div>
            <div className='buttons'>
                {usuario ? (
                    <button className='SideButton' onClick={() => link('/perfil')}><img src={person} alt="Meu Perfil" /> Meu Perfil</button>
                ) : (
                    <button className='SideButton' onClick={() => link('/login')}><img src={person} alt="Faça Login ou Cadastre-se" /> Login/Cadastro</button>
                )}
                <button className='SideButton' onClick={() => link('/library')}><img src={library} alt="Minha Biblioteca" /> Minha Biblioteca</button>
                <button className='SideButton' onClick={() => link('/history')}><img src={history} alt="Histórico" /> Histórico</button>
                <button className='SideButton' onClick={() => link('/config')}><img src={settings} alt="Configurações" /> Configurações</button>
                {usuario?.account_type === 'admin' || usuario?.account_type === 'scan' ? <button className='SideButton' onClick={() => link('/scan')}><img src={openbook} alt="Scan" /> Scan</button> : ""}
                {usuario?.account_type === 'admin' ? <button className='SideButton' onClick={() => link('/admin')}><img src={shield} alt="Admin" /> Admin</button> : ""}

            </div>
                {usuario ? <div className='linha' id='exitLinha'></div> : ""}
            {usuario ? <button className='ExitButton' onClick={handleLogout}><img src={logoutIcon} alt="Log-Out" /> Log-Out</button>
            : ""}
        </div>
        </>
    );
}

export default Sidebar;
