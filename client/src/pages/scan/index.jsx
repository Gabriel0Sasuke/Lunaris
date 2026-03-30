//CSS
import './scan.css';

//React
import { useState, useEffect } from 'react';

//Icons
import list from '../../assets/ui/list.svg';
import monitoring from '../../assets/ui/monitoring.svg';
import layer from '../../assets/ui/layer.svg';
import closeBook from '../../assets/ui/closeBook.svg';
import group from '../../assets/ui/group.svg';
import description from '../../assets/ui/description.svg';

// Services
import CheckOnline from '../../api/serverApi';

// Context
import { useAuth } from '../../context/AuthContext.jsx';

// Sections
import AddManga from './sections/addManga';
import ManageTags from './sections/manageTags';

function Scan() {
    const { usuario } = useAuth();

    const [scanMode, setScanMode] = useState('addManga');
    const [serverOnline, setServerOnline] = useState(false);

    // Verificar status do servidor ao montar o componente
    useEffect(() => {
    const check = async () => {
        const online = await CheckOnline();
        setServerOnline(online);
    }

    // Verifica a cada 5 segundos
    const interval = setInterval(check, 5000);

    return () => clearInterval(interval); // limpa ao desmontar
}, []);

function FormatarScan(scan) {
    if(!scan){ return 'Nenhuma Scan Afiliada';}else return scan;
}
function ScanMangaModeTitle(mode) {
    switch(mode){
        case 'addManga':
            return 'Adicionar Mangá';
        case 'addChapter':
            return 'Adicionar Capítulo';
        case 'myMangas':
            return 'Meus Mangás';
        case 'statistics':
            return 'Estatísticas';
        case 'manageTags':
            return 'Gerenciar Tags';
        default:
            return '';
    }
}
    return (
        <main className="scan-content">
            <div className="ScanNavButton">
                <button className={scanMode === 'addManga' ? "ScanNavBtn active" : "ScanNavBtn"} onClick={() => setScanMode('addManga')}> <img src={list} alt="Adicionar Mangá" /> Adicionar Mangá</button>
                <button className={scanMode === 'addChapter' ? "ScanNavBtn active" : "ScanNavBtn"} onClick={() => setScanMode('addChapter')}> <img src={layer} alt="Adicionar Capítulo" /> Adicionar Capítulo</button>
                <button className={scanMode === 'myMangas' ? "ScanNavBtn active" : "ScanNavBtn"} onClick={() => setScanMode('myMangas')}> <img src={closeBook} alt="Meus Mangás" /> Meus Mangás</button>
                <button className={scanMode === 'statistics' ? "ScanNavBtn active" : "ScanNavBtn"} onClick={() => setScanMode('statistics')}> <img src={monitoring} alt="Estatísticas" /> Estatísticas</button>
                <button className={scanMode === 'manageTags' ? "ScanNavBtn active" : "ScanNavBtn"} onClick={() => setScanMode('manageTags')}> <img src={description} alt="Gerenciar Tags" /> Gerenciar Tags</button>
            </div>

            <div className="ScanInfos">
                <div className="ScanSystem">
                    <div className='ScanSystemLegend'>
                        <h5>Sistema</h5>
                        <span>Status do Servidor</span>
                    </div>
                    <div className="ScanSystemBar"></div>
                    <div className={serverOnline ? "ScanSystemStatus" : "ScanSystemStatus offline"}><div className='ScanSystemStatusBall'></div> {serverOnline ? 'Online' : 'Offline'}</div>
                </div>
                <div className="ScanProfile">
                    <div className='ScanProfileIcon'><img src={group} alt="Perfil" /></div>
                    <div className='ScanProfileInfo'>
                        <span>{FormatarScan(usuario?.scan_afiliada)}</span>
                    </div>
                </div>
            </div>
            <div className='ScanMangaMode'><div className='ScanTitleBolinha'></div><h2>{ScanMangaModeTitle(scanMode)}</h2></div>
            {scanMode === 'addManga' && <AddManga onManageTags={() => setScanMode('manageTags')} />}
            {scanMode === 'manageTags' && <ManageTags />}
        </main>
    );
}
export default Scan;