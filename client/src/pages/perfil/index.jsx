// CSS
import './perfil.css';
// React
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { calcularProgressoXp } from '../../services/nivelUser';
// Icons
import profile from '../../assets/ui/person.svg';
import edit from '../../assets/ui/edit.svg';
import bolt from '../../assets/ui/bolt.svg';

function Perfil(){
    const [profileMode, setProfileMode] = useState('overview');
    const { usuario } = useAuth();

    const progressoXp = calcularProgressoXp(usuario?.xp ?? 0);
    const formatoNumero = new Intl.NumberFormat('pt-BR');

    function formatarCargo(accountType) {
        switch (accountType) {
            case 'admin':
                return 'Administrador';
            case 'user':
                return 'Usuário';
            case 'scan':
                return 'Scanlator';
            default:
                return 'Desconecido';
        }
    }
    return(
        <main className="perfil-content">
            <div className="profileSwitch">
                <button className={profileMode === 'overview' ? 'selected' : ''} onClick={() => setProfileMode('overview')}><img src={profile} alt="Perfil" />Perfil</button>
                <button className={profileMode === 'edit' ? 'selected' : ''} onClick={() => setProfileMode('edit')}><img src={edit} alt="Editar" />Editar</button>
            </div>

            <div className="profileInfo">
                <div className="profileIcon">
                    <img src="/example/lunaChan.png" alt="Sua foto de perfil" />
                    <div className="profileLevel">LVL {progressoXp.nivel}</div>
                </div>
                <div className="profileName">
                    <h2>{usuario?.username ?? 'Usuário'}</h2>
                </div>
                <div className="profileTitle">{usuario?.titulo ?? 'Mangá Reader'}</div>
                <div className="profileTags">
                    <div className="profileTag">Membro desde {usuario?.created_at ? new Date(usuario.created_at).toLocaleDateString('pt-BR') : 'Desconhecido'}</div>
                    <div className="profileTag">Último login: {usuario?.last_seen ? new Date(usuario.last_seen).toLocaleDateString('pt-BR') : 'Nunca'}</div>
                    <div className={usuario?.account_type === 'admin' ? 'profileTag admin' : 'profileTag'}>{formatarCargo(usuario?.account_type)}</div>
                </div>
            </div>

            <div className="profileExperience">
                <div className="ExperienceTitle"><img src={bolt} alt="Bolt Icon" /><h3>Progresso Atual</h3></div>
                <div className="ExperienceInfos">
                    <h4>Faltam {formatoNumero.format(progressoXp.xpFaltante)} XP para o nível {progressoXp.nivel + 1}</h4>
                    <span><h2>{formatoNumero.format(progressoXp.xpTotal)}</h2> / {formatoNumero.format(progressoXp.limiteProximoNivel)} XP</span>
                </div>
                <div className="ExperienceBar"><div className="ExperienceBarFill" style={{ width: `${progressoXp.progressoPercentual}%` }}></div></div>
                <div className="ExperienceStatistics"></div>
            </div>
        </main>
    )
}
export default Perfil;
