// Importações
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database/sql');

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
  const query = "SELECT id, email, username, xp, titulo, foto, account_type, last_seen, created_at, scan_afiliada, ativa FROM usuario WHERE id = $1";
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
module.exports = {
  cadastro,
  login,
  verificacao,
  logout,
  google,
  online
}