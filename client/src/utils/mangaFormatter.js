const TYPE_LABELS = {
	manga: 'Mangá',
	manhwa: 'Manhwa',
	manhua: 'Manhua'
};

const DEMOGRAPHIC_LABELS = {
	shounen: 'Shounen',
	shoujo: 'Shoujo',
	seinen: 'Seinen',
	josei: 'Josei'
};

const STATUS_LABELS_PT = {
	ongoing: 'Em andamento',
	completed: 'Completo',
	hiatus: 'Em hiato',
	cancelled: 'Cancelado'
};

const STATUS_LABELS_HEADER = {
	ongoing: 'Ongoing Series',
	completed: 'Completed Series',
	hiatus: 'On Hiatus',
	cancelled: 'Cancelled Series'
};
const normalizeValue = (value) => String(value || '').trim().toLowerCase();

export const mangaFormatter = {
	formatDateLow(inputDate) {
		if (inputDate === undefined || inputDate === null || inputDate === '') return '0s';

		const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
		if (Number.isNaN(date.getTime())) return '0s';

		let diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
		if (diffInSeconds < 0) {
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
	},

	formatType(type) {
		return TYPE_LABELS[normalizeValue(type)] || (type || 'Tipo desconhecido');
	},

	formatDemographic(demographic) {
		return DEMOGRAPHIC_LABELS[normalizeValue(demographic)] || (demographic || 'Demografia desconhecida');
	},

	formatStatus(status) {
		return STATUS_LABELS_PT[normalizeValue(status)] || (status || 'Status desconhecido');
	},

	formatHeaderStatus(status) {
		return STATUS_LABELS_HEADER[normalizeValue(status)] || 'Ongoing Series';
	},

	formatDate(inputDate) {
		if (!inputDate) return 'Data desconhecida';
		const date = new Date(inputDate);
		if (Number.isNaN(date.getTime())) return 'Data desconhecida';
		return date.toLocaleDateString('pt-BR');
	},
    formatDateMonth(inputDate) {
        if (!inputDate) return 'Data desconhecida';
        const date = new Date(inputDate);
        if (Number.isNaN(date.getTime())) return 'Data desconhecida';
        return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
};

export default mangaFormatter;
