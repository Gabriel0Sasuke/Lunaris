// Importações
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database/sql');
const r2 = require('../database/bucket');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');

//Cadastro
const cadastro = async (req, res) => {
  const query = "INSERT INTO usuario (email, password, username) VALUES ($1, $2, $3)";
  const { email, password, username } = req.body;

  if (!email || !password || !username) return res.status(400).json({ message: 'Dados incompletos' });

  try {
    const emailLower = email.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(query, [emailLower, passwordHash, username]);
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    if (error.code === '23505') {
      const msg = error.detail || '';
      if (msg.includes('email')) return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
      if (msg.includes('username')) return res.status(409).json({ message: 'Este nome de usuário já está em uso.' });
    }
    return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
}

// Login
const login = async (req, res) => {
  const query = "SELECT id, password FROM usuario WHERE email = $1";
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Dados incompletos' });

  try {
    const { rows } = await pool.query(query, [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Credenciais inválidas' });

    const user = rows[0];
    if (user.password === null) return res.status(401).json({ message: 'Credenciais inválidas' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '28d' });
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 28 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });

    return res.status(200).json({ message: 'Login realizado com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
}
// Verificação
const verificacao = async (req, res) => {
  const userId = req.user.id;
  const query = "SELECT u.id, u.email, u.username, u.xp, t.nome AS titulo, u.titulo AS titulo_id, u.foto, u.account_type, u.last_seen, u.created_at, u.scan_afiliada, u.bio, u.ativa FROM usuario u LEFT JOIN titles t ON u.titulo = t.id WHERE u.id = $1";
  const updateLastSeenQuery = "UPDATE usuario SET last_seen = NOW() WHERE id = $1";
  try {
    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuário não encontrado' });

    const user = rows[0];
    if (user.ativa.trim() !== 'true') return res.status(403).json({ message: 'Usuário desativado' });

    await pool.query(updateLastSeenQuery, [userId]);
    return res.status(200).json({ user });
  }catch (error) {
    return res.status(500).json({ message: 'Erro ao verificar usuário' });
  }
}
// Logout
const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });
    return res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao fazer logout' });
  }
}
// Google
const google = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token inválido' });

  try {
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const userData = await googleResponse.json();

    try {
    // Tenta Verificar com Google_ID
    const GoogleIDQuery = 'SELECT id FROM usuario WHERE google_id = $1';
    const { rows: rows1 } = await pool.query(GoogleIDQuery, [userData.sub]);
    if (rows1.length > 0) {
      // Já existe então só cria o token
      const UserID = rows1[0].id;
      return socialMediaAuth(req, res, UserID);
    }

    //Não obteve exito, então tenta verificar com o email e criar conta nova ou vincular a conta já existente
    const googleEmailQuery = "SELECT id FROM usuario WHERE email = $1";
    const { rows: rows2 } = await pool.query(googleEmailQuery, [userData.email]);

    if (rows2.length > 0) {
      // Usuario já existe, vincular conta google
      const user_id = rows2[0].id;
      const googleExisting = 'UPDATE usuario SET google_id = $1 WHERE id = $2';
      await pool.query(googleExisting, [userData.sub, user_id]);
      return socialMediaAuth(req, res, user_id);
    }

      // Usuario não existe, criar um novo
      const baseUsername = userData.name.replace(/\s/g, '').toLowerCase();
      const sufixo = Math.floor(Math.random() * 10000); // Gera um número entre 0 e 9999
      const UsernameFinal = `${baseUsername}${sufixo}`;
      const Username = UsernameFinal.slice(0, 25);

      const googlenewQuery = "INSERT INTO usuario (email, username, google_id, foto) VALUES ($1, $2, $3, $4) RETURNING id";
      const googlenewValues = [userData.email, Username, userData.sub, userData.picture];
      try {
        const { rows: result } = await pool.query(googlenewQuery, googlenewValues);
        const createdID = result[0].id; // Obtém o ID do usuário recém-criado (PostgreSQL)
        return socialMediaAuth(req, res, createdID);
      } catch (error) {
        return res.status(500).json({ message: 'Erro ao fazer login usando Google' });
      }
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao fazer Login usando Google' });
  }
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao Se Conectar com os Servidores da Google' });
  }
};
const socialMediaAuth = async (req, res, ID) => {
  const token = jwt.sign({ id: ID }, process.env.JWT_SECRET, { expiresIn: '28d' });
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 28 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
  });
  return res.status(200).json({ message: 'Login realizado com sucesso' });
}
const online = async (req, res) => {
  const id = req.user.id;
  const query = "UPDATE usuario SET last_seen = now() WHERE id = $1";

  try {
    await pool.query(query, [id]);
    return res.status(200).json({ message: 'Status Atualizado.' });
  } catch (e) {
    return res.status(500).json({ message: 'Erro ao atualizar Status' });
  }
}

const normalizeNullableText = (value) => {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  if (!normalized || normalized.toLowerCase() === 'null') return null;
  return normalized;
};

const checkUpdateAvailability = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(400).json({ message: 'ID do usuário é obrigatório' });

  const username = normalizeNullableText(req.query.username);
  const emailRaw = normalizeNullableText(req.query.email);
  const email = emailRaw ? emailRaw.toLowerCase() : null;

  try {
    let usernameAvailable = true;
    let emailAvailable = true;

    if (username) {
      const usernameQuery = 'SELECT id FROM usuario WHERE username = $1 AND id != $2 LIMIT 1';
      const { rowCount } = await pool.query(usernameQuery, [username, userId]);
      usernameAvailable = rowCount === 0;
    }

    if (email) {
      const emailQuery = 'SELECT id FROM usuario WHERE email = $1 AND id != $2 LIMIT 1';
      const { rowCount } = await pool.query(emailQuery, [email, userId]);
      emailAvailable = rowCount === 0;
    }

    return res.status(200).json({ usernameAvailable, emailAvailable });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao verificar disponibilidade de dados' });
  }
}

const updateProfile = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(400).json({ message: 'ID do usuário é obrigatório' });

  const username = normalizeNullableText(req.body.username);
  const emailRaw = normalizeNullableText(req.body.email);
  const email = emailRaw ? emailRaw.toLowerCase() : null;
  const bio = normalizeNullableText(req.body.bio);
  const titleRaw = normalizeNullableText(req.body.title);
  const title = titleRaw !== null ? parseInt(titleRaw, 10) : null;
  const password = normalizeNullableText(req.body.password);
  const removeProfileImage = String(req.body.removeProfileImage || '').toLowerCase() === 'true';
  const profileFile = req.files?.profile?.[0] || null;
  const profileImage = profileFile?.buffer || null;

  const hasUsername = username !== null;
  const hasEmail = email !== null;
  const hasBio = bio !== null;
  const hasTitle = title !== null;
  const hasPassword = password !== null;
  const hasProfileImage = profileImage !== null;
  const hasRemoveProfileImage = removeProfileImage && !hasProfileImage;

  if (hasUsername && (username.length < 3 || username.length > 25)) return res.status(400).json({ message: 'O nome de usuário deve ter entre 3 e 25 caracteres.' });
  if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'E-mail inválido.' });
  if (hasBio && bio.length > 2500) return res.status(400).json({ message: 'A biografia deve ter no máximo 2500 caracteres.' });
  if (hasTitle && (isNaN(title) || title < 1)) return res.status(400).json({ message: 'Título inválido.' });
  if (hasPassword && (password.length < 8 || password.length > 50 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password))) {
    return res.status(400).json({ message: 'A senha deve ter entre 8 e 50 caracteres, com maiúscula, minúscula, número e símbolo.' });
  }
  if (hasProfileImage && profileFile.mimetype !== 'image/webp') return res.status(400).json({ message: 'Formato de imagem inválido. Apenas imagens no formato WebP são permitidas.' });
  if (hasProfileImage && profileFile.size > 2 * 1024 * 1024) return res.status(400).json({ message: 'A imagem de perfil deve ter no máximo 2MB.' });

  let profileImageUrl = null;
  let profileImageKey = null;
  let oldProfileImageUrl = null;
  const bucketName = process.env.R2_BUCKET_NAME;
  const r2BaseUrl = process.env.R2_BASE_URL || process.env.R2_PUBLIC_URL;

  try {
    if (hasUsername) {
      const usernameQuery = 'SELECT id FROM usuario WHERE username = $1 AND id != $2';
      const { rows: usernameRows } = await pool.query(usernameQuery, [username, userId]);
      if (usernameRows.length > 0) return res.status(409).json({ message: 'Este nome de usuário já está em uso.' });
    }

    if (hasEmail) {
      const emailQuery = 'SELECT id FROM usuario WHERE email = $1 AND id != $2';
      const { rows: emailRows } = await pool.query(emailQuery, [email, userId]);
      if (emailRows.length > 0) return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    let updateFields = [];
    let updateValues = [];
    let paramIndex = 1;

    if (hasUsername) {
      updateFields.push(`username = $${paramIndex++}`);
      updateValues.push(username);
    }
    if (hasEmail) {
      updateFields.push(`email = $${paramIndex++}`);
      updateValues.push(email);
    }
    if (hasBio) {
      updateFields.push(`bio = $${paramIndex++}`);
      updateValues.push(bio);
    }
    if (hasTitle) {
      updateFields.push(`titulo = $${paramIndex++}`);
      updateValues.push(title);
    }
    if (hasPassword) {
      const passwordHash = await bcrypt.hash(password, 10);
      updateFields.push(`password = $${paramIndex++}`);
      updateValues.push(passwordHash);
    }

    if (hasRemoveProfileImage) {
      oldProfileImageUrl = await getCurrentProfileImageUrl(userId);
      updateFields.push('foto = NULL');
    }

    if (hasProfileImage) {
      if (!bucketName || !r2BaseUrl) {
        return res.status(500).json({ message: 'Configuração de armazenamento ausente.' });
      }

      profileImageKey = `profiles/${userId}-${crypto.randomUUID()}.webp`;
      oldProfileImageUrl = await getCurrentProfileImageUrl(userId);

      await r2.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: profileImageKey,
        Body: profileImage,
        ContentType: 'image/webp'
      }));

      profileImageUrl = buildObjectUrl(r2BaseUrl, profileImageKey);
      updateFields.push(`foto = $${paramIndex++}`);
      updateValues.push(profileImageUrl);
    }

    if (updateFields.length === 0) return res.status(400).json({ message: 'Nenhum campo para atualizar' });

    const updateQuery = `UPDATE usuario SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`;
    updateValues.push(userId);
    await pool.query(updateQuery, updateValues);

    if ((hasProfileImage || hasRemoveProfileImage) && oldProfileImageUrl && bucketName && r2BaseUrl) {
      const normalizedBaseUrl = r2BaseUrl.replace(/\/+$/, '');
      const oldImageKey = oldProfileImageUrl.startsWith(normalizedBaseUrl)
        ? oldProfileImageUrl.replace(normalizedBaseUrl, '').replace(/^\/+/, '')
        : null;
      if (oldImageKey) {
        await r2.send(new DeleteObjectCommand({
          Bucket: bucketName,
          Key: oldImageKey
        }));
      }
    }

    return res.status(200).json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    if (hasProfileImage && profileImageKey && bucketName) {
      try {
        await r2.send(new DeleteObjectCommand({
          Bucket: bucketName,
          Key: profileImageKey
        }));
      } catch (_cleanupError) {
        console.error('Erro ao limpar imagem de perfil após falha na atualização:', _cleanupError);
      }
    }
    return res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
}

// Funções Auxiliares
const buildObjectUrl = (baseUrl, key) => {
  return `${baseUrl.replace(/\/+$/, '')}/${key.replace(/^\/+/, '')}`;
}
const getCurrentProfileImageUrl = async (userId) => {
  const query = "SELECT foto FROM usuario WHERE id = $1";
  const { rows } = await pool.query(query, [userId]);
  return rows[0]?.foto || null;
};


module.exports = {
  cadastro,
  login,
  verificacao,
  logout,
  google,
  online,
  checkUpdateAvailability,
  updateProfile
}