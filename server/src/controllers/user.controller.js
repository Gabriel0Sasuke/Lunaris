const pool = require('../database/sql');

const bookmarkManga = async (req, res) => {
    // O ID do usuário é obtido do token de autenticação (via authMiddleware)
    const userId = req.user.id;
    const mangaId = Number(req.body.mangaid);
    
    // Validações básicas
    if (!mangaId) return res.status(400).json({ message: 'Manga ID é obrigatório' });
    if (isNaN(mangaId)) return res.status(400).json({ message: 'Manga ID deve ser um número' });
    if (mangaId <= 0) return res.status(400).json({ message: 'Manga ID deve ser um número positivo' });
    if (!Number.isInteger(mangaId)) return res.status(400).json({ message: 'Manga ID deve ser um número inteiro' });

    try{
        // Verifica se o mangá existe
        const mangaCheck = await pool.query('SELECT id FROM manga WHERE id = $1', [mangaId]);
        if (mangaCheck.rowCount === 0) {
            return res.status(404).json({ message: 'Mangá não encontrado' });
        }
        
        // Verifica se o usuário já deu bookmark nesse mangá
        const bookmarkCheck = await pool.query('SELECT user_id, manga_id FROM bookmark WHERE user_id = $1 AND manga_id = $2', [userId, mangaId]);
        if (bookmarkCheck.rowCount > 0) {
            // Se já existe, remove o bookmark (toggle)
            await pool.query('DELETE FROM bookmark WHERE user_id = $1 AND manga_id = $2', [userId, mangaId]);
            return res.status(200).json({ message: 'Bookmark removido' });
        } else {
            // Se não existe, adiciona o bookmark
            await pool.query('INSERT INTO bookmark (user_id, manga_id) VALUES ($1, $2)', [userId, mangaId]);
            return res.status(200).json({ message: 'Bookmark adicionado' });
        }
    } catch (error) {
        console.error('Erro ao manipular bookmark:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
const checkBookmark = async (req, res) => {
    // O ID do usuário é obtido do token de autenticação (via authMiddleware)
    const userId = req.user.id;
    const mangaId = Number(req.query.mangaid);
    
    // Validações básicas
    if (!mangaId) return res.status(400).json({ message: 'Manga ID é obrigatório' });
    if (isNaN(mangaId)) return res.status(400).json({ message: 'Manga ID deve ser um número' });
    if (mangaId <= 0) return res.status(400).json({ message: 'Manga ID deve ser um número positivo' });
    if (!Number.isInteger(mangaId)) return res.status(400).json({ message: 'Manga ID deve ser um número inteiro' });

    try{
        // Verifica se o mangá existe
        const mangaCheck = await pool.query('SELECT id FROM manga WHERE id = $1', [mangaId]);
        if (mangaCheck.rowCount === 0) {
            return res.status(404).json({ message: 'Mangá não encontrado' });
        }
        
        // Verifica se o usuário já deu bookmark nesse mangá
        const bookmarkCheck = await pool.query('SELECT user_id, manga_id FROM bookmark WHERE user_id = $1 AND manga_id = $2', [userId, mangaId]);
        if (bookmarkCheck.rowCount > 0) return res.status(200).json({ bookmarked: true });
        else return res.status(200).json({ bookmarked: false });

    } catch (error) {
        console.error('Erro ao verificar bookmark:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
module.exports = {
    bookmarkManga,
    checkBookmark
};