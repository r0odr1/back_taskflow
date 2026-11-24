import { Router } from 'express';

import { authenticate } from '../middlewares/authMiddleware.js';
import { storeTask, listTasks, showTask } from '../controllers/taskController.js';

const router = Router();

// Protege todos los endpoints de tareas.
router.use(authenticate);

// Registra una tarea.
router.post('/', storeTask);

// Lista las tareas de los proyectos accesibles.
router.get('/', listTasks);

// Consulta una tarea específica.
router.get('/:id', showTask);

export default router;