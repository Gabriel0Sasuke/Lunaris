import { API_URL } from './config';

const normalizeText = (value) => {
    if (value === undefined || value === null) return null;
    const text = String(value).trim();
    return text ? text : null;
};

const normalizeEmail = (value) => {
    const email = normalizeText(value);
    return email ? email.toLowerCase() : null;
};

const normalizeTitle = (value) => {
    if (value === undefined || value === null) return null;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? String(parsed) : null;
};

const toNullableField = (nextValue, currentValue, normalizer = normalizeText) => {
    const nextNormalized = normalizer(nextValue);
    const currentNormalized = normalizer(currentValue);
    return nextNormalized === currentNormalized ? null : nextNormalized;
};

export const userAPI = {
    cadastro: async ({ username, email, password }) => {
        const response = await fetch(`${API_URL}/auth/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || 'Erro ao realizar cadastro.');
        }

        return data;
    },

    login: async ({ email, password }) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || 'Erro ao realizar login.');
        }

        return data;
    },

    googleLogin: async ({ token }) => {
        const response = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || 'Erro ao autenticar com Google.');
        }

        return data;
    },

    getTitles: async () => {
        const response = await fetch(`${API_URL}/user/titles`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || 'Erro ao carregar títulos disponíveis.');
        }

        return data;
    },

    checkUpdateAvailability: async ({ username, email }) => {
        const url = new URL(`${API_URL}/auth/update/availability`);

        if (normalizeText(username)) {
            url.searchParams.set('username', normalizeText(username));
        }

        if (normalizeEmail(email)) {
            url.searchParams.set('email', normalizeEmail(email));
        }

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || 'Erro ao verificar disponibilidade de username/e-mail.');
        }

        return data;
    },

    updateProfile: async ({ usuario, username, email, bio, title, password, profileImage, removeProfileImage }) => {
        const formData = new FormData();

        const usernameField = toNullableField(username, usuario?.username, normalizeText);
        const emailField = toNullableField(email, usuario?.email, normalizeEmail);
        const bioField = toNullableField(bio, usuario?.bio, normalizeText);
        const titleField = toNullableField(title, usuario?.titulo_id, normalizeTitle);
        const passwordField = normalizeText(password);

        formData.append('username', usernameField ?? 'null');
        formData.append('email', emailField ?? 'null');
        formData.append('bio', bioField ?? 'null');
        formData.append('title', titleField ?? 'null');
        formData.append('password', passwordField ?? 'null');
        formData.append('removeProfileImage', removeProfileImage ? 'true' : 'false');

        if (profileImage) {
            formData.append('profile', profileImage);
        }

        const response = await fetch(`${API_URL}/auth/update`, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || 'Erro ao atualizar perfil.');
        }

        return data;
    }
};
