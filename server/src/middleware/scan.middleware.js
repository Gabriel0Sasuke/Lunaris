const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('../database/sql');

// Middleware de autenticação
const ScanMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Não Autorizado: Token Ausente' });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const id = decoded.id;
        const query = "SELECT account_type FROM usuario WHERE id = $1";
        try{
            const { rows } = await pool.query(query, [id]);
            if(rows.length === 0){
                return res.status(401).json({ message: 'Não Autorizado: Usuário Não Encontrado' });
            }
            const user = rows[0];
            if(user.account_type !== 'admin' && user.account_type !== 'scan'){
                return res.status(403).json({ message: 'Proibido: Acesso Negado' });
            }
            next();
        }catch(err){
            console.error('Erro ScanMiddleware:', err.message);
            return res.status(500).json({ message: 'Erro Interno do Servidor' });
        }
        // Verificar se o usuário tem a role 'admin' ou 'scan'
    }catch (err) {
        return res.status(401).json({ message: 'Não Autorizado: Token Inválido' });
    }
}
module.exports = ScanMiddleware;