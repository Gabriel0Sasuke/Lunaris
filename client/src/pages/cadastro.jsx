//React
import { useNavigate } from 'react-router-dom';

//CSS
import '../assets/styles/cadastro.css';

//Icons
import lunaris from '../assets/icons/logo.svg';

function Cadastro() {
    const navigate = useNavigate();
    function link(link){
        navigate(link);
    }
    return (
        <main>
            <form action="#" method='POST'>
                <div className='loginIcon'><img src={lunaris} alt="Lunaris Logo" /></div>
                <h2 id='loginTitle'>Crie sua conta</h2>
                <h3 id='loginSubTitle'>Insira seus dados para começar</h3>
                <div id='inputContainer'>
                    <input className="Logininput" type="text" name="username" id="username" placeholder='Nome de Usuário' required />
                    <input className="Logininput" type="email" name="email" id="email" placeholder='Email' required />
                    <input className="Logininput" type="password" name="password" id="password" placeholder='Senha' required />
                    <input className="Logininput" type="password" name="confirmPassword" id="confirmPassword" placeholder='Confirmação de Senha' required />
                    
                    <div className="terms-container">
                        <input type="checkbox" id="terms" name="terms" required />
                        <label htmlFor="terms">Aceito os termos de serviço</label>
                    </div>

                    <button type="submit" className='Submitlogin'>Cadastrar</button>
                    
                    <div id='OR'>
                         <div className="line"></div>
                         <span>OU</span>
                         <div className="line"></div>
                    </div>
                    <button className='socialLogin'><img src="/icon/google.svg"/>Google</button>
                </div>
            </form>

            <div className="cadastro">
                <span>Já tem uma conta?</span>
                <button onClick={() => link('/login')}>Entrar</button>
            </div>
        </main>
    );
}
export default Cadastro;
