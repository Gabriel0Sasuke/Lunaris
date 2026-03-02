//CSS
import './scan.css';

//React
import { useState } from 'react';

function Scan() {
    const [scanMode, setScanMode] = useState('addManga');

    return (
        <main className="scan-content">
            <div className="ScanNavButton">
                <button className={scanMode === 'addManga' ? "ScanNavBtn active" : "ScanNavBtn"} onClick={() => setScanMode('addManga')}>Adicionar Mangá</button>
                <button className={scanMode === 'addChapter' ? "ScanNavBtn active" : "ScanNavBtn"} onClick={() => setScanMode('addChapter')}>Adicionar Capítulo</button>
                <button className={scanMode === 'myMangas' ? "ScanNavBtn active" : "ScanNavBtn"} onClick={() => setScanMode('myMangas')}>Meus Mangás</button>
                <button className={scanMode === 'statistics' ? "ScanNavBtn active" : "ScanNavBtn"} onClick={() => setScanMode('statistics')}>Estatísticas</button>
            </div>
        </main>
    );
}
export default Scan;