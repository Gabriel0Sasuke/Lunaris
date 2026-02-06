// Importações
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database/sql');

//Cadastro
const cadastro = async (req, res) => {
    const query = "INSERT INTO usuario (email, password, username) VALUES (?, ?, ?)";
      const { email, password, username } = req.body;
      
      if (email && password && username) {
        const passwordHash = await bcrypt.hash(password, 10);
        const values = [email, passwordHash, username];
        
        try {
          const [result] = await pool.query(query, values);
          return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            const msg = error.sqlMessage || '';
            
            if (msg.includes('email')) {
              return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
            } else if (msg.includes('username')) {
              return res.status(409).json({ message: 'Este nome de usuário já está em uso.' });
            }
    
          } else {
            return res.status(500).json({ message: 'Erro ao cadastrar usuário' + error.message });
          }
        }
      } else {
        return res.status(400).json({ message: 'Dados incompletos' });
      }
}

// Login
const login = async (req, res) => {
    const query = "SELECT * FROM usuario WHERE email = ?";
      const { email, password } = req.body;
      if (email && password) {
        try {
          const [rows] = await pool.query(query, [email]);
          if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
          }else{
            const user = rows[0];
            if(user.password === null){
              return res.status(401).json({ message: 'Credenciais inválidas' });
            }else{
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
              const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '28d' });
              res.cookie('token', token, { httpOnly: true, maxAge: 28 * 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
              return res.status(200).json({ message: 'Login realizado com sucesso' });
            } else {
              return res.status(401).json({ message: 'Credenciais inválidas' });
            }
            }
          }
        } catch (error) {
          return res.status(500).json({ message: 'Erro ao fazer login' + error.message });
        }
      } else {
        return res.status(400).json({ message: 'Dados incompletos' });
      }
}
// Verificação
const verificacao = async (req, res) => {
  const userId = req.user.id;
  const query = "SELECT id, email, username, nivel, titulo FROM usuario WHERE id = ?";
  try{
    const [rows] = await pool.query(query, [userId]);
    if(rows.length === 0){
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }else{
      const user = rows[0];
      return res.status(200).json({ user });
    }
  }catch (error) {    
    return res.status(500).json({ message: 'Erro ao verificar usuário' + error.message });
  }
}
// Logout
const logout = async (req, res) => {
  try{
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  return res.status(200).json({ message: 'Logout realizado com sucesso' });
  }catch (error) {    
    return res.status(500).json({ message: 'Erro ao fazer logout' + error.message });
  }
}
module.exports = {
  cadastro,
  login,
  verificacao,
  logout
}