const STATES = [
  'PENDIENTE',
  'EN_PROGRESO',
  'EN_REVISION',
  'COMPLETADA',
];

const PRIORITIES = ['BAJA', 'MEDIA', 'ALTA'];

/**
 * Comprueba una fecha real con formato YYYY-MM-DD.
 */
const validDate = (value) => {
  if (value === null || value === '') return true;

  if (typeof value !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
};

/**
 * Valida y normaliza los datos de una tarea.
 *
 * @param {object} body - Datos recibidos.
 * @param {boolean} update - Indica si es una actualización.
 * @returns {{data?: object, error?: string}}
 */
export const validateTask = (body, update = false) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'El cuerpo de la solicitud no es válido.' };
  }

  const {
    titulo,
    descripcion = null,
    estado,
    prioridad,
    fecha_limite = null,
    proyecto_id,
    asignado_id = null,
  } = body;

  if (typeof titulo !== 'string' || !titulo.trim() || titulo.trim().length > 150) {
    return { error: 'El título de la tarea no es válido.' };
  }

  if (descripcion !== null && (typeof descripcion !== 'string' || descripcion.length > 5000)) {
    return { error: 'La descripción no es válida.' };
  }

  const taskState = estado ?? (update ? null : 'PENDIENTE');
  const taskPriority = prioridad ?? (update ? null : 'MEDIA');

  if (!STATES.includes(taskState)) {
    return { error: 'El estado de la tarea no es válido.' };
  }

  if (!PRIORITIES.includes(taskPriority)) {
    return { error: 'La prioridad de la tarea no es válida.' };
  }

  if (!validDate(fecha_limite)) {
    return { error: 'La fecha límite no es válida.' };
  }

  if (asignado_id !== null && (!Number.isSafeInteger(asignado_id) || asignado_id <= 0)) {
    return { error: 'El usuario asignado no es válido.' };
  }

  if (!update && (!Number.isSafeInteger(proyecto_id) || proyecto_id <= 0)) {
    return { error: 'El proyecto no es válido.' };
  }

  // Una tarea no puede cambiar de proyecto mediante PUT.
  if (update && Object.hasOwn(body, 'proyecto_id')) {
    return { error: 'No se permite cambiar el proyecto de una tarea.' };
  }

  return {
    data: {
      titulo: titulo.trim(),
      descripcion: descripcion?.trim() || null,
      estado: taskState,
      prioridad: taskPriority,
      fecha_limite: fecha_limite || null,
      asignado_id,
      ...(!update ? { proyecto_id } : {}),
    },
  };
};