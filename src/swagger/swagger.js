
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
  },
};
