
import { Router } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

// Registra una nueva cuenta.
router.post('/register', register);

// Autentica un usuario existente.
router.post('/login', login);

export default router;