import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import * as userController from '../controllers/user.controller';
import * as ratingController from '../controllers/rating.controller';

const router = Router();

// Dar/remover bookmark em um mangá
router.patch('/bookmark/toggle', authMiddleware, userController.bookmarkManga);

// Avaliar um mangá
router.post('/rating', authMiddleware, ratingController.RatingManga);

// Verificar se um mangá está nos bookmarks
router.get('/bookmark/check', authMiddleware, userController.checkBookmark);

// Listar todos os títulos disponíveis
router.get('/titles', userController.getTitles);

// Verificar se o usuário já avaliou um mangá
router.get('/rating/check', authMiddleware, ratingController.checkRating);

export default router;
