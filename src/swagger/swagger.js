
/**
 * Especificación OpenAPI de TaskFlow.
 *
 * Define la información general de la API, los servidores disponibles, las rutas
 * y las respuestas HTTP esperadas.
 *
 * Swagger UI utiliza este objeto para generar
 * la documentación interactiva.
 */
export const swaggerDocument = {
  openapi: '3.0.3',

  // Información general de la API.
  info: {
    title: 'TaskFlow API',
    version: '1.0.0',
    description:
      'API REST para la gestión de proyectos y tareas empresariales.',
  },

  // Servidor utilizado durante el desarrollo local.
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Servidor de desarrollo',
    },
  ],

  // Definición de los endpoints disponibles.
  paths: {
    '/api/health': {
      get: {
        tags: ['Sistema'],
        summary: 'Verificar el estado de la API',

        description:
          'Comprueba que el servidor y la conexión con PostgreSQL estén disponibles.',

        responses: {
          200: {
            description:
              'API y base de datos disponibles.',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message:
                    'TaskFlow API funcionando correctamente',
                  database: 'Conectada',
                },
              },
            },
          },

          503: {
            description:
              'No se pudo establecer la conexión con PostgreSQL.',
          },
        },
      },
    },

    '/api/auth/register': {
      post: {
        tags: ['Autenticación'],
        summary: 'Registrar un usuario',
        description: 'Crea una cuenta con el rol USER.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre', 'email', 'password'],
                properties: {
                  nombre: {
                    type: 'string',
                    maxLength: 100,
                    example: 'Usuario Prueba',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    maxLength: 150,
                    example: 'usuario@taskflow.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    minLength: 8,
                    maxLength: 72,
                    example: 'PruebaSegura123!',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {description: 'Usuario registrado correctamente.', },
          400: {description: 'Datos de registro inválidos.', },
          409: {description: 'Correo electrónico ya registrado.', },
          500: {description: 'Error interno del servidor.', },
        },
      },
    },
  },
};
