import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import pool from '../database/sql';
import r2 from '../database/bucket';
import {
  cadastroSchema,
  loginSchema,
  googleSchema,
  updateProfileSchema,
} from '../schemas/auth.schema';

// ──────────────────────────────────────────────
// Funções Auxiliares
// ──────────────────────────────────────────────
const buildObjectUrl = (baseUrl: string, key: string): string =>
  `${baseUrl.replace(/\/+$/, '')}/${key.replace(/^\/+/, '')}`;

const getCurrentProfileImageUrl = async (userId: number): Promise<string | null> => {
  // Removido o <Pick<...>>. Em JS/TS simples, pool.query retorna any por padrão.
  const result = await pool.query('SELECT foto FROM usuario WHERE id = $1', [userId]);
  return result.rows[0]?.foto ?? null;
};

const normalizeNullableText = (value: any): string | null => {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  if (!normalized || normalized.toLowerCase() === 'null') return null;
  return normalized;
};

const setAuthCookie = (res: Response, userId: number): void => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '28d' });
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 28 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
};

// ──────────────────────────────────────────────
// Cadastro
// ──────────────────────────────────────────────
export const cadastro = async (req: Request, res: Response): Promise<void> => {
  const result = cadastroSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }
  const { email, password, username } = result.data;

  try {
    const emailLower = email.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO usuario (email, password, username) VALUES ($1, $2, $3)',
      [emailLower, passwordHash, username]
    );
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error: any) {
    if (error.code === '23505') {
      const msg = error.detail || '';
      if (msg.includes('email')) { res.status(409).json({ message: 'Este e-mail já está cadastrado.' }); return; }
      if (msg.includes('username')) { res.status(409).json({ message: 'Este nome de usuário já está em uso.' }); return; }
    }
    res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
};

// ──────────────────────────────────────────────
// Login
// ──────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }
  const { email, password } = result.data;

  try {
    const dbResult = await pool.query('SELECT id, password FROM usuario WHERE email = $1', [email]);
    
    if (dbResult.rows.length === 0) { 
      res.status(401).json({ message: 'Credenciais inválidas' }); 
      return; 
    }

    const user = dbResult.rows[0];
    if (!user.password) { 
      res.status(401).json({ message: 'Credenciais inválidas' }); 
      return; 
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) { 
      res.status(401).json({ message: 'Credenciais inválidas' }); 
      return; 
    }

    setAuthCookie(res, user.id);
    res.status(200).json({ message: 'Login realizado com sucesso' });
  } catch {
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// ──────────────────────────────────────────────
// Verificação
// ──────────────────────────────────────────────
export const verificacao = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;
  const query = `
    SELECT u.id, u.email, u.username, u.xp, t.nome AS titulo, u.titulo AS titulo_id,
           u.foto, u.account_type, u.last_seen, u.created_at, u.scan_afiliada, u.bio, u.ativa
    FROM usuario u
    LEFT JOIN titles t ON u.titulo = t.id
    WHERE u.id = $1
  `;
  try {
    const dbResult = await pool.query(query, [userId]);
    if (dbResult.rows.length === 0) { 
      res.status(404).json({ message: 'Usuário não encontrado' }); 
      return; 
    }

    const user = dbResult.rows[0];
    if (user.ativa.trim() !== 'true') { 
      res.status(403).json({ message: 'Usuário desativado' }); 
      return; 
    }

    await pool.query('UPDATE usuario SET last_seen = NOW() WHERE id = $1', [userId]);
    res.status(200).json({ user });
  } catch {
    res.status(500).json({ message: 'Erro ao verificar usuário' });
  }
};

// ──────────────────────────────────────────────
// Logout
// ──────────────────────────────────────────────
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch {
    res.status(500).json({ message: 'Erro ao fazer logout' });
  }
};

// ──────────────────────────────────────────────
// Google OAuth
// ──────────────────────────────────────────────
export const google = async (req: Request, res: Response): Promise<void> => {
  const result = googleSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }
  const { token } = result.data;

  try {
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData: any = await googleResponse.json();

    try {
      // Tentar pelo Google ID
      const resGoogle = await pool.query('SELECT id FROM usuario WHERE google_id = $1', [userData.sub]);
      if (resGoogle.rows.length > 0) {
        setAuthCookie(res, resGoogle.rows[0].id);
        res.status(200).json({ message: 'Login realizado com sucesso' });
        return;
      }

      // Tentar pelo e-mail (vincular)
      const resEmail = await pool.query('SELECT id FROM usuario WHERE email = $1', [userData.email]);
      if (resEmail.rows.length > 0) {
        await pool.query('UPDATE usuario SET google_id = $1 WHERE id = $2', [userData.sub, resEmail.rows[0].id]);
        setAuthCookie(res, resEmail.rows[0].id);
        res.status(200).json({ message: 'Login realizado com sucesso' });
        return;
      }

      // Criar novo usuário
      const baseUsername = userData.name.replace(/\s/g, '').toLowerCase();
      const sufixo = Math.floor(Math.random() * 10000);
      const username = `${baseUsername}${sufixo}`.slice(0, 25);

      const resNew = await pool.query(
        'INSERT INTO usuario (email, username, google_id, foto) VALUES ($1, $2, $3, $4) RETURNING id',
        [userData.email, username, userData.sub, userData.picture]
      );
      
      setAuthCookie(res, resNew.rows[0].id);
      res.status(200).json({ message: 'Login realizado com sucesso' });
    } catch {
      res.status(500).json({ message: 'Erro ao fazer Login usando Google' });
    }
  } catch {
    res.status(500).json({ message: 'Erro ao Se Conectar com os Servidores da Google' });
  }
};

// ──────────────────────────────────────────────
// Online (atualiza last_seen)
// ──────────────────────────────────────────────
export const online = async (req: Request, res: Response): Promise<void> => {
  const id = (req as any).user.id;
  try {
    await pool.query('UPDATE usuario SET last_seen = now() WHERE id = $1', [id]);
    res.status(200).json({ message: 'Status Atualizado.' });
  } catch {
    res.status(500).json({ message: 'Erro ao atualizar Status' });
  }
};

// ──────────────────────────────────────────────
// Verificar disponibilidade de username/email
// ──────────────────────────────────────────────
export const checkUpdateAvailability = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;
  if (!userId) { 
    res.status(400).json({ message: 'ID do usuário é obrigatório' }); 
    return; 
  }

  const username = normalizeNullableText(req.query.username);
  const emailRaw = normalizeNullableText(req.query.email);
  const email = emailRaw ? emailRaw.toLowerCase() : null;

  try {
    let usernameAvailable = true;
    let emailAvailable = true;

    if (username) {
      const dbRes = await pool.query('SELECT id FROM usuario WHERE username = $1 AND id != $2 LIMIT 1', [username, userId]);
      usernameAvailable = dbRes.rowCount === 0;
    }
    if (email) {
      const dbRes = await pool.query('SELECT id FROM usuario WHERE email = $1 AND id != $2 LIMIT 1', [email, userId]);
      emailAvailable = dbRes.rowCount === 0;
    }

    res.status(200).json({ usernameAvailable, emailAvailable });
  } catch {
    res.status(500).json({ message: 'Erro ao verificar disponibilidade de dados' });
  }
};

// ──────────────────────────────────────────────
// Atualizar perfil
// ──────────────────────────────────────────────
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;
  if (!userId) { 
    res.status(400).json({ message: 'ID do usuário é obrigatório' }); 
    return; 
  }

  const rawBody = {
    username: normalizeNullableText(req.body.username),
    email: normalizeNullableText(req.body.email)
      ? normalizeNullableText(req.body.email)!.toLowerCase()
      : null,
    bio: normalizeNullableText(req.body.bio),
    title: normalizeNullableText(req.body.title) !== null
      ? parseInt(normalizeNullableText(req.body.title)!, 10)
      : null,
    password: normalizeNullableText(req.body.password),
    removeProfileImage: String(req.body.removeProfileImage || '').toLowerCase() === 'true',
  };

  const result = updateProfileSchema.safeParse(rawBody);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }
  const { username, email, bio, title, password, removeProfileImage } = result.data;

  // Removido o Record<> e outras tipagens difíceis
  const reqFiles: any = req.files || {};
  const profileFile = reqFiles['profile'] ? reqFiles['profile'][0] : null;
  const profileImage = profileFile ? profileFile.buffer : null;

  const hasUsername = username != null;
  const hasEmail = email != null;
  const hasBio = bio != null;
  const hasTitle = title != null;
  const hasPassword = password != null;
  const hasProfileImage = profileImage !== null;
  const hasRemoveProfileImage = (removeProfileImage === true) && !hasProfileImage;

  if (hasProfileImage && profileFile.mimetype !== 'image/webp') {
    res.status(400).json({ message: 'Formato de imagem inválido. Apenas imagens no formato WebP são permitidas.' });
    return;
  }
  if (hasProfileImage && profileFile.size > 2 * 1024 * 1024) {
    res.status(400).json({ message: 'A imagem de perfil deve ter no máximo 2MB.' });
    return;
  }

  const bucketName = process.env.R2_BUCKET_NAME;
  const r2BaseUrl = process.env.R2_BASE_URL || process.env.R2_PUBLIC_URL;

  let profileImageUrl: string | null = null;
  let profileImageKey: string | null = null;
  let oldProfileImageUrl: string | null = null;

  try {
    if (hasUsername) {
      const dbRes = await pool.query('SELECT id FROM usuario WHERE username = $1 AND id != $2', [username, userId]);
      if (dbRes.rows.length > 0) { 
        res.status(409).json({ message: 'Este nome de usuário já está em uso.' }); 
        return; 
      }
    }
    if (hasEmail) {
      const dbRes = await pool.query('SELECT id FROM usuario WHERE email = $1 AND id != $2', [email, userId]);
      if (dbRes.rows.length > 0) { 
        res.status(409).json({ message: 'Este e-mail já está em uso.' }); 
        return; 
      }
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (hasUsername) { updateFields.push(`username = $${paramIndex++}`); updateValues.push(username); }
    if (hasEmail) { updateFields.push(`email = $${paramIndex++}`); updateValues.push(email); }
    if (hasBio) { updateFields.push(`bio = $${paramIndex++}`); updateValues.push(bio); }
    if (hasTitle) { updateFields.push(`titulo = $${paramIndex++}`); updateValues.push(title); }
    if (hasPassword) {
      const passwordHash = await bcrypt.hash(password as string, 10);
      updateFields.push(`password = $${paramIndex++}`);
      updateValues.push(passwordHash);
    }

    if (hasRemoveProfileImage) {
      oldProfileImageUrl = await getCurrentProfileImageUrl(userId);
      updateFields.push('foto = NULL');
    }

    if (hasProfileImage) {
      if (!bucketName || !r2BaseUrl) { 
        res.status(500).json({ message: 'Configuração de armazenamento ausente.' }); 
        return; 
      }

      profileImageKey = `profiles/${userId}-${crypto.randomUUID()}.webp`;
      oldProfileImageUrl = await getCurrentProfileImageUrl(userId);

      await r2.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: profileImageKey,
        Body: profileImage,
        ContentType: 'image/webp',
      }));

      profileImageUrl = buildObjectUrl(r2BaseUrl, profileImageKey);
      updateFields.push(`foto = $${paramIndex++}`);
      updateValues.push(profileImageUrl);
    }

    if (updateFields.length === 0) { 
      res.status(400).json({ message: 'Nenhum campo para atualizar' }); 
      return; 
    }

    updateValues.push(userId);
    await pool.query(`UPDATE usuario SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`, updateValues);

    if ((hasProfileImage || hasRemoveProfileImage) && oldProfileImageUrl && bucketName && r2BaseUrl) {
      const normalizedBase = r2BaseUrl.replace(/\/+$/, '');
      const oldImageKey = oldProfileImageUrl.startsWith(normalizedBase)
        ? oldProfileImageUrl.replace(normalizedBase, '').replace(/^\/+/, '')
        : null;
      if (oldImageKey) {
        await r2.send(new DeleteObjectCommand({ Bucket: bucketName, Key: oldImageKey }));
      }
    }

    res.status(200).json({ message: 'Perfil atualizado com sucesso' });
  } catch {
    if (hasProfileImage && profileImageKey && bucketName) {
      try {
        await r2.send(new DeleteObjectCommand({ Bucket: bucketName, Key: profileImageKey }));
      } catch (cleanupErr) {
        console.error('Erro ao limpar imagem de perfil após falha na atualização:', cleanupErr);
      }
    }
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
};

