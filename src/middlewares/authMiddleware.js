
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

/**
 * Verifica el JWT y carga el usuario autenticado.
 */
export const authenticate = async (req, res, next) => {
  const authorization = req.headers.authorization;

  // Comprueba el formato Authorization: Bearer TOKEN.
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación requerido.',
    });
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación requerido.',
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado.');
    }

    // Verifica la firma y la expiración del token.
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    const userId = Number(decoded.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido.',
      });
    }

    // Consulta los datos actuales del usuario.
    const result = await pool.query(
      `SELECT id, nombre, email, rol
       FROM usuarios
       WHERE id = $1`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    req.user = result.rows[0];

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado.',
      });
    }

    console.error('Error de autenticación:', error);

    return res.status(500).json({
      success: false,
      message: 'Error al verificar la autenticación.',
    });
  }
};