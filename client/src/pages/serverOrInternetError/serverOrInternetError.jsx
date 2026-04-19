import './serverOrInternetError.css';
import history from '../../assets/ui/history.svg';

function ServerOrInternetError() {
    const handleReload = () => {
        window.location.reload();
    };

    return(
        <main className='serverOrInternetError'>
            <h1 className='serverOrInternetErrorCode'>Ops...</h1>

            <section className='serverOrInternetErrorCard'>
                <h2>Erro de conexao</h2>
                <p>
                    Nao foi possivel conectar ao servidor. Verifique sua internet e tente novamente.
                </p>

                <button type='button' onClick={handleReload}>
                    <img src={history} alt='Tentar novamente' />
                    Tentar novamente
                </button>
            </section>
        </main>
    )
}
export default ServerOrInternetError;