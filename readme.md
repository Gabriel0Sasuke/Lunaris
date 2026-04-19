# 🌙 Lunaris

Lunaris é um site de mangás desenvolvido por diversão, focado em oferecer uma experiência fluida para leitura e gerenciamento de títulos favoritos. O projeto utiliza uma stack moderna com **React** no frontend e **Express** no backend, proporcionando uma aplicação rápida e escalável.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19**: Biblioteca principal para construção da interface.
- **Vite**: Build tool extremamente rápida para o desenvolvimento.
- **React Router 7**: Gerenciamento de rotas da aplicação.
- **React Toastify**: Notificações amigáveis para o usuário.
- **ESLint**: Garantia de padrões de código.

### Backend
- **Express 5**: Framework web para Node.js.
- **PostgreSQL**: Driver para conexão e manipulação do banco de dados MySQL.
- **JWT (JSON Web Token)**: Autenticação segura de usuários.
- **Bcrypt**: Hash de senhas para segurança robusta.
- **Cookie-parser & CORS**: Middleware para gerenciamento de cookies e permissões de acesso.
- **Dotenv**: Gerenciamento de variáveis de ambiente.

## 🛠️ Estrutura do Projeto

O repositório está dividido em duas partes principais:

- `/client`: Contém todo o código do frontend (React + Vite).
- `/server`: Contém a API e a lógica de negócio (Express + Node.js).

## 🏁 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado.
- Banco de dados MySQL configurado.

### Configuração do Backend
1. Navegue até a pasta `server`:
   ```bash
   cd server
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com suas credenciais do banco de dados (baseie-se no código de conexão).
4. Inicie o servidor:
   ```bash
   npm start
   ```

### Configuração do Frontend
1. Navegue até a pasta `client`:
   ```bash
   cd client
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
---
*Este projeto está sendo desenvolvido puramente por diversão e aprendizado.*
