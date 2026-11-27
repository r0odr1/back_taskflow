
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
- `DELETE /api/tareas/:id` - Elimina tareas de proyectos propios.

## Base de datos

El esquema se encuentra en `database/schema.sql`
e incluye usuarios, proyectos, miembros y tareas.

## Documentación

La API REST se documenta mediante Swagger.

URL local: http://localhost:4000/api/docs

## Despliegue en producción

El backend de TaskFlow está desplegado en Render como servicio web Node.js con Express.

### API REST

https://taskflow-api-fyso.onrender.com

### Verificación de disponibilidad

https://taskflow-api-fyso.onrender.com/api/health

### Documentación Swagger

https://taskflow-api-fyso.onrender.com/api/docs

### Base de datos

PostgreSQL alojada en Render. Su estructura se define en `database/schema.sql`, con cuatro tablas: usuarios, proyectos, miembros_proyecto y tareas.

### Configuración

El servicio utiliza las variables de entorno:

- `NODE_ENV`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `CLIENT_URL`

Estas variables se configuran desde Render y sus valores privados no se almacenan en GitHub.

El origen autorizado para las solicitudes del frontend es:

https://taskflow-jade-ten.vercel.app

### Verificación

Se comprobó la conexión con PostgreSQL mediante `GET /api/health` y el funcionamiento de los endpoints REST desde la aplicación desplegada.