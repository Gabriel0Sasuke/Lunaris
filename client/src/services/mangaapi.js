import { API_URL } from "./api"

const isInvalidMangaId = (id) => {
    const numericId = Number(id);
    return !Number.isInteger(numericId) || numericId <= 0;
};

export const mangaAPI = {
    // Busca uma lista de mangás com base em filtros e ordenação
    getManga : async ({ limit, tag, orderBy, search, status, type }) => {
        const baseURL = new URL(`${API_URL}/manga/list`);

        //Parametros da URL
        limit ? baseURL.searchParams.append('limit', limit) : null;
        tag ? baseURL.searchParams.append('tag', tag) : null;
        orderBy ? baseURL.searchParams.append('orderBy', orderBy) : baseURL.searchParams.append('orderBy', 'A-Z');
        search ? baseURL.searchParams.append('search', search) : null;
        status ? baseURL.searchParams.append('status', status) : null;
        type ? baseURL.searchParams.append('type', type) : null;

        try{
            const response = await fetch(baseURL);
            const manga = await response.json();
            if (!response.ok) {
                throw new Error(manga?.message || 'Erro ao carregar mangas');
            }
            return manga;
        }catch(error){
            console.error('Erro ao buscar mangas');
            throw error;
        }
    },
    // Busca os detalhes de um mangá específico por ID
    getMangaById : async ({ id }) => {
        const baseURL = new URL(`${API_URL}/manga/page`);

        //Parametros da URL
        if (isInvalidMangaId(id)) {
            throw new Error('ID do manga é obrigatório');
        } else {
            baseURL.searchParams.append('id', Number(id));
        }

        try{
            const response = await fetch(baseURL);
            const manga = await response.json();
            if (!response.ok) {
                throw new Error(manga?.message || 'Erro ao carregar manga');
            }
            return manga;
        }catch(error){
            console.error('Erro ao buscar manga');
            throw error;
        }
    },
    // Incrementa a contagem de visualizações de um mangá
    addView : async ({ id }) => {
        const baseURL = new URL(`${API_URL}/manga/view`);

        if (isInvalidMangaId(id)) {
            throw new Error('ID do manga é obrigatório');
        }

        try{
            const response = await fetch(baseURL, { 
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mangaId: Number(id) })
                });
            const result = await response.json();
            if (!response.ok) throw new Error(result?.message || 'Erro ao adicionar visualização');
            return result;
        } catch(error) {
            console.error('Erro ao adicionar visualização');
            throw error;
        }
    },
    // Verifica se um mangá está nos bookmarks do usuário
    checkBookmark : async ({ id }) => {
        const baseURL = new URL(`${API_URL}/user/bookmark/check`);

        if (isInvalidMangaId(id)) {
            throw new Error('ID do manga é obrigatório');
        } else {
            baseURL.searchParams.append('mangaid', Number(id));
        }

        try{
            const response = await fetch(baseURL, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result?.message || 'Erro ao verificar bookmark');
            }
            return result;
        } catch(error) {
            console.error('Erro ao verificar bookmark');
            throw error;
        }
    },
    // Alterna o bookmark de um mangá (adiciona se não existir, remove se já existir)
    toggleBookmark : async ({ id }) => {
        const baseURL = new URL(`${API_URL}/user/bookmark/toggle`);

        if (isInvalidMangaId(id)) {
            throw new Error('ID do manga é obrigatório');
        }

        try{
            const response = await fetch(baseURL, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mangaid: Number(id) })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result?.message || 'Erro ao alternar bookmark');
            }
            return result;
        } catch(error) {
            console.error('Erro ao alternar bookmark');
            throw error;
        }
    },
    // Cria um novo mangá (usado para upload)
    createManga: async ({ formData }) => {
        const baseURL = new URL(`${API_URL}/manga/create`);

        if (!(formData instanceof FormData)) {
            throw new Error('Dados inválidos para criação do mangá');
        }

        try {
            const response = await fetch(baseURL, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result?.message || 'Erro ao criar manga');
            }
            return result;
        } catch (error) {
            console.error('Erro ao criar manga');
            throw error;
        }
    }
}