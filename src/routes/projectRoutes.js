
import { Router } from 'express';

import { authenticate } from '../middlewares/authMiddleware.js';
import { storeProject, listProjects } from '../controllers/projectController.js';

const router = Router();

// Todas las rutas de proyectos requieren autenticación.
router.use(authenticate);

// Crea un proyecto para el usuario autenticado.
router.post('/', storeProject);

// Lista los proyectos del usuario autenticado.
router.get('/', listProjects);

export default router;