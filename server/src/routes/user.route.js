const express = require('express');
const Router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');
const ratingController = require('../controllers/rating.controller');

// Rotas de usuário

// Rota para dar bookmark em um mangá
Router.patch('/bookmark/toggle', authMiddleware, userController.bookmarkManga);

// Rota para avaliar um mangá
Router.post('/rating', authMiddleware, ratingController.RatingManga);

// Rota para verificar se um mangá está nos bookmarks do usuário
Router.get('/bookmark/check', authMiddleware, userController.checkBookmark);

// Rota para obter todos os titulos disponiveis
Router.get('/titles', userController.getTitles);

// Rota para verificar se o usúario já avaliou um mangá em especifico
Router.get('/rating/check', authMiddleware, ratingController.checkRating)

module.exports = Router;