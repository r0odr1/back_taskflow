
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


/**
 * Consulta los proyectos asociados a un usuario.
 *
 * @param {number} userId - ID del usuario autenticado.
 * @returns {Promise<object[]>} Proyectos accesibles.
 */
export const getUserProjects = async (userId) => {
  const query = `
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.fecha_inicio,
      p.fecha_fin,
      p.propietario_id,
      p.created_at,
      u.nombre AS propietario,
      EXISTS (
        SELECT 1
        FROM miembros_proyecto mp
        WHERE mp.proyecto_id = p.id
          AND mp.usuario_id = $1
      ) AS es_miembro
    FROM proyectos p
    INNER JOIN usuarios u
      ON u.id = p.propietario_id
    WHERE p.propietario_id = $1
       OR EXISTS (
         SELECT 1
         FROM miembros_proyecto mp
         WHERE mp.proyecto_id = p.id
           AND mp.usuario_id = $1
       )
    ORDER BY p.created_at DESC, p.id DESC
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

/**
 * Obtiene un proyecto si el usuario tiene acceso.
 *
 * @param {number} projectId - ID del proyecto.
 * @param {number} userId - ID del usuario autenticado.
 * @returns {Promise<object|null>} Proyecto encontrado o null.
 */
export const getProjectById = async (projectId, userId) => {
  const query = `
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.fecha_inicio,
      p.fecha_fin,
      p.propietario_id,
      p.created_at,
      u.nombre AS propietario,
      (p.propietario_id = $2) AS es_propietario
    FROM proyectos p
    INNER JOIN usuarios u
      ON u.id = p.propietario_id
    WHERE p.id = $1
      AND (
        p.propietario_id = $2
        OR EXISTS (
          SELECT 1
          FROM miembros_proyecto mp
          WHERE mp.proyecto_id = p.id
            AND mp.usuario_id = $2
        )
      )
  `;

  const result = await pool.query(query, [
    projectId,
    userId,
  ]);

  return result.rows[0] ?? null;
};

/**
 * Actualiza un proyecto si el usuario es su propietario.
 *
 * @param {number} projectId - ID del proyecto.
 * @param {number} userId - ID del propietario.
 * @param {object} data - Datos actualizados.
 * @returns {Promise<object|null>}
 */
export const updateProject = async (projectId, userId, data) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin } = data;

  const query = `
    UPDATE proyectos
    SET nombre = $1,
        descripcion = $2,
        fecha_inicio = $3,
        fecha_fin = $4
    WHERE id = $5
      AND propietario_id = $6
    RETURNING *
  `;

  const result = await pool.query(query, [
    nombre,
    descripcion,
    fecha_inicio,
    fecha_fin,
    projectId,
    userId,
  ]);

  return result.rows[0] ?? null;
};