import { Router } from 'express';
import multer from 'multer';
import authMiddleware from '../middleware/auth.middleware';
import * as authController from '../controllers/auth.controller';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  },
});

const uploadFields = upload.fields([{ name: 'profile', maxCount: 1 }]);

// Cadastro
router.post('/cadastro', authController.cadastro);

// Login
router.post('/login', authController.login);

// Verificação
router.get('/me', authMiddleware, authController.verificacao);

// Logout
router.get('/logout', authController.logout);

// Google
router.post('/google', authController.google);

// Atualizar status online
router.post('/online', authMiddleware, authController.online);

// Verificar disponibilidade de username/email
router.get('/update/availability', authMiddleware, authController.checkUpdateAvailability);

// Atualizar perfil
router.put('/update', authMiddleware, uploadFields, authController.updateProfile);

export default router;
