const express = require('express');
const Router = express.Router();
const mangaController = require('../controllers/manga.controller');
const ScanMiddleware = require('../middleware/scan.middleware');
const AdminMiddleware = require('../middleware/admin.middleware');
const multer = require('multer');
const rateLimit = require('express-rate-limit');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFields = upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]);
const mangaLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 3, // Limite de 3 pedidos por IP para rotas de mangá
    message: "Muitos pedidos vindos deste IP, por favor tente mais tarde.",
    standardHeaders: true,
    legacyHeaders: false,
});
//Rota para aumentar a contagem de views de um mangá
Router.post('/view', mangaLimiter, mangaController.IncrementViews);
// Rota para listar todas as mangas
Router.get('/list', mangaController.ListMangas);

// Rota para obter detalhes de um mangá específico por ID
Router.get('/page', mangaController.catchMangaById);

// Rota para criar um novo mangá
Router.post('/create', mangaLimiter, ScanMiddleware, uploadFields, mangaController.CreateManga);

// Rota para deletar um mangá, disponivel apenas para administradores
Router.delete('/delete', AdminMiddleware, mangaController.DeleteManga);

module.exports = Router;