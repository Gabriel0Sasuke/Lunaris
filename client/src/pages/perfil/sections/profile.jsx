import React from 'react';
import { useState } from 'react';

//Icons
import bolt from '../../../assets/ui/bolt.svg';

// CSS
import './profileSections.css'

// Services
import { calcularProgressoXp } from '../../../services/nivelUser';

function ViewProfile({ usuario }) {
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
                return 'Desconhecido';
        }
    }
    function lastSeen(lastSeenValue) {
        // Se o last_seen tiver sido atualizado há menos de 5 minutos, considerar online
        if (!lastSeenValue) return 'Desconhecido';
        const data = new Date(lastSeenValue);
        if (Number.isNaN(data.getTime())) return 'Desconhecido';
        const agora = new Date();
        const diffMs = agora - data;
        const diffMinutes = Math.floor(diffMs / 1000 / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        if (diffMinutes < 0) {
            return 'Online';
        }
        if (diffMinutes < 5) {
            return 'Online';
        }
        if (diffMinutes < 60) {
            return `Online há ${diffMinutes} minutos`;
        } else if (diffHours < 24) {
            return `Online há ${diffHours} horas`;
        } else {
            return `Online há ${diffDays} dias`;
        }
    }

    function isOnline(lastSeenValue) {
        if (!lastSeenValue) return false;
        const data = new Date(lastSeenValue);
        if (Number.isNaN(data.getTime())) return false;

        const diffMinutes = Math.floor((new Date() - data) / 1000 / 60);
        return diffMinutes < 5;
    }
    return(
        <div className="viewProfile">
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
                    <div className={`profileTag ${isOnline(usuario?.last_seen) ? 'online' : 'offline'}`}>{lastSeen(usuario?.last_seen)}</div>
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
            </div>
    )
}
export default ViewProfile;