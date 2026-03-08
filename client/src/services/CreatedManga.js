/**
 * Formata um horario para tempo relativo curto.
 * Exemplos: 1s, 1min, 1h, 1d, 1m, 1y
 */
export function formatRelativeTimeShort(inputDate) {
	if (inputDate === undefined || inputDate === null || inputDate === '') return '0s';

	// Mesmo padrao da tela de perfil: parse direto e calcula a diferenca para agora.
	const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
	if (Number.isNaN(date.getTime())) return '0s';

	let diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
	if (diffInSeconds < 0) {
		// Se vier com skew de timezone (ex: UTC x UTC-3), usamos valor absoluto.
		diffInSeconds = Math.abs(diffInSeconds);
	}

	if (diffInSeconds === 0) return '1s';

	if (diffInSeconds < 60) return `${diffInSeconds}s`;

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) return `${diffInMinutes}min`;

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) return `${diffInHours}h`;

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 30) return `${diffInDays}d`;

	const diffInMonths = Math.floor(diffInDays / 30);
	if (diffInMonths < 12) return `${diffInMonths}m`;

	const diffInYears = Math.floor(diffInDays / 365);
	return `${diffInYears}y`;
}

export default formatRelativeTimeShort;
