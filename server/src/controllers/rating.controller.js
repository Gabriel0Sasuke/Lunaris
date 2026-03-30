const { response } = require('express');
const pool = require('../database/sql');

const RatingManga = async (req, res) => {
    const { mangaId, rating } = req.body;
    const userid = req.user.id;

    if (!userid || isNaN(Number(userid))) return res.status(400).json({ message: 'ID do Usúario é necessario e deve ser um número válido' });
    if (!mangaId || isNaN(Number(mangaId))) return res.status(400).json({ message: 'ID do Mangá é necessario e deve ser um número válido' });
    if (!rating || isNaN(Number(rating)) || (rating < 1 || rating > 5)) return res.status(400).json({ message: 'Nota da Avaliação é necessaria e deve estar entre 1 e 5' });
    let query = "";
    try{
        if(await verifyRating(mangaId, userid)){
            // Usuario Já Avaliou Aquele Mangá
            query = "UPDATE rating SET rating = $1 WHERE manga_id = $2 AND user_id = $3";
        }else{
            // Usuario Ainda não Avaliou Aquele Mangá
            query = "INSERT INTO rating (rating, manga_id, user_id) VALUES ($1, $2, $3)";
        }
        await pool.query(query, [rating, mangaId, userid]);
        return res.status(200).json({ message: "Avaliação criada/atualizada com sucesso" })
    }catch(e){
        return res.status(500).json({ message: "Erro Interno do Servidor ou mangá não encontrado" });
    }
    
}
const verifyRating = async (mangaId, userid) => {
    const query = "SELECT 1 FROM rating WHERE manga_id = $1 AND user_id = $2"

    try{
        const { rows } = await pool.query(query, [mangaId, userid])
        if(!rows[0]){
            return false; // Usuario Ainda Não Avaliou Aquele Mangá
        }else {
            return true // Usuario Já Avaliou Aquele Mangá
        }
    }catch(e){
        throw new Error('Erro ao Consultar Avaliação do Usúario')
    }
}
const getUserRating = async (mangaId, userid) => {
    const query = "SELECT rating FROM rating WHERE manga_id = $1 AND user_id = $2 LIMIT 1";

    try{
        const { rows } = await pool.query(query, [mangaId, userid]);
        return rows[0] ? Number(rows[0].rating) : 0;
    }catch(e){
        throw new Error('Erro ao Consultar Avaliação do Usúario');
    }
}
const checkRating = async (req, res) => {
    const mangaId = req.query.mangaId;
    const userid = req.user.id;

    if (!userid || isNaN(Number(userid))) return res.status(400).json({ message: 'ID do Usúario é necessario e deve ser um número válido' });
    if (!mangaId || isNaN(Number(mangaId))) return res.status(400).json({ message: 'ID do Mangá é necessario e deve ser um número válido' });

    try{
        const userRating = await getUserRating(mangaId, userid);

        if(userRating > 0){
            // Usuario Já Avaliou Aquele Mangá
            return res.status(200).json({ rated: true, rating: userRating });
        }else{
            // Usuario Ainda não Avaliou Aquele Mangá
            return res.status(200).json({ rated: false, rating: 0 });
        }
    }catch(e){
        return res.status(500).json({ message: "Erro Interno do Servidor" });
    }
}
module.exports = {
    RatingManga,
    checkRating
}