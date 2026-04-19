import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware simples de autenticação
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Não Autorizado: Token Ausente' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // Usamos (req as any) para evitar ter que usar "declare global" avançado
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Não Autorizado: Token Inválido' });
  }
};

export default authMiddleware;

