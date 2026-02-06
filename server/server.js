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



// Servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});