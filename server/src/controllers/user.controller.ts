import { Request, Response } from 'express';
import pool from '../database/sql';
import { bookmarkBodySchema, checkBookmarkQuerySchema } from '../schemas/user.schema';

export const bookmarkManga = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;

  const parsed = bookmarkBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { mangaid: mangaId } = parsed.data;

  try {
    const mangaCheck = await pool.query('SELECT id FROM manga WHERE id = $1', [mangaId]);
    if (mangaCheck.rowCount === 0) { 
      res.status(404).json({ message: 'Mangá não encontrado' }); 
      return; 
    }

    const bookmarkCheck = await pool.query(
      'SELECT user_id, manga_id FROM bookmark WHERE user_id = $1 AND manga_id = $2',
      [userId, mangaId]
    );
    
    if (bookmarkCheck.rowCount! > 0) {
      await pool.query('DELETE FROM bookmark WHERE user_id = $1 AND manga_id = $2', [userId, mangaId]);
      res.status(200).json({ message: 'Bookmark removido' });
    } else {
      await pool.query('INSERT INTO bookmark (user_id, manga_id) VALUES ($1, $2)', [userId, mangaId]);
      res.status(200).json({ message: 'Bookmark adicionado' });
    }
  } catch (error) {
    console.error('Erro ao manipular bookmark:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const checkBookmark = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;

  const parsed = checkBookmarkQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { mangaid: mangaId } = parsed.data;

  try {
    const mangaCheck = await pool.query('SELECT id FROM manga WHERE id = $1', [mangaId]);
    if (mangaCheck.rowCount === 0) { 
      res.status(404).json({ message: 'Mangá não encontrado' }); 
      return; 
    }

    const bookmarkCheck = await pool.query(
      'SELECT user_id, manga_id FROM bookmark WHERE user_id = $1 AND manga_id = $2',
      [userId, mangaId]
    );
    res.status(200).json({ bookmarked: bookmarkCheck.rowCount! > 0 });
  } catch (error) {
    console.error('Erro ao verificar bookmark:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getTitles = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT id, nome FROM titles');
    res.status(200).json({ titles: result.rows });
  } catch (error) {
    console.error('Erro ao obter títulos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

