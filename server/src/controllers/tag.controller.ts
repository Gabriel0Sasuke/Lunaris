import { Request, Response } from 'express';
import pool from '../database/sql';
import { addTagSchema } from '../schemas/tag.schema';

const normalizeSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const listTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, name, slug, icon, prioridade FROM tags ORDER BY prioridade DESC, name ASC'
    );
    res.status(200).json({ tags: result.rows });
  } catch (err: any) {
    console.error('Erro listTags:', err.message);
    res.status(500).json({ message: 'Erro Interno do Servidor' });
  }
};

export const addTag = async (req: Request, res: Response): Promise<void> => {
  const parsed = addTagSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { name, slug: rawSlug, icon } = parsed.data;
  const slug = normalizeSlug(rawSlug ?? name);

  if (slug.length > 15) {
    res.status(400).json({ message: 'Nome e slug devem ter no máximo 15 caracteres' });
    return;
  }

  try {
    const result = await pool.query(
      'INSERT INTO tags (name, slug, icon) VALUES ($1, $2, $3) RETURNING id',
      [name, slug, icon]
    );
    res.status(201).json({ 
      message: 'Tag adicionada com sucesso', 
      tag: { id: result.rows[0].id, name, slug, icon } 
    });
  } catch (err: any) {
    if (err.code === '23505') { 
      res.status(409).json({ message: 'Já existe uma tag com esse nome ou slug' }); 
      return; 
    }
    console.error('Erro addTag:', err.message);
    res.status(500).json({ message: 'Erro Interno do Servidor' });
  }
};

