const pool = require('../database/sql');
const r2 = require('../database/bucket');
const { PutObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const crypto = require('crypto');

const buildObjectUrl = (baseUrl, key) => `${baseUrl}/${key.replace(/^\/+/, '')}`;

const LIST_MANGAS_BASE_QUERY = `
    SELECT J.*, COALESCE(STRING_AGG(DISTINCT TA.name, '||' ORDER BY TA.name), '') AS tag_names
    FROM manga J
    LEFT JOIN manga_tags MT_ALL ON J.id = MT_ALL.manga_id
    LEFT JOIN tags TA ON MT_ALL.tag_id = TA.id
`;

const parseTagInput = (value) => {
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

const ListMangas = async (req, res) => {
    // Pegando Dados Brutos do Client
    const rawTag = req.query.tag;
    const rawLimit = req.query.max ?? req.query.MAX;
    const rawType = req.query.type;
    const rawOrderBy = req.query.orderby;
    const rawStatus = req.query.status;
    const rawSearch = req.query.search;

    // Tratando Dados
    const hasTag = rawTag !== undefined && rawTag !== null && rawTag !== '';
    const hasLimit = rawLimit !== undefined && rawLimit !== null && rawLimit !== '';
    const hasType = typeof rawType === 'string' && rawType.trim() !== '' && rawType !== 'all';
    const hasStatus = typeof rawStatus === 'string' && rawStatus.trim() !== '' && rawStatus !== 'all';
    const hasSearch = typeof rawSearch === 'string' && rawSearch.trim() !== '';

    // Validando Dados
    let tagId;
    if (hasTag) {
        tagId = Number(rawTag);
        if (!Number.isInteger(tagId) || tagId <= 0) {
            return res.status(400).json({ message: 'Tag inválida. Envie um ID numérico maior que 0.' });
        }
    }

    let limit;
    if (hasLimit) {
        limit = Number(rawLimit);
        if (!Number.isInteger(limit) || limit <= 0) {
            return res.status(400).json({ message: 'Limite inválido. Deve ser um número inteiro maior que 0.' });
        }
    }
    // Mapa de Ordenamento Permitida
    const orderByMap = {
        'A-Z': 'J.titulo ASC',
        'Z-A': 'J.titulo DESC',
        views: 'J.views DESC',
        recent: 'J.created_at DESC'
    };
    const orderBy = orderByMap[rawOrderBy] || orderByMap['A-Z'];

    const queryParams = [];
    const whereClauses = [];

    if (hasTag) {
        queryParams.push(tagId);
        whereClauses.push(`EXISTS (SELECT 1 FROM manga_tags MT_FILTER WHERE MT_FILTER.manga_id = J.id AND MT_FILTER.tag_id = $${queryParams.length})`);
    }

    if (hasType) {
        queryParams.push(String(rawType).trim());
        whereClauses.push(`J.tipo = $${queryParams.length}`);
    }

    if (hasStatus) {
        queryParams.push(String(rawStatus).trim());
        whereClauses.push(`J.status = $${queryParams.length}`);
    }

    if (hasSearch) {
        queryParams.push(`%${String(rawSearch).trim()}%`);
        whereClauses.push(`(J.titulo ILIKE $${queryParams.length} OR J.autor ILIKE $${queryParams.length} OR J.artista ILIKE $${queryParams.length})`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const limitSql = hasLimit ? `LIMIT $${queryParams.length + 1}` : '';

    const query = `
        ${LIST_MANGAS_BASE_QUERY}
        ${whereSql}
        GROUP BY J.id
        ORDER BY ${orderBy}
        ${limitSql}
    `;

    if (hasLimit) queryParams.push(limit);

    // Executando Consulta
    try {
        const { rows } = await pool.query(query, queryParams);
        return res.status(200).json({ manga: rows });
    } catch (error) {
        console.error('Error fetching mangas:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Rota para criar um novo mangá
const CreateManga = async (req, res) => {
    const { title, synopsis, type, demographic, releaseDate, status, author, artist } = req.body;
    const rawTags = req.body.genres ?? req.body['genres[]'];
    const tagsArray = parseTagInput(rawTags)
        .map((tag) => String(tag).trim())
        .filter(Boolean);

    // Verificações básicas
    if (!title || !synopsis || !type || !demographic || !releaseDate || !status || !author || !artist || tagsArray.length === 0) {
        return res.status(400).json({ message: 'Campos Requeridos Ausentes' });
    }

    const tagIds = [...new Set(tagsArray.map((tag) => Number(tag)).filter((tagId) => Number.isInteger(tagId) && tagId > 0))];
    if (tagIds.length !== tagsArray.length) {
        return res.status(400).json({ message: 'As tags devem ser enviadas por ID numérico válido' });
    }

    const banner = req.files?.banner?.[0];
    const cover = req.files?.cover?.[0];
    
    if (!banner || !cover) {
        return res.status(400).json({ message: 'Imagens de banner e capa são obrigatórias' });
    }
    if (banner.size > 5 * 1024 * 1024 || cover.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'Tamanho máximo de imagem excedido (5MB)' });
    }
    const titleSlug = title.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    const bannerKey = `banners/${titleSlug}-${crypto.randomUUID()}.jpeg`;
    const coverKey = `covers/${titleSlug}-${crypto.randomUUID()}.jpeg`;
    const bucketName = process.env.R2_BUCKET_NAME;
    const r2BaseUrl = process.env.R2_BASE_URL || process.env.R2_PUBLIC_URL;

    if (!bucketName || !r2BaseUrl) {
        return res.status(500).json({ message: 'Configuração do bucket incompleta (R2_BUCKET_NAME/R2_BASE_URL)' });
    }

    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');
        await Promise.all([
            r2.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: bannerKey,
                Body: banner.buffer,
                ContentType: banner.mimetype,
            })),
            r2.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: coverKey,
                Body: cover.buffer,
                ContentType: cover.mimetype,
            }))
        ]);
        const bannerUrl = buildObjectUrl(r2BaseUrl, bannerKey);
        const coverUrl = buildObjectUrl(r2BaseUrl, coverKey);

        const query = "INSERT INTO manga (titulo, sinopse, tipo, demografia, releasedate, status, autor, artista, banner, foto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";
        const values = [title, synopsis, type, demographic, releaseDate, status, author, artist, bannerUrl, coverUrl];
        const { rows: mangaRows } = await client.query(query, values);
        const mangaId = mangaRows[0]?.id;

        const { rows: existingTags } = await client.query('SELECT id FROM tags WHERE id = ANY($1::int[])', [tagIds]);
        if (existingTags.length !== tagIds.length) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Uma ou mais tags informadas não existem' });
        }

        const valuesFlat = [];
        const placeholders = tagIds.map((tagId, index) => {
            const base = index * 2;
            valuesFlat.push(mangaId, tagId);
            return `($${base + 1}, $${base + 2})`;
        }).join(', ');

        await client.query(`INSERT INTO manga_tags (manga_id, tag_id) VALUES ${placeholders}`, valuesFlat);
        await client.query('COMMIT');
        return res.status(201).json({ message: 'Mangá criado com sucesso' });
    } catch (err) {
        if (client) await client.query('ROLLBACK');

        try {
            await Promise.all([
                r2.send(new DeleteObjectCommand({ Bucket: bucketName, Key: bannerKey })),
                r2.send(new DeleteObjectCommand({ Bucket: bucketName, Key: coverKey }))
            ]);
        } catch (deleteError) {
            console.error('Erro ao limpar arquivos no R2:', deleteError);
        }

        console.error('Erro geral no CreateManga:', err);
        return res.status(500).json({ message: 'Erro ao criar o mangá' });
    } finally {
        if (client) client.release();
    }
}
module.exports = {
    CreateManga,
    ListMangas
}