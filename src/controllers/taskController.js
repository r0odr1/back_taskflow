import { createTask, getUserTasks, getTaskById, updateTask, deleteTask } from '../services/taskService.js';
import { validateTask } from '../utils/taskValidation.js';

/**
 * Valida y crea una tarea dentro de un proyecto.
 *
 * @route POST /api/tareas
 */
export const storeTask = async (req, res) => {
  try {
    const { data, error } = validateTask(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const task = await createTask(data, req.user.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no disponible o asignación no permitida.',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Tarea creada correctamente.',
      data: task,
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo crear la tarea.',
    });
  }
};

/**
 * Lista las tareas accesibles al usuario autenticado.
 *
 * @route GET /api/tareas
 */
export const listTasks = async (req, res) => {
  try {
    const rawId = req.query.proyecto_id;
    let projectId = null;

    if (rawId !== undefined) {
      projectId = Number(rawId);

      if (typeof rawId !== 'string' || !Number.isSafeInteger(projectId) || projectId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'El ID del proyecto no es válido.',
        });
      }
    }

    const tasks = await getUserTasks(req.user.id, projectId);

    return res.status(200).json({
      success: true,
      message: 'Tareas obtenidas correctamente.',
      data: tasks,
    });
  } catch (error) {
    console.error('Error al consultar tareas:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudieron consultar las tareas.',
    });
  }
};

/**
 * Consulta una tarea mediante su identificador.
 *
 * @route GET /api/tareas/:id
 */
export const showTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isSafeInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la tarea no es válido.',
      });
    }

    const task = await getTaskById(taskId, req.user.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tarea obtenida correctamente.',
      data: task,
    });
  } catch (error) {
    console.error('Error al consultar tarea:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo consultar la tarea.',
    });
  }
};

/**
 * Valida y actualiza una tarea del proyecto.
 *
 * @route PUT /api/tareas/:id
 */
export const editTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isSafeInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la tarea no es válido.',
      });
    }

    const { data, error } = validateTask(req.body, true);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const task = await updateTask(
      taskId,
      req.user.id,
      data
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada o asignación no permitida.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tarea actualizada correctamente.',
      data: task,
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo actualizar la tarea.',
    });
  }
};

/**
 * Elimina una tarea de un proyecto propio.
 *
 * @route DELETE /api/tareas/:id
 */
export const removeTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isSafeInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la tarea no es válido.',
      });
    }

    const task = await deleteTask(
      taskId,
      req.user.id
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tarea eliminada correctamente.',
      data: task,
    });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo eliminar la tarea.',
    });
  }
};