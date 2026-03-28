const express = require('express');
const Router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');
const multer = require('multer');

// Cadastro
Router.post('/cadastro', authController.cadastro);

// Login
Router.post('/login', authController.login);

//Verificação
Router.get('/me', authMiddleware, authController.verificacao);

// Logout
Router.get('/logout', authController.logout);

//Google
Router.post('/google', authController.google);

//Verificar se ta online
Router.post('/online', authMiddleware, authController.online);

// Verifica disponibilidade de username/email para edição de perfil
Router.get('/update/availability', authMiddleware, authController.checkUpdateAvailability);

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFields = upload.fields([
    { name: 'profile', maxCount: 1 }
]);

// Rota para atualizar os dados do usuário
Router.put('/update', authMiddleware, uploadFields, authController.updateProfile);
module.exports = Router;