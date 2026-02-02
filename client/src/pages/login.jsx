//React
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

//CSS
import '../assets/styles/login.css';

//Icons
import lunaris from '../assets/icons/logo.svg';

function Login() {
    const navigate = useNavigate();

    // Dados
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    //Funções
    function link(link){
        navigate(link);
    }
    const handleSubmit = (e) => {
  // 1. Impede o navegador de recarregar a página
  e.preventDefault();

  // 2. Criação do pacote JSON
  const loginData = {
    email: email,
    password: password
  };

  console.log("Dados prontos para o envio:", loginData);
  
  // O próximo passo é enviar para o servidor...
};
    return (
        <main>
            <form onSubmit={handleSubmit}>
                <div className='loginIcon'><img src={lunaris} alt="Lunaris Logo" /></div>
                <h2 id='loginTitle'>Bem-vindo de Volta!</h2>
                <h3 id='loginSubTitle'>Insira seus dados para continuar</h3>
                <div id='inputContainer'>
                    <input className="Logininput" type="email" name="email" id="email" placeholder='Digite seu Email' required onChange={(e) => setEmail(e.target.value)} value={email}/>
                    <input className="Logininput" type="password" name="password" id="password" placeholder='Digite sua Senha' required onChange={(e) => setPassword(e.target.value)} value={password}/>
                    
                    <div className="forgot-pass">
                        <a href="#">Esqueci minha senha</a>
                    </div>

                    <button type="submit" className='Submitlogin'>Entrar</button>
                        <div id='OR'>
                            <div className="line"></div>
                            <span>OU</span>
                            <div className="line"></div>
                        </div>
                    <button className='socialLogin'><img src="/icon/google.svg"/>Google</button>
                </div>
            </form>

            <div className="cadastro">
                <span>Novo no Lunaris?</span>
                <button onClick={() => link('/cadastro')}>Cadastre-se</button>
            </div>
        </main>
    );
}
export default Login;
