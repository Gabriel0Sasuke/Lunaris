import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import ScanMiddleware from '../middleware/scan.middleware';
import AdminMiddleware from '../middleware/admin.middleware';
import * as mangaController from '../controllers/manga.controller';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]);

const mangaLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: 'Muitos pedidos vindos deste IP, por favor tente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Incrementar views
router.post('/view', mangaLimiter, mangaController.IncrementViews);

// Listar mangás
router.get('/list', mangaController.ListMangas);

// Detalhes de um mangá por ID
router.get('/page', mangaController.catchMangaById);

// Criar mangá
router.post('/create', mangaLimiter, ScanMiddleware, uploadFields, mangaController.CreateManga);

// Deletar mangá (admin)
router.delete('/delete', AdminMiddleware, mangaController.DeleteManga);

export default router;
