import { createTask } from '../services/taskService.js';
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