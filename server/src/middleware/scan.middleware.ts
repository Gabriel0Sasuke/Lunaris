import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database/sql';

// Middleware simples para admins e scans
const ScanMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Não Autorizado: Token Ausente' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    (req as any).user = decoded;
    const id = decoded.id;

    try {
      const result = await pool.query('SELECT account_type FROM usuario WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(401).json({ message: 'Não Autorizado: Usuário Não Encontrado' });
        return;
      }

      const accountType = result.rows[0].account_type;
      if (accountType !== 'admin' && accountType !== 'scan') {
        res.status(403).json({ message: 'Proibido: Acesso Negado' });
        return;
      }
      
      next();
    } catch (err) {
      console.error('Erro ScanMiddleware:', err);
      res.status(500).json({ message: 'Erro Interno do Servidor' });
    }
  } catch {
    res.status(401).json({ message: 'Não Autorizado: Token Inválido' });
  }
};

export default ScanMiddleware;

