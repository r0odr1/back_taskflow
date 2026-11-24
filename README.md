
# TaskFlow API

Backend del sistema TaskFlow, una aplicación web para
administrar proyectos, usuarios y tareas.

## Tecnologías

- Node.js y Express
- PostgreSQL
- Swagger
- Morgan y Chalk
- JWT y bcryptjs

## Instalación

```bash
npm install
```

Configurar las variables de entorno en `.env`
utilizando las credenciales locales de PostgreSQL.

## Ejecución

```bash
npm run dev
```

## Endpoints disponibles

- `GET /api/health` - Estado del servidor y base de datos.

- `GET /api/docs` - Documentación Swagger.
- `POST /api/auth/register` - Registra un usuario nuevo.
- `POST /api/auth/login` - Inicia sesión y genera un JWT.
- `GET /api/auth/me` - Consulta el perfil del usuario autenticado.

- `POST /api/proyectos` - Crea proyectos del usuario autenticado.
- `GET /api/proyectos` - Lista los proyectos accesibles del usuario.
- `GET /api/proyectos/:id` - Consulta un proyecto accesible por ID.
- `PUT /api/proyectos/:id` - Actualiza un proyecto de su propietario.
- `DELETE /api/proyectos/:id` - Elimina proyectos del propietario y sus datos asociados.

- `POST /api/tareas` - Crea tareas dentro de proyectos propios.
- `GET /api/tareas` - Lista tareas accesibles y permite filtrarlas por proyecto.
- `GET /api/tareas/:id` - Consulta una tarea accesible.
- `PUT /api/tareas/:id` - Actualiza tareas de proyectos propios.

## Base de datos

El esquema se encuentra en `database/schema.sql`
e incluye usuarios, proyectos, miembros y tareas.

## Documentación

La API REST se documenta mediante Swagger.

URL local: http://localhost:4000/api/docs