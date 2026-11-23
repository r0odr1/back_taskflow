
import { createProject, getUserProjects } from '../services/projectService.js';

/**
 * Valida y registra un proyecto del usuario autenticado.
 *
 * @route POST /api/proyectos
 */
export const storeProject = async (req, res) => {
  try {
    const {nombre, descripcion, fecha_inicio, fecha_fin } = req.body ?? {};

    // Verifica el nombre obligatorio.
    if (typeof nombre !== 'string' || !nombre.trim() || nombre.trim().length > 150) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del proyecto no es válido.',
      });
    }

    // Valida la descripción opcional.
    if (descripcion != null && (typeof descripcion !== 'string' || descripcion.length > 5000)) {
      return res.status(400).json({
        success: false,
        message: 'La descripción no es válida.',
      });
    }

    // Valida fechas opcionales en formato YYYY-MM-DD.
    const isValidDate = (value) => {
      if (value == null || value === '') {
        return true;
      }

      if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
      }

      const date = new Date(`${value}T00:00:00Z`);

      return (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value);
    };

    if (!isValidDate(fecha_inicio) || !isValidDate(fecha_fin)) {
      return res.status(400).json({
        success: false,
        message: 'Las fechas deben tener el formato YYYY-MM-DD y ser válidas.',
      });
    }

    if (fecha_inicio && fecha_fin && fecha_fin < fecha_inicio) {
      return res.status(400).json({
        success: false,
        message: 'La fecha final no puede ser anterior a la inicial.',
      });
    }

    const project = await createProject({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null,
      fecha_inicio: fecha_inicio || null,
      fecha_fin: fecha_fin || null,
      propietario_id: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Proyecto creado correctamente.',
      data: project,
    });
  } catch (error) {
    console.error('Error al crear proyecto:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo crear el proyecto.',
    });
  }
};

/**
 * Lista los proyectos accesibles para el usuario.
 *
 * @route GET /api/proyectos
 */
export const listProjects = async (req, res) => {
  try {
    const projects = await getUserProjects(req.user.id);

    return res.status(200).json({
      success: true,
      message: 'Proyectos obtenidos correctamente.',
      data: projects,
    });
  } catch (error) {
    console.error('Error al consultar proyectos:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudieron consultar los proyectos.',
    });
  }
};