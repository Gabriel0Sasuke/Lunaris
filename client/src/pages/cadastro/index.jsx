//React
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

// Serviços
import { notify } from '../../services/notify';
import { API_URL } from '../../services/api';

//CSS
import './cadastro.css';

//Icons
import lunaris from '../../assets/icons/logo.svg';
import loading from '../../assets/ui/loading.svg';

function Cadastro() {
    // Navegação
    const navigate = useNavigate();
    function link(link){
        navigate(link);
    }
    const [loadingState, setLoadingState] = useState(false);
    // Dados
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const { verificarUsuario } = useAuth();
        
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&  email.length <= 255;
    const senhaForte = password.length >= 8 && password.length <= 100 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password);
    const senhasIguais = password === confirmPassword;
    const termosAceitos = termsAccepted;
    const usernameValido = username.trim().length >= 3 && username.trim().length <= 25;
    // O formulário só é liberado se todos forem true
    const Valido = emailValido && senhaForte && senhasIguais && termosAceitos && usernameValido;

    // Envio do Formulário
    const handleSubmit = async (e) => {
        // 1. Impede o navegador de recarregar a página
     e.preventDefault();
     setLoadingState(true);

    // 2. Criação do pacote JSON
    const cadastroData = {
        email: email,
        password: password,
        username: username
    };
  
        // Envio para o servidor
        try{
            const resposta = await fetch(`${API_URL}/auth/cadastro`, {
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },body: JSON.stringify(cadastroData)});
            if(resposta.ok){
                const data = await resposta.json()
                notify.success(data.message);
            }else{
                //O Servidor respondeu mas algo deu errado.
                const data = await resposta.json();
                notify.error(data.message);
            }

        }catch(error){
            notify.error('Não foi possível conectar ao servidor.');
        }finally{
            setLoadingState(false);
        }
        };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const resposta = await fetch(`${API_URL}/auth/google`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: tokenResponse.access_token }),
                });

                if (resposta.ok) {
                    const data = await resposta.json();
                    notify.success(data.message);
                    await verificarUsuario();
                    link('/');
                } else {
                    const data = await resposta.json();
                    notify.error(data.message);
                }
            } catch (error) {
                notify.error('Não foi possível conectar ao servidor.');
            } finally {
                setLoadingState(false);
            }
        },
        onError: () => {
            notify.error('Não foi possível autenticar com Google.');
            setLoadingState(false);
        },
    });

    const handleGoogleCadastro = () => {
        setLoadingState(true);
        googleLogin();
    };

    const handleDiscordCadastro = () => {
        setLoadingState(true);
        notify.info('Cadastro com Discord em breve');
        setLoadingState(false);
    };
        
    return (
        <main className="auth-page">
            <form onSubmit={handleSubmit}>
                <div className='authIcon'><img src={lunaris} alt="Lunaris Logo" /></div>
                <h2 id='authTitle'>Crie sua conta</h2>
                <h3 id='authSubTitle'>Insira seus dados para começar</h3>
                <div id='inputContainer'>
                    <div className='Input'>
                    {!usernameValido && username ? <span className='authTextoInvalido'>Nome de usuário precisa ter entre 3 e 25 caracteres</span> : ""}
                    <input className={`authInput ${!usernameValido && username ? 'authInvalido' : ''}`} type="text" name="username" id="username" placeholder='Nome de Usuário' value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div className='Input'>
                    {!emailValido && email ? <span className='authTextoInvalido'>Email inválido</span> : ""}
                    <input className={`authInput ${!emailValido && email ? 'authInvalido' : ''}`} type="email" name="email" id="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className='Input'>
                    {!senhaForte && password ? <span className='authTextoInvalido'>Senha precisa ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos</span> : ""}
                    <input className={`authInput ${!senhaForte && password ? 'authInvalido' : ''}`} type="password" name="password" id="password" placeholder='Senha' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className='Input'>
                    {!senhasIguais && confirmPassword ? <span className='authTextoInvalido'>As senhas não coincidem</span> : ""}
                    <input className={`authInput ${!senhasIguais && confirmPassword ? 'authInvalido' : ''}`} type="password" name="confirmPassword" id="confirmPassword" placeholder='Confirmação de Senha' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    <div className="terms-container">
                        <input type="checkbox" id="terms" name="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                        <label htmlFor="terms">Aceito os termos de serviço</label>
                    </div>

                    <button type="submit" className='authSubmit' disabled={!Valido || loadingState}>{loadingState ? <img src={loading} /> : "Cadastrar"}</button>
                    
                    <div id='OR'>
                         <div className="line"></div>
                         <span>OU</span>
                         <div className="line"></div>
                    </div>
                    <div className='socialLoginRow'>
                        <button type="button" className='socialLogin' onClick={handleGoogleCadastro} disabled={loadingState}>{loadingState ? <img src={loading} /> : <><img src="/icon/google.svg"/>Google</>}</button>
                        <button type="button" className='socialLogin' onClick={handleDiscordCadastro} disabled={loadingState}>{loadingState ? <img src={loading} /> : <><img src="/icon/discord.svg"/>Discord</>}</button>
                    </div>
                </div>
            </form>

            <div className="authToggle">
                <span>Já tem uma conta?</span>
                <button onClick={() => link('/login')}>Entrar</button>
            </div>
        </main>
    );
}
export default Cadastro;
