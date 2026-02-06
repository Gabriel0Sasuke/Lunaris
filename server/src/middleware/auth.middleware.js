const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Não Autorizado: Token Ausente' });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch (err) {
        return res.status(401).json({ message: 'Não Autorizado: Token Inválido' });
    }
}
module.exports = authMiddleware;