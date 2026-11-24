import { pool } from '../config/db.js';

/**
 * Crea una tarea si el usuario administra el proyecto.
 * El responsable, si existe, debe ser miembro del proyecto.
 *
 * @param {object} data
 * @param {number} userId
 * @returns {Promise<object|null>}
 */
export const createTask = async (data, userId) => {
  const {
    titulo,
    descripcion,
    estado,
    prioridad,
    fecha_limite,
    proyecto_id,
    asignado_id,
  } = data;

  const query = `
    INSERT INTO tareas (
      titulo, descripcion, estado, prioridad,
      fecha_limite, proyecto_id, asignado_id
    )
    SELECT
      $1::varchar(150),
      $2::text,
      $3::varchar(20),
      $4::varchar(10),
      $5::date,
      p.id,
      $6::integer
    FROM proyectos p
    WHERE p.id = $7
      AND p.propietario_id = $8
      AND (
        $6::integer IS NULL
        OR EXISTS (
          SELECT 1
          FROM miembros_proyecto mp
          WHERE mp.proyecto_id = p.id
            AND mp.usuario_id = $6
        )
      )
    RETURNING *
  `;

  const result = await pool.query(query, [
    titulo,
    descripcion,
    estado,
    prioridad,
    fecha_limite,
    asignado_id,
    proyecto_id,
    userId,
  ]);

  return result.rows[0] ?? null;
};

/**
 * Lista tareas de los proyectos accesibles al usuario.
 *
 * @param {number} userId
 * @param {number|null} projectId
 * @returns {Promise<object[]>}
 */
export const getUserTasks = async (userId, projectId = null) => {
  const query = `
    SELECT
      t.*,
      p.nombre AS proyecto,
      u.nombre AS asignado
    FROM tareas t
    INNER JOIN proyectos p ON p.id = t.proyecto_id
    LEFT JOIN usuarios u ON u.id = t.asignado_id
    WHERE (
      p.propietario_id = $1
      OR EXISTS (
        SELECT 1
        FROM miembros_proyecto mp
        WHERE mp.proyecto_id = p.id
          AND mp.usuario_id = $1
      )
    )
    AND ($2::integer IS NULL OR t.proyecto_id = $2)
    ORDER BY t.created_at DESC, t.id DESC
  `;

  const result = await pool.query(query, [
    userId,
    projectId,
  ]);

  return result.rows;
};

/**
 * Consulta una tarea si el usuario tiene acceso al proyecto.
 *
 * @param {number} taskId
 * @param {number} userId
 * @returns {Promise<object|null>}
 */
export const getTaskById = async (taskId, userId) => {
  const query = `
    SELECT
      t.*,
      p.nombre AS proyecto,
      u.nombre AS asignado
    FROM tareas t
    INNER JOIN proyectos p ON p.id = t.proyecto_id
    LEFT JOIN usuarios u ON u.id = t.asignado_id
    WHERE t.id = $1
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
    taskId,
    userId,
  ]);

  return result.rows[0] ?? null;
};

/**
 * Actualiza una tarea si el usuario administra su proyecto.
 *
 * @param {number} taskId
 * @param {number} userId
 * @param {object} data
 * @returns {Promise<object|null>}
 */
export const updateTask = async (taskId, userId, data) => {
  const {
    titulo,
    descripcion,
    estado,
    prioridad,
    fecha_limite,
    asignado_id,
  } = data;

  const query = `
    UPDATE tareas t
    SET titulo = $1,
        descripcion = $2,
        estado = $3,
        prioridad = $4,
        fecha_limite = $5,
        asignado_id = $6
    FROM proyectos p
    WHERE t.id = $7
      AND t.proyecto_id = p.id
      AND p.propietario_id = $8
      AND (
        $6::integer IS NULL
        OR EXISTS (
          SELECT 1
          FROM miembros_proyecto mp
          WHERE mp.proyecto_id = p.id
            AND mp.usuario_id = $6
        )
      )
    RETURNING t.*
  `;

  const result = await pool.query(query, [
    titulo,
    descripcion,
    estado,
    prioridad,
    fecha_limite,
    asignado_id,
    taskId,
    userId,
  ]);

  return result.rows[0] ?? null;
};

/**
 * Elimina una tarea si el usuario administra su proyecto.
 *
 * @param {number} taskId
 * @param {number} userId
 * @returns {Promise<object|null>}
 */
export const deleteTask = async (taskId, userId) => {
  const query = `
    DELETE FROM tareas t
    USING proyectos p
    WHERE t.id = $1
      AND t.proyecto_id = p.id
      AND p.propietario_id = $2
    RETURNING t.id, t.titulo
  `;

  const result = await pool.query(query, [
    taskId,
    userId,
  ]);

  return result.rows[0] ?? null;
};