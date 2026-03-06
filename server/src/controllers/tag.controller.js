const pool = require('../database/sql');

const normalizeSlug = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const listTags = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, slug, icon, prioridade FROM tags ORDER BY prioridade DESC, name ASC');
        res.json(rows);
    } catch (err) {
        console.error('Erro listTags:', err.message);
        res.status(500).json({ message: 'Erro Interno do Servidor' });
    }
};
const addTag = async (req, res) => {
    const name = req.body?.name?.trim();
    const rawSlug = req.body?.slug?.trim();
    const icon = req.body?.icon?.trim();
    const slug = normalizeSlug(rawSlug || name || '');

    if (!name || !slug || !icon) {
        return res.status(400).json({ message: 'Nome, slug e ícone são obrigatórios' });
    }

    if (name.length > 15 || slug.length > 15) {
        return res.status(400).json({ message: 'Nome e slug devem ter no máximo 15 caracteres' });
    }

    if (!icon.includes('<svg') || !icon.includes('</svg>')) {
        return res.status(400).json({ message: 'O ícone deve ser um SVG válido' });
    }

    const query = 'INSERT INTO tags (name, slug, icon) VALUES (?, ?, ?)';
    try {
        const [result] = await pool.query(query, [name, slug, icon]);
        res.status(201).json({ message: 'Tag adicionada com sucesso', tag: { id: result.insertId, name, slug, icon } });
    } catch (err) {
        if (err && err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Já existe uma tag com esse nome ou slug' });
        }
        console.error('Erro addTag:', err.message);
        res.status(500).json({ message: 'Erro Interno do Servidor' });
    }
}

module.exports = {
    listTags,
    addTag
};