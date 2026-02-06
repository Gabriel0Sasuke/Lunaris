const express = require('express');
require('dotenv').config();
const Router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');


// Cadastro
Router.post('/cadastro', authController.cadastro);

// Login
Router.post('/login', authController.login);

//Verificação
Router.get('/me', authMiddleware, authController.verificacao);

// Logout
Router.get('/logout', authController.logout);

module.exports = Router;