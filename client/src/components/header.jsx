import '../assets/styles/header.css';

// Imagens e ícones

import logo from '../assets/icons/logo.svg';
import profileIcon from '../assets/icons/profile.svg';
import notification from '../assets/ui/notifications.svg';
import notificationUnread from '../assets/ui/notifications_unread.svg';

export function Header( { setIsSidebarOpen } ) {
    return (
        <header className="header">

            <img src={logo} className='logo' onContextMenu={(e) => e.preventDefault()} />
            <h2>Lunaris</h2>

            <div className='navBtn'>
            <button className='Btn'>Home</button>
            <button className='Btn'>Browse</button>
            </div>

            <div className='navActions'>
                <input type="text" name="search" id="search" placeholder='Pesquise seu Mangá' />
                <div className='notification'><img src={notification} onContextMenu={(e) => e.preventDefault()} /></div>
                <div className='profile'><img  src={profileIcon} onContextMenu={(e) => e.preventDefault()} onClick={() => setIsSidebarOpen(true)}/></div>
            </div>

        </header>
    );
}
export default Header;