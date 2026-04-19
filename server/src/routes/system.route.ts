import { Router } from 'express';

const router = Router();

// Rota para verificar se o sistema está online
router.get('/online', (_req, res) => {
  res.status(200).json({ message: 'Sistema online' });
});

export default router;
