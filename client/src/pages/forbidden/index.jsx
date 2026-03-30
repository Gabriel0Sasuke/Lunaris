import './forbidden.css';
import { useNavigateTo } from '../../hooks/useNavigateTo';

import history from '../../assets/ui/history.svg';

function Forbidden() {
    const navigateTo = useNavigateTo();

    function goBack() {
        navigateTo('/');
    }

    return (
        <main className="forbidden-content">
            <h1 className='F403'>403</h1>
            <div className='FDiv'>
                <h2>Acesso Negado</h2>
                <span>Você não tem autorização para acessar este portal. Esta área é restrita a membros de nível superior ou administradores.</span>
                <button onClick={goBack}><img src={history} alt="Voltar" />Voltar ao Início</button>
            </div>
        </main>
    );
}

export default Forbidden;
