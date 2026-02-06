// CSS
import '../assets/styles/notifications.css';

function Notifications({ isNotificationsOpen }) {
    return (
        <div id="notifications" className={isNotificationsOpen ? 'show' : ''}>
            <div className='NotificationsTop'>
                <h3>Notificações</h3>
                <span>Marcar todas como lidas</span>
            </div>

            <div className="NotificationsItems">
                <span>Notificações Ainda Não Funcionais</span>
            </div>

            <div className="NotificationsBottom">
                <span>Ver todas as notificações</span>
            </div>
        </div>
    );
}
export default Notifications;