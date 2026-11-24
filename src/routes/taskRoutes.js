
import { Router } from 'express';

import { authenticate } from '../middlewares/authMiddleware.js';
import { storeTask } from '../controllers/taskController.js';

const router = Router();

// Protege todos los endpoints de tareas.
router.use(authenticate);

// Registra una tarea.
router.post('/', storeTask);

export default router;