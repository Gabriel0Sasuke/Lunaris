// Importações
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Configurações do servidor
const app = express();
const port = process.env.PORT || 3000;

// Configura a confiança em proxy/load balancer, quando habilitado via variável de ambiente
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

// CORS - aceita qualquer origem se FRONTEND_URL for "*"
const corsOrigin = process.env.FRONTEND_URL === '*' ? true : [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json());

//Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 20, // Limite para tentativas de autenticação por IP
  message: "Muitas tentativas de autenticação deste IP, tente novamente mais tarde.",
  standardHeaders: true, // Retorna a informação do limite nos cabeçalhos 'RateLimit-*'
  legacyHeaders: false, // Desativa os cabeçalhos 'X-RateLimit-*'
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 600, // Limite global mais alto para navegação normal
  message: "Muitos pedidos vindos deste IP, por favor tente mais tarde.",
  standardHeaders: true, // Retorna a informação do limite nos cabeçalhos 'RateLimit-*'
  legacyHeaders: false, // Desativa os cabeçalhos 'X-RateLimit-*'
});

// Limites específicos de autenticação
app.use('/auth/login', authLimiter);
app.use('/auth/cadastro', authLimiter);
app.use('/auth/google', authLimiter);

// Limite global para o restante da API
app.use(globalLimiter);
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

// Usuário (Bookmarks, Amizade, Avaliação, etc.)
const userRouter = require('./src/routes/user.route');
app.use('/user', userRouter);

// Servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});