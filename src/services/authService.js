import jwt from 'jsonwebtoken';
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


/**
 * Busca un usuario por su correo electrónico.
 *
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, nombre, email, password_hash, rol
     FROM usuarios
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] ?? null;
};

/**
 * Verifica las credenciales y devuelve un JWT.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object|null>}
 */
export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const validPassword = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!validPassword) {
    return null;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado.');
  }

  const token = jwt.sign(
    { rol: user.rol },
    process.env.JWT_SECRET,
    {
      subject: String(user.id),
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
      algorithm: 'HS256',
    }
  );

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
  };
};
