import './bootScreen.css';
import loading from '../../assets/ui/loading.svg';

function BootScreen() {
    return(
        <main className='bootScreen'>
            <img src={loading} alt='Carregando' className='bootScreenLoadingImage' />
            <p>Carregando...</p>
        </main>
    )
}
export default BootScreen;