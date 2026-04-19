import { Request, Response } from 'express';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import pool from '../database/sql';
import r2 from '../database/bucket';
import {
  listMangasSchema,
  mangaByIdSchema,
  mangaIdBodySchema,
  createMangaSchema,
} from '../schemas/manga.schema';

// ──────────────────────────────────────────────
// Funções Auxiliares
// ──────────────────────────────────────────────
const buildObjectUrl = (baseUrl: string, key: string): string =>
  `${baseUrl}/${key.replace(/^\/+/, '')}`;

const parseTagInput = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === '') return [];
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [trimmed];
      }
    }
    return [trimmed];
  }
  return [value];
};

const LIST_MANGAS_BASE_QUERY = `
  SELECT J.*, COALESCE(STRING_AGG(DISTINCT TA.name, '||' ORDER BY TA.name), '') AS tag_names,
  ROUND(AVG(R.rating)::numeric, 1) AS avg_rating
  FROM manga J
  LEFT JOIN manga_tags MT_ALL ON J.id = MT_ALL.manga_id
  LEFT JOIN tags TA ON MT_ALL.tag_id = TA.id
  LEFT JOIN rating R ON J.id = R.manga_id
`;

// ──────────────────────────────────────────────
// Listar mangás
// ──────────────────────────────────────────────
export const ListMangas = async (req: Request, res: Response): Promise<void> => {
  const rawQuery = {
    tag: req.query.tag,
    limit: req.query.limit ?? req.query.max ?? req.query.MAX,
    type: req.query.type,
    orderBy: req.query.orderBy ?? req.query.orderby,
    status: req.query.status,
    search: req.query.search,
  };

  const parsed = listMangasSchema.safeParse(rawQuery);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  
  const { tag: tagId, limit, type: rawType, orderBy: rawOrderBy, status: rawStatus, search: rawSearch } = parsed.data;

  const hasTag = tagId !== undefined;
  const hasLimit = limit !== undefined;
  const hasType = typeof rawType === 'string' && rawType.trim() !== '' && rawType !== 'all';
  const hasStatus = typeof rawStatus === 'string' && rawStatus.trim() !== '' && rawStatus !== 'all';
  const hasSearch = typeof rawSearch === 'string' && rawSearch.trim() !== '';

  const orderByMap: any = {
    'A-Z': 'J.titulo ASC',
    'Z-A': 'J.titulo DESC',
    views: 'J.views DESC',
    top: 'J.views DESC',
    recent: 'J.created_at DESC',
    rating: 'avg_rating DESC NULLS LAST',
  };
  const orderBy = orderByMap[rawOrderBy || ''] || orderByMap['A-Z'];

  const queryParams: any[] = [];
  const whereClauses: string[] = [];

  if (hasTag) {
    queryParams.push(tagId);
    whereClauses.push(`EXISTS (SELECT 1 FROM manga_tags MT_FILTER WHERE MT_FILTER.manga_id = J.id AND MT_FILTER.tag_id = $${queryParams.length})`);
  }
  if (hasType) {
    queryParams.push((rawType as string).trim());
    whereClauses.push(`J.tipo = $${queryParams.length}`);
  }
  if (hasStatus) {
    queryParams.push((rawStatus as string).trim());
    whereClauses.push(`J.status = $${queryParams.length}`);
  }
  if (hasSearch) {
    queryParams.push(`%${(rawSearch as string).trim()}%`);
    whereClauses.push(`(J.titulo ILIKE $${queryParams.length} OR J.autor ILIKE $${queryParams.length} OR J.artista ILIKE $${queryParams.length})`);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const limitSql = hasLimit ? `LIMIT $${queryParams.length + 1}` : '';

  const query = `${LIST_MANGAS_BASE_QUERY} ${whereSql} GROUP BY J.id ORDER BY ${orderBy} ${limitSql}`;
  if (hasLimit) queryParams.push(limit);

  try {
    const result = await pool.query(query, queryParams);
    res.status(200).json({ manga: result.rows });
  } catch (error) {
    console.error('Error fetching mangas:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ──────────────────────────────────────────────
// Buscar mangá por ID
// ──────────────────────────────────────────────
export const catchMangaById = async (req: Request, res: Response): Promise<void> => {
  const parsed = mangaByIdSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { id: mangaId } = parsed.data;

  const query = `
    WITH ranked_manga AS (
      SELECT J.*, DENSE_RANK() OVER (ORDER BY J.views DESC NULLS LAST) AS rank_position
      FROM manga J
    )
    SELECT RM.*, COALESCE(TAGS.tag_names, '') AS tag_names, COALESCE(TAGS.tags, '[]'::json) AS tags,
           COALESCE(BM.bookmarks, 0) AS bookmarks, RT.avg_rating
    FROM ranked_manga RM
    LEFT JOIN LATERAL (
      SELECT
        COALESCE(STRING_AGG(T.name, '||' ORDER BY T.name), '') AS tag_names,
        COALESCE(JSON_AGG(JSON_BUILD_OBJECT('name', T.name, 'icon', T.icon) ORDER BY T.name), '[]'::json) AS tags
      FROM (
        SELECT DISTINCT TA.id, TA.name, TA.icon
        FROM manga_tags MT_ALL
        LEFT JOIN tags TA ON MT_ALL.tag_id = TA.id
        WHERE MT_ALL.manga_id = RM.id AND TA.id IS NOT NULL
      ) T
    ) TAGS ON TRUE
    LEFT JOIN LATERAL (SELECT COUNT(*)::int AS bookmarks FROM bookmark B WHERE B.manga_id = RM.id) BM ON TRUE
    LEFT JOIN LATERAL (SELECT ROUND(AVG(R.rating)::numeric, 1) AS avg_rating FROM rating R WHERE R.manga_id = RM.id) RT ON TRUE
    WHERE RM.id = $1
  `;
  try {
    const result = await pool.query(query, [mangaId]);
    if (!result.rows[0]) { 
      res.status(404).json({ message: 'Mangá não encontrado' }); 
      return; 
    }
    res.status(200).json({ manga: result.rows[0] });
  } catch (error) {
    console.error('Error fetching manga by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ──────────────────────────────────────────────
// Criar mangá
// ──────────────────────────────────────────────
export const CreateManga = async (req: Request, res: Response): Promise<void> => {
  const parsed = createMangaSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Campos Requeridos Ausentes' });
    return;
  }
  const { title, synopsis, type, demographic, releaseDate, status, author, artist } = parsed.data;

  const rawTags = req.body.genres ?? req.body['genres[]'];
  const tagsArray = parseTagInput(rawTags)
    .map((tag: any) => String(tag).trim())
    .filter(Boolean);

  if (tagsArray.length === 0) {
    res.status(400).json({ message: 'Campos Requeridos Ausentes' });
    return;
  }

  const tagIds = [...new Set(tagsArray.map((tag: any) => Number(tag)).filter((id: any) => Number.isInteger(id) && id > 0))];
  if (tagIds.length !== tagsArray.length) {
    res.status(400).json({ message: 'As tags devem ser enviadas por ID numérico válido' });
    return;
  }

  // Pegar arquivos de forma mais simples e flexível
  const reqFiles: any = req.files || {};
  const banner = reqFiles['banner'] ? reqFiles['banner'][0] : null;
  const cover = reqFiles['cover'] ? reqFiles['cover'][0] : null;

  if (!banner || !cover) { 
    res.status(400).json({ message: 'Imagens de banner e capa são obrigatórias' }); 
    return; 
  }
  if (banner.size > 5 * 1024 * 1024 || cover.size > 5 * 1024 * 1024) {
    res.status(400).json({ message: 'Tamanho máximo de imagem excedido (5MB)' });
    return;
  }

  const titleSlug = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  const bannerKey = `banners/${titleSlug}-${crypto.randomUUID()}.jpeg`;
  const coverKey = `covers/${titleSlug}-${crypto.randomUUID()}.jpeg`;
  const bucketName = process.env.R2_BUCKET_NAME;
  const r2BaseUrl = process.env.R2_BASE_URL || process.env.R2_PUBLIC_URL;

  if (!bucketName || !r2BaseUrl) { 
    res.status(500).json({ message: 'Internal Server Error' }); 
    return; 
  }

  let client: any = undefined;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    
    await Promise.all([
      r2.send(new PutObjectCommand({ Bucket: bucketName, Key: bannerKey, Body: banner.buffer, ContentType: banner.mimetype })),
      r2.send(new PutObjectCommand({ Bucket: bucketName, Key: coverKey, Body: cover.buffer, ContentType: cover.mimetype })),
    ]);

    const bannerUrl = buildObjectUrl(r2BaseUrl, bannerKey);
    const coverUrl = buildObjectUrl(r2BaseUrl, coverKey);

    const mangaRes = await client.query(
      'INSERT INTO manga (titulo, sinopse, tipo, demografia, releasedate, status, autor, artista, banner, foto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      [title, synopsis, type, demographic, releaseDate, status, author, artist, bannerUrl, coverUrl]
    );
    const mangaId = mangaRes.rows[0].id;

    const tagsRes = await client.query(
      'SELECT id FROM tags WHERE id = ANY($1::int[])',
      [tagIds]
    );
    
    if (tagsRes.rows.length !== tagIds.length) {
      await client.query('ROLLBACK');
      res.status(400).json({ message: 'Uma ou mais tags informadas não existem' });
      return;
    }

    const valuesFlat: number[] = [];
    const placeholders = tagIds.map((tagId: any, index: number) => {
      const base = index * 2;
      valuesFlat.push(mangaId, tagId);
      return `($${base + 1}, $${base + 2})`;
    }).join(', ');

    await client.query(`INSERT INTO manga_tags (manga_id, tag_id) VALUES ${placeholders}`, valuesFlat);
    await client.query('COMMIT');
    res.status(201).json({ message: 'Mangá criado com sucesso' });
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    try {
      await Promise.all([
        r2.send(new DeleteObjectCommand({ Bucket: bucketName, Key: bannerKey })),
        r2.send(new DeleteObjectCommand({ Bucket: bucketName, Key: coverKey })),
      ]);
    } catch (deleteError) {
      console.error('Erro ao limpar arquivos no R2:', deleteError);
    }
    console.error('Erro geral no CreateManga:', err);
    res.status(500).json({ message: 'Erro ao criar o mangá' });
  } finally {
    if (client) client.release();
  }
};

// ──────────────────────────────────────────────
// Incrementar views
// ──────────────────────────────────────────────
export const IncrementViews = async (req: Request, res: Response): Promise<void> => {
  const parsed = mangaIdBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { mangaId } = parsed.data;

  try {
    const result = await pool.query(
      'UPDATE manga SET views = COALESCE(views, 0) + 1 WHERE id = $1 RETURNING views',
      [mangaId]
    );
    if (!result.rows[0]) { 
      res.status(404).json({ message: 'Mangá não encontrado' }); 
      return; 
    }
    res.status(200).json({ views: result.rows[0].views });
  } catch (error) {
    console.error('Error incrementing manga views:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ──────────────────────────────────────────────
// Deletar mangá
// ──────────────────────────────────────────────
export const DeleteManga = async (req: Request, res: Response): Promise<void> => {
  const parsed = mangaIdBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }
  const { mangaId } = parsed.data;

  const bucketName = process.env.R2_BUCKET_NAME;
  const r2BaseUrl = process.env.R2_BASE_URL || process.env.R2_PUBLIC_URL;

  const extractKey = (url: string | null): string | null => {
    if (!url || !r2BaseUrl) return null;
    if (url.startsWith(r2BaseUrl)) return url.slice(r2BaseUrl.length).replace(/^\/+/, '');
    return null;
  };

  try {
    const result = await pool.query(
      'DELETE FROM manga WHERE id = $1 RETURNING banner, foto',
      [mangaId]
    );
    
    if (!result.rows[0]) { 
      res.status(404).json({ message: 'Mangá não encontrado' }); 
      return; 
    }

    const bannerKey = extractKey(result.rows[0].banner);
    const fotoKey = extractKey(result.rows[0].foto);
    const deletePromises: any[] = [];
    
    if (bannerKey) deletePromises.push(r2.send(new DeleteObjectCommand({ Bucket: bucketName, Key: bannerKey })));
    if (fotoKey) deletePromises.push(r2.send(new DeleteObjectCommand({ Bucket: bucketName, Key: fotoKey })));
    if (deletePromises.length > 0) await Promise.allSettled(deletePromises);

    res.status(200).json({ message: 'Mangá deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting manga:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

