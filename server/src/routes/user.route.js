const express = require('express');
const Router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// Rotas de usuário

// Rota para dar bookmark em um mangá
Router.patch('/bookmark/toggle', authMiddleware, userController.bookmarkManga);

// Rota para verificar se um mangá está nos bookmarks do usuário
Router.get('/bookmark/check', authMiddleware, userController.checkBookmark);

// Rota para obter todos os titulos disponiveis
Router.get('/titles', userController.getTitles);

module.exports = Router;