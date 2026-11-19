import { Router } from 'express';
import {
  register,
  login,
  getProfile,
} from '../controllers/authController.js';

import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas públicas.
router.post('/register', register);
router.post('/login', login);

// Ruta protegida mediante JWT.
router.get('/me', authenticate, getProfile);

export default router;