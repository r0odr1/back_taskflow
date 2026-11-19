
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

/**
 * Registra un usuario con la contraseña protegida.
 *
 * @param {{nombre: string, email: string, password: string}} data
 * @returns {Promise<object>} Usuario creado sin contraseña.
 */
export const registerUser = async ({ nombre, email, password }) => {
  // Genera el hash antes de guardar la contraseña.
  const passwordHash = await bcrypt.hash(password, 12);

  const query = `
    INSERT INTO usuarios (nombre, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, nombre, email, rol, created_at
  `;

  const values = [nombre, email, passwordHash];

  const result = await pool.query(query, values);

  return result.rows[0];
};