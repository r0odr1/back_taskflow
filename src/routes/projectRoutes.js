import { Router } from 'express';

import { authenticate } from '../middlewares/authMiddleware.js';
import { storeProject, listProjects, showProject, editProject, removeProject } from '../controllers/projectController.js';

const router = Router();

// Todas las rutas de proyectos requieren autenticación.
router.use(authenticate);

// Crea un proyecto para el usuario autenticado.
router.post('/', storeProject);

// Lista los proyectos del usuario autenticado.
router.get('/', listProjects);

// Consulta un proyecto por ID.
router.get('/:id', showProject);

// Actualiza un proyecto del propietario autenticado.
router.put('/:id', editProject);

// Elimina un proyecto del propietario autenticado.
router.delete('/:id', removeProject);

export default router;