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