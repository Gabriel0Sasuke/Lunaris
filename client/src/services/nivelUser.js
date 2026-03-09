const XP_BASE = 10;

function normalizarXp(xp) {
    const valor = Number(xp);
    if (!Number.isFinite(valor) || valor < 0) {
        return 0;
    }
    return Math.floor(valor);
}

export function xpNecessarioParaNivel(nivel) {
    const nivelSeguro = Math.max(0, Math.floor(Number(nivel) || 0));
    if (nivelSeguro === 0) {
        return 0;
    }
    return XP_BASE * (2 ** (nivelSeguro - 1));
}

export function calcularXp(xp) {
    const xpTotal = normalizarXp(xp);
    if (xpTotal < XP_BASE) {
        return 0;
    }
    return Math.floor(Math.log2(xpTotal / XP_BASE)) + 1;
}

export function calcularProgressoXp(xp) {
    const xpTotal = normalizarXp(xp);
    const nivel = calcularXp(xpTotal);

    const limiteNivelAtual = xpNecessarioParaNivel(nivel);
    const limiteProximoNivel = xpNecessarioParaNivel(nivel + 1);
    const xpAtualNoNivel = xpTotal - limiteNivelAtual;
    const xpParaProximoNivel = limiteProximoNivel - limiteNivelAtual;
    const xpFaltante = Math.max(0, limiteProximoNivel - xpTotal);
    const progressoPercentual = Math.min(100, Math.max(0, (xpAtualNoNivel / xpParaProximoNivel) * 100));

    return {
        xpTotal,
        nivel,
        limiteNivelAtual,
        limiteProximoNivel,
        xpAtualNoNivel,
        xpParaProximoNivel,
        xpFaltante,
        progressoPercentual,
    };
}