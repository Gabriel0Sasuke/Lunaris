// Importações
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Configurações do servidor
const app = express();
const port = process.env.PORT || 3000;

// CORS - aceita qualquer origem se FRONTEND_URL for "*"
const corsOrigin = process.env.FRONTEND_URL === '*' ? true : [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Rotas
// Autenticação (cadastro e login, etc.)
const authRouter = require('./src/routes/auth.route');
app.use('/auth', authRouter);

// Sistema (Verificação de sistema online, etc.)
const systemRouter = require('./src/routes/system.route');
app.use('/system', systemRouter);

//Tags (Adicionar, remover, editar tags, Listar tags, etc.)
const tagRouter = require('./src/routes/tag.route');
app.use('/tag', tagRouter);

// Mangás (Adicionar, remover, editar mangás, Listar mangás, etc.)
const mangaRouter = require('./src/routes/manga.route');
app.use('/manga', mangaRouter);

// Scanlators (Adicionar, remover, editar scanlators, Listar scanlators, etc.)
const scanRouter = require('./src/routes/scan.route');
app.use('/scanlators', scanRouter);

// Servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});