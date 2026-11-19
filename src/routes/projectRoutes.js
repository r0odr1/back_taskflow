
import { Router } from 'express';

import { authenticate } from '../middlewares/authMiddleware.js';
import { storeProject } from '../controllers/projectController.js';

const router = Router();

// Todas las rutas de proyectos requieren autenticación.
router.use(authenticate);

// Crea un proyecto para el usuario autenticado.
router.post('/', storeProject);

export default router;