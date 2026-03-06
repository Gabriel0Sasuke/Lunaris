const express = require('express');
const Router = express.Router();
const mangaController = require('../controllers/manga.controller');
const ScanMiddleware = require('../middleware/scan.middleware');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFields = upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]);
// Rota para listar todas as mangas
Router.get('/list', mangaController.getAllMangas);

// Rota para criar um novo mangá
Router.post('/create', ScanMiddleware, uploadFields, mangaController.CreateManga);

module.exports = Router;