import { Pool } from 'pg';

const sslEnabled = String(process.env.DB_SSL || '').toLowerCase() === 'true';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
  max: 10,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});

export default pool;
