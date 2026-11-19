
import { Router } from 'express';
import { register } from '../controllers/authController.js';

const router = Router();

// Registra una cuenta nueva en TaskFlow.
router.post('/register', register);

export default router;