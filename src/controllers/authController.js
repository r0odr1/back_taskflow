
import { registerUser } from '../services/authService.js';

/**
 * Valida la solicitud y registra un nuevo usuario.
 *
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body ?? {};

    // Verifica los campos obligatorios.
    if (typeof nombre !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Nombre, correo y contraseña son obligatorios.',
      });
    }

    const cleanName = nombre.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Valida las longitudes permitidas.
    if (!cleanName || cleanName.length > 100 || !cleanEmail || cleanEmail.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'El nombre o correo no tiene una longitud válida.',
      });
    }

    // Valida el formato básico del correo.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico no es válido.',
      });
    }

    // Valida la longitud de la contraseña.
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener minimo 8 caracteres.',
      });
    }

    const user = await registerUser({
      nombre: cleanName,
      email: cleanEmail,
      password,
    });

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente.',
      data: user,
    });

  } catch (error) {
    // PostgreSQL utiliza 23505 para valores duplicados.
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'El correo electrónico ya está registrado.',
      });
    }

    console.error('Error al registrar usuario:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo registrar el usuario.',
    });
  }
};