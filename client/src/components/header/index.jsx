//React
import { useLocation } from 'react-router-dom';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import { useAuth } from '../../context/AuthContext';

// CSS
import './header.css';

// Imagens e ícones

import logo from '../../assets/icons/logo.svg';
import profileIcon from '../../assets/icons/profile.svg';
import notification from '../../assets/ui/notifications.svg';
import notificationFull from '../../assets/ui/notifications_full.svg';

export function Header( { setIsSidebarOpen, setIsNotificationsOpen, isNotificationsOpen } ) {
    const navigateTo = useNavigateTo();
    const location = useLocation();
    const { usuario } = useAuth();
    const profileImage = usuario?.foto || profileIcon;

    function link(path) {
        navigateTo(path);
    }

    return (
        <header className="header">

            <img src={logo} className='logo' onContextMenu={(e) => e.preventDefault()} />
            <h2 id='pageTitle'>Lunaris</h2>

            <div className='navBtn'>
            <button className={`Btn ${location.pathname === '/' ? 'ativo' : ''}`} onClick={() => link('/')}>Home</button>
            <button className={`Btn ${location.pathname === '/browser' ? 'ativo' : ''}`} onClick={() => link('/browser')}>Browse</button>
            <button className={`Btn ${location.pathname === '/library' ? 'ativo' : ''}`} onClick={() => link('/library')}>Biblioteca</button>
            <button className={`Btn ${location.pathname === '/community' ? 'ativo' : ''}`} onClick={() => link('/community')}>Comunidade</button>
            </div>

            <div className='navActions'>
                <div className='notification' onClick={() => setIsNotificationsOpen(prev => !prev)}><img src={isNotificationsOpen ? notificationFull : notification} onContextMenu={(e) => e.preventDefault()} /></div>
                <div className='profile' onClick={() => setIsSidebarOpen(true)}><img src={profileImage} onError={(e) => { e.currentTarget.src = profileIcon; }} onContextMenu={(e) => e.preventDefault()} /></div>
            </div>

        </header>
    );
}
export default Header;
