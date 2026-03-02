const express = require('express');
const Router = express.Router();

// Rota para verificar se o sistema está online
Router.get('/online', (req, res) => {
    res.status(200).json({ message: 'Sistema online' });
});

module.exports = Router;