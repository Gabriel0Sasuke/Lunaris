import { Router } from 'express';
import ScanMiddleware from '../middleware/scan.middleware';
import * as tagController from '../controllers/tag.controller';

const router = Router();

// Listar todas as tags
router.get('/list', tagController.listTags);

// Adicionar uma nova tag
router.post('/add', ScanMiddleware, tagController.addTag);

export default router;
