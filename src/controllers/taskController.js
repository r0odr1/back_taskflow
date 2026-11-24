import { createTask, getUserTasks } from '../services/taskService.js';
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