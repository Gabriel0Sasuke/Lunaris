import { Request, Response } from 'express';
import pool from '../database/sql';
import { ratingBodySchema, checkRatingQuerySchema } from '../schemas/user.schema';

const verifyRating = async (mangaId: number, userId: number): Promise<boolean> => {
  const result = await pool.query('SELECT 1 FROM rating WHERE manga_id = $1 AND user_id = $2', [mangaId, userId]);
  return result.rows.length > 0;
};

const getUserRating = async (mangaId: number, userId: number): Promise<number> => {
  const result = await pool.query(
    'SELECT rating FROM rating WHERE manga_id = $1 AND user_id = $2 LIMIT 1',
    [mangaId, userId]
  );
  return result.rows[0] ? Number(result.rows[0].rating) : 0;
};

export const RatingManga = async (req: Request, res: Response): Promise<void> => {
  const userid = (req as any).user.id;

  const parsed = ratingBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { mangaId, rating } = parsed.data;

  try {
    const alreadyRated = await verifyRating(mangaId, userid);
    const query = alreadyRated
      ? 'UPDATE rating SET rating = $1 WHERE manga_id = $2 AND user_id = $3'
      : 'INSERT INTO rating (rating, manga_id, user_id) VALUES ($1, $2, $3)';
    await pool.query(query, [rating, mangaId, userid]);
    res.status(200).json({ message: 'Avaliação criada/atualizada com sucesso' });
  } catch {
    res.status(500).json({ message: 'Erro Interno do Servidor ou mangá não encontrado' });
  }
};

export const checkRating = async (req: Request, res: Response): Promise<void> => {
  const userid = (req as any).user.id;

  const parsed = checkRatingQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { mangaId } = parsed.data;

  try {
    const userRating = await getUserRating(mangaId, userid);
    if (userRating > 0) {
      res.status(200).json({ rated: true, rating: userRating });
    } else {
      res.status(200).json({ rated: false, rating: 0 });
    }
  } catch {
    res.status(500).json({ message: 'Erro Interno do Servidor' });
  }
};

