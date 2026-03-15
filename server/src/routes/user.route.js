const express = require('express');
require('dotenv').config();
const Router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// Rotas de usuário

// Rota para dar bookmark em um mangá
Router.post('/bookmark', authMiddleware, userController.bookmarkManga);

// Rota para verificar se um mangá está nos bookmarks do usuário
Router.get('/bookmark/check', authMiddleware, userController.checkBookmark);

module.exports = Router;