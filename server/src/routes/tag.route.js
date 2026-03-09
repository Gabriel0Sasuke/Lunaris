const express = require('express');
const Router = express.Router();
const tagController = require('../controllers/tag.controller');
const ScanMiddleware = require('../middleware/scan.middleware');

// Rota para listar todas as tags
Router.get('/list', tagController.listTags);
// Rota para adicionar uma nova tag
Router.post('/add', ScanMiddleware, tagController.addTag);

module.exports = Router;