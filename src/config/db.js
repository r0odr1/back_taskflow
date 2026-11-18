import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

/**
 * Pool de conexiones a la base de datos PostgreSQL.
 *
 * El pool permite reutilizar conexiones y ejecutar
 * consultas desde diferentes módulos del backend.
 *
 * @type {import('pg').Pool}
 */

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Registra errores inesperados producidos en las conexiones inactivas administradas por el pool..
 */

pool.on('error', (error) => {
  console.error('Error inesperado de PostgreSQL:', error);
});