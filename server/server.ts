import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Rotas
import authRouter from './src/routes/auth.route';
import systemRouter from './src/routes/system.route';
import tagRouter from './src/routes/tag.route';
import mangaRouter from './src/routes/manga.route';
import scanRouter from './src/routes/scan.route';
import userRouter from './src/routes/user.route';

// Configurações do servidor
const app = express();
const port = process.env.PORT ?? 3000;

// Configura a confiança em proxy/load balancer, quando habilitado via variável de ambiente
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

// CORS — aceita qualquer origem se FRONTEND_URL for "*"
const corsOrigin: cors.CorsOptions['origin'] =
  process.env.FRONTEND_URL === '*'
    ? true
    : [process.env.FRONTEND_URL ?? '', 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 20, // Limite para tentativas de autenticação por IP
  message: 'Muitas tentativas de autenticação deste IP, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 600, // Limite global para navegação normal
  message: 'Muitos pedidos vindos deste IP, por favor tente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limites específicos de autenticação
app.use('/auth/login', authLimiter);
app.use('/auth/cadastro', authLimiter);
app.use('/auth/google', authLimiter);

// Limite global para o restante da API
app.use(globalLimiter);

// Rotas
app.use('/auth', authRouter);          // Autenticação (cadastro, login, etc.)
app.use('/system', systemRouter);      // Sistema (health check, etc.)
app.use('/tag', tagRouter);            // Tags
app.use('/manga', mangaRouter);        // Mangás
app.use('/scanlators', scanRouter);    // Scanlators
app.use('/user', userRouter);          // Usuários (bookmarks, avaliações, etc.)

// Servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});