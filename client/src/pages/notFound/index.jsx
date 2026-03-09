import './notFound.css'

import { useNavigate } from 'react-router-dom';

import history from '../../assets/ui/history.svg';
function NotFound(){
    const navigate = useNavigate();
    function goBack(){
        navigate('/');
    }
    return(
        <main className="NotFound-content">
            <h1 className='NF404'>404</h1>
            <div className='NFDiv'>
                <h2>Portal Perdido</h2>
                <span>O portal que você está procurando desapareceu no vazio. Parece que este capítulo ainda não foi escrito.</span>
                <button onClick={goBack}><img src={history} alt="Voltar ao Histórico" />Voltar a Realidade</button>
            </div>
        </main>
    )
}
export default NotFound;
