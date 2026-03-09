//CSS
import './footer.css';

//Icons
import googlePlay from '../../assets/icons/googleplay.svg';
import appStore from '../../assets/icons/appstore.svg';

function Footer() {
    return (
        <footer>
            <div className='footerPrincipal'>
            <div className="footerColuna">
                <h1>Lunaris</h1>
                <span>Lunaris é um leitor de mangás desenvolvido de fã para fã. Este projeto não possui fins lucrativos e preza unicamente pelo compartilhamento de histórias e cultura.</span>
            </div>

            <div className="footerColuna">
                <h1>Descubra</h1>
                <ul>
                    <li>Em Alta</li>
                    <li>Lançamentos</li>
                    <li>Gêneros</li>
                    <li>Recomendações</li>
                </ul>
            </div>

            <div className="footerColuna">
                <h1>Comunidade</h1>
                <ul>
                    <li>Discord</li>
                    <li>Twitter/X</li>
                    <li>Forúm</li>
                    <li>Suporte</li>
                </ul>
            </div>

            <div className="footerColuna">
                <h1>App</h1>
                <img src={googlePlay} alt="Google Play Store" />
                <img src={appStore} alt="Apple App Store" />
            </div>
            </div>
            <div id='footerLinha'></div>
            <div className='footerBaixo'>
                <span>© 2026 Lunaris. Todos os direitos reservados.</span>
                <div className='footerBaixoLinks'>
                    <span>Termos de Serviço</span>
                    <span>Política de Privacidade</span>
                    <span>Cookies</span>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
