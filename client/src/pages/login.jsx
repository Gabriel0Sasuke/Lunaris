//React
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Serviços
import { notify } from '../services/notify';
import { API_URL } from '../services/api';

//CSS
import '../assets/styles/auth.css';

//Icons
import lunaris from '../assets/icons/logo.svg';
import loading from '../assets/ui/loading.svg';

function Login() {
    // Navegação
    const navigate = useNavigate();
    function link(link){
        navigate(link);
    }
    const [loadingState, setLoadingState] = useState(false);
    // Dados
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const senhaForte = password.length > 0;

    // O formulário só é liberado se ambos forem true
    const Valido = emailValido && senhaForte;

    const { verificarUsuario } = useAuth();

    // Envio do Formulário
    const handleSubmit = async (e) => {
        // 1. Impede o navegador de recarregar a página
     e.preventDefault();
     setLoadingState(true);

    // 2. Criação do pacote JSON
    const loginData = {
        email: email,
        password: password
    };
         console.log("Dados prontos para o envio:", loginData);
  
        // Envio para o servidor
        try{
            const resposta = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers:{
                    'Content-Type' : 'application/json'
                },body: JSON.stringify(loginData)});
            if(resposta.ok){
                const data = await resposta.json()
                notify.success(data.message);
                await verificarUsuario(); // Atualiza o estado global
                link('/');
            }else{
                //O Servidor respondeu mas algo deu errado.
                const data = await resposta.json();
                notify.error('Erro ao fazer login: ' + data.message);
            }

        }catch(error){
            console.log("Erro:", error)
            notify.error('Erro ao fazer login, Erro: "'+ error.message + '"');
        }finally{
            setLoadingState(false);
        }
        };
    return (
        <main className="auth-page">
            <form onSubmit={handleSubmit}>
                <div className='authIcon'><img src={lunaris} alt="Lunaris Logo" /></div>
                <h2 id='authTitle'>Bem-vindo de Volta!</h2>
                <h3 id='authSubTitle'>Insira seus dados para continuar</h3>
                <div id='inputContainer'>
                    <div className='Input'>
                    {!emailValido && email ? <span className='authTextoInvalido'>Email inválido</span> : ""}
                    <input className={`authInput ${!emailValido && email ? 'authInvalido' : ''}`} type="email" name="email" id="email" placeholder='Digite seu Email' onChange={(e) => setEmail(e.target.value)} value={email}/>
                    </div>

                    <div className='Input'>
                    {!senhaForte && password ? <span className='authTextoInvalido'>Senha inválida</span> : ""}
                    <input className={`authInput ${!senhaForte && password ? 'authInvalido' : ''}`} type="password" name="password" id="password" placeholder='Digite sua Senha' onChange={(e) => setPassword(e.target.value)} value={password}/>
                    </div>
                    
                    <div className="forgot-pass">
                        <a href="#">Esqueci minha senha</a>
                    </div>

                    <button type="submit" className='authSubmit' disabled={!Valido || loadingState}>{loadingState ? <img src={loading} /> : "Entrar"}</button>
                        <div id='OR'>
                            <div className="line"></div>
                            <span>OU</span>
                            <div className="line"></div>
                        </div>
                    <button className='socialLogin'><img src="/icon/google.svg"/>Google</button>
                </div>
            </form>

            <div className="authToggle">
                <span>Novo no Lunaris?</span>
                <button onClick={() => link('/cadastro')}>Cadastre-se</button>
            </div>
        </main>
    );
}
export default Login;
