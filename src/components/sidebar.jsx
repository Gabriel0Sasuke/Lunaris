import '../assets/styles/sidebar.css';
import close from '../assets/ui/close.svg';
import person from '../assets/ui/person.svg';
import settings from '../assets/ui/settings.svg';
import library from '../assets/ui/library.svg';
import history from '../assets/ui/history.svg';
import logout from '../assets/ui/logout.svg';

import profileIcon from '../assets/icons/profile.svg';

function Sidebar( { isSidebarOpen, setIsSidebarOpen } ) {
    return (
        <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>

            <div className='exit' onClick={() => setIsSidebarOpen(false)}>
                <img src={close} onContextMenu={(e) => e.preventDefault()} />
            </div>
            
            <div className='profile_info'>
                <div className='section'>
                    <div className='profileZoom'><img  src={profileIcon} onContextMenu={(e) => e.preventDefault()} /></div>
                    <div className='card'>Nv. 0</div>  
                </div>
                <h3>Nome do Usuario</h3>
                <h4>Mangá Beginner</h4>
            </div>
                <div className='linha'></div>
            <div className='buttons'>
                <button className='SideButton'><img src={person} alt="Meu Perfil" /> Meu Perfil</button>
                <button className='SideButton'><img src={library} alt="Minha Biblioteca" /> Minha Biblioteca</button>
                <button className='SideButton'><img src={history} alt="Histórico" /> Histórico</button>
                <button className='SideButton'><img src={settings} alt="Configurações" /> Configurações</button>
            </div>
                <div className='linha' id='exitLinha'></div>
            <button className='ExitButton'><img src={logout} alt="Log-Out" /> Log-Out</button>
            <div className='blankScreen' onClick={() => setIsSidebarOpen(false)}></div>
        </div>
    );
}

export default Sidebar;