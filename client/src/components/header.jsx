//React
import { useNavigate } from 'react-router-dom';

// CSS
import '../assets/styles/header.css';

// Imagens e ícones

import logo from '../assets/icons/logo.svg';
import profileIcon from '../assets/icons/profile.svg';
import notification from '../assets/ui/notifications.svg';
import notificationUnread from '../assets/ui/notifications_unread.svg';
import notificationFull from '../assets/ui/notifications_full.svg';

export function Header( { setIsSidebarOpen, setIsNotificationsOpen, isNotificationsOpen } ) {
    const navigate = useNavigate();
    
    function link(path) {
        navigate(path);
    }

    return (
        <header className="header">

            <img src={logo} className='logo' onContextMenu={(e) => e.preventDefault()} />
            <h2 id='pageTitle'>Lunaris</h2>

            <div className='navBtn'>
            <button className='Btn' onClick={() => link('/')}>Home</button>
            <button className='Btn' onClick={() => link('/browser')}>Browse</button>
            </div>

            <div className='navActions'>
                <input type="text" name="search" id="search" placeholder='Pesquise seu Mangá' />
                <div className='notification'><img src={isNotificationsOpen ? notificationFull : notification} onContextMenu={(e) => e.preventDefault()} onClick={() => setIsNotificationsOpen(prev => !prev)} /></div>
                <div className='profile'><img  src={profileIcon} onContextMenu={(e) => e.preventDefault()} onClick={() => setIsSidebarOpen(true)}/></div>
            </div>

        </header>
    );
}
export default Header;