import './authRequired.css';
import { Link } from 'react-router-dom';
import { useNavigateTo } from '../../hooks/useNavigateTo';

import person from '../../assets/ui/person.svg';

function AuthRequired() {
    const navigateTo = useNavigateTo();

    function goLogin() {
        navigateTo('/login');
    }

    return (
        <main className="authRequired-content">
            <h1 className='AR401'>401</h1>
            <div className='ARDiv'>
                <h2>Autenticação Requerida</h2>
                <span>Um portal secreto aguarda. Você precisa estar conectado para acessar este capítulo ou recurso.</span>
                <button onClick={goLogin}><img src={person} alt="Login" />Ir para Login</button>
                <p className='authCadastroText'><Link to="/cadastro">Criar Conta</Link></p>
            </div>
        </main>
    );
}

export default AuthRequired;
