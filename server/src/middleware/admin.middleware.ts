import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database/sql';

// Middleware simples para admins
const AdminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      // Simplificamos o uso do pool.query sem Generics complicados
      const result = await pool.query('SELECT account_type FROM usuario WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(401).json({ message: 'Não Autorizado: Usuário Não Encontrado' });
        return;
      }

      if (result.rows[0].account_type !== 'admin') {
        res.status(403).json({ message: 'Proibido: Acesso Negado' });
        return;
      }
      
      next();
    } catch (err) {
      console.error('Erro AdminMiddleware:', err);
      res.status(500).json({ message: 'Erro Interno do Servidor' });
    }
  } catch {
    res.status(401).json({ message: 'Não Autorizado: Token Inválido' });
  }
};

export default AdminMiddleware;

