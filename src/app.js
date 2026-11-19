import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { pool } from './config/db.js';
import { httpLogger } from './middlewares/httpLogger.js';
import { swaggerDocument } from './swagger/swagger.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

//Instancia principal de la aplicación Express.
const app = express();

//Registra las solicitudes y respuestas HTTP.
app.use(httpLogger);

// Configura CORS para permitir solicitudes desde el frontend autorizado.
app.use(cors({origin: process.env.CLIENT_URL, }));

//Habilita el procesamiento de solicitudes JSON.
app.use(express.json());

// Agrupa los endpoints de autenticación.
app.use('/api/auth', authRoutes);

// Endpoints protegidos para gestionar proyectos.
app.use('/api/proyectos', projectRoutes);

/**
 * GET /api/health
 *
 * @route GET /api/health
 * @access Public
 *
 * @returns {200} Conexión disponible.
 * @returns {503} Error al conectar con PostgreSQL.
 */

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    return res.status(200).json({
      success: true,
      message: 'TaskFlow API funcionando correctamente',
      database: 'Conectada',
    });

  } catch (error) {
    console.error(
      'Error de conexión:',
      error.message
    );

    return res.status(503).json({
      success: false,
      message: 'No se pudo conectar a PostgreSQL',
    });
  }
});

/**
 * Publica la documentación interactiva de la API.
 *
 * @route GET /api/docs
 * @access Public
 */

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Exporta Express sin iniciar el servidor.
export default app;
