
import { pool } from '../config/db.js';

/**
 * Crea un proyecto y registra al propietario como miembro.
 *
 * @param {object} data - Datos del proyecto.
 * @returns {Promise<object>} Proyecto creado.
 */
export const createProject = async (data) => {
  const {
    nombre,
    descripcion,
    fecha_inicio,
    fecha_fin,
    propietario_id,
  } = data;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Crea el proyecto asociado al usuario autenticado.
    const projectResult = await client.query(
      `INSERT INTO proyectos
        (nombre, descripcion, fecha_inicio, fecha_fin, propietario_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        propietario_id,
      ]
    );

    const project = projectResult.rows[0];

    // Incorpora al propietario como miembro del proyecto.
    await client.query(
      `INSERT INTO miembros_proyecto (proyecto_id, usuario_id)
       VALUES ($1, $2)`,
      [project.id, propietario_id]
    );

    await client.query('COMMIT');

    return project;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
