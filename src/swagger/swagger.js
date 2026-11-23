
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

  // Configura la autenticación JWT para las rutas protegidas en Swagger.
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenido al iniciar sesión.',
      },
    },
  },

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

    '/api/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Iniciar sesión con JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'usuario@taskflow.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'PruebaSegura123!',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Inicio de sesión exitoso.' },
          400: { description: 'Credenciales inválidas.' },
          401: { description: 'Correo o contraseña incorrectos.' },
          500: { description: 'Error interno del servidor.' },
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

    '/api/auth/me': {
      get: {
        tags: ['Autenticación'],
        summary: 'Consultar perfil autenticado',
        description: 'Devuelve los datos del usuario identificado por el JWT.',
        security: [
          { bearerAuth: [] },
        ],
        responses: {
          200: {
            description: 'Perfil obtenido correctamente.',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Perfil obtenido correctamente.',
                  data: {
                    id: 1,
                    nombre: 'Usuario Prueba',
                    email: 'usuario@taskflow.com',
                    rol: 'USER',
                  },
                },
              },
            },
          },
          401: { description: 'Token ausente, inválido o expirado.', },
          500: { description: 'Error interno del servidor.', },
        },
      },
    },

    '/api/proyectos': {
      post: {
        tags: ['Proyectos'],
        summary: 'Crear un proyecto',
        description: 'Registra un proyecto del usuario autenticado.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre'],
                properties: {
                  nombre: {
                    type: 'string',
                    maxLength: 150,
                    example: 'Implementación TaskFlow',
                  },
                  descripcion: {
                    type: 'string',
                    maxLength: 5000,
                    example: 'Desarrollo del sistema de proyectos.',
                  },
                  fecha_inicio: {
                    type: 'string',
                    format: 'date',
                    example: '2026-11-19',
                  },
                  fecha_fin: {
                    type: 'string',
                    format: 'date',
                    example: '2026-11-28',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Proyecto creado correctamente.', },
          400: { description: 'Datos del proyecto inválidos.', },
          401: { description: 'Autenticación requerida.', },
          500: { description: 'Error interno del servidor.', },
        },
      },

      get: {
        tags: ['Proyectos'],
        summary: 'Listar proyectos del usuario',
        description: 'Consulta proyectos donde el usuario es propietario o miembro.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Proyectos obtenidos correctamente.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Proyectos obtenidos correctamente.',
                    },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          nombre: {
                            type: 'string',
                            example: 'Implementación TaskFlow',
                          },
                          descripcion: {
                            type: 'string',
                            nullable: true,
                          },
                          propietario_id: {
                            type: 'integer',
                            example: 1,
                          },
                          propietario: {
                            type: 'string',
                            example: 'Usuario Prueba',
                          },
                          es_miembro: {
                            type: 'boolean',
                            example: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Token ausente, inválido o expirado.', },
          500: { description: 'Error interno del servidor.', },
        },
      },
    },

    '/api/proyectos/{id}': {
      get: {
        tags: ['Proyectos'],
        summary: 'Consultar proyecto por ID',
        description:
          'Devuelve un proyecto si el usuario es propietario o miembro.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador del proyecto.',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },
          },
        ],
        responses: {
          200: {description: 'Proyecto obtenido correctamente.', },
          400: {description: 'ID del proyecto inválido.', },
          401: {description: 'Autenticación requerida.', },
          404: {description: 'Proyecto inexistente o sin acceso.', },
          500: {description: 'Error interno del servidor.', },
        },
      },
    },
  },
};