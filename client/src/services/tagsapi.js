import { API_URL } from "./api"

export const tagAPI = {
    getTags: async () => {
        const baseURL = new URL(`${API_URL}/tag/list`);

        try {
            const response = await fetch(baseURL, {
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || 'Erro ao carregar tags');
            }
            return data;
        } catch (error) {
            console.error('Erro ao buscar tags');
            throw error;
        }
    },
    createTag: async ({ name, slug, icon }) => {
        const baseURL = new URL(`${API_URL}/tag/add`);

        if (!name || !slug || !icon) {
            throw new Error('Dados inválidos para criação da tag');
        }

        try {
            const response = await fetch(baseURL, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, slug, icon })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result?.message || 'Erro ao adicionar tag');
            }
            return result;
        } catch (error) {
            console.error('Erro ao adicionar tag');
            throw error;
        }
    },
    fetchTags: async () => {
        const data = await tagAPI.getTags();
        return data?.tags;
    }
}