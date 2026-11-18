
# TaskFlow - Backend

API REST para la gestión de proyectos y tareas empresariales.

## 1. Descripción

El backend de TaskFlow está desarrollado con Node.js y Express.

Su propósito es procesar solicitudes HTTP, administrar
la información del sistema y comunicarse con PostgreSQL.

Este proyecto forma parte de la asignatura
Electiva - Desarrollo de Aplicaciones Web.

## 2. Tecnologías

- Node.js 22
- Express 5
- PostgreSQL 17
- Swagger UI
- Morgan
- Chalk
- Nodemon
- dotenv
- CORS

## 3. Arquitectura

La aplicación separa sus responsabilidades en módulos:

- config: conexión y configuración de servicios.
- controllers: procesamiento de solicitudes HTTP.
- middlewares: funciones intermedias de Express.
- routes: definición de endpoints.
- services: lógica de negocio.
- swagger: documentación de la API.
- database: esquema y migraciones SQL.

## 4. Instalación

### Requisitos

- Node.js 22 o superior.
- npm.
- PostgreSQL 17.
- Git.

### Instalar dependencias

Desde la carpeta backend:

npm install

### Variables de entorno

Crear un archivo .env con los siguientes valores:

PORT=4000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA
DB_NAME=taskflow_db
CLIENT_URL=http://localhost:5173

Las credenciales reales no deben publicarse en GitHub.

### Base de datos

Crear una base de datos llamada taskflow_db.

Ejecutar database/schema.sql únicamente sobre
una base de datos vacía.

### Iniciar el servidor

Modo desarrollo:

npm run dev

Modo ejecución:

npm start

## 5. Endpoints disponibles

### GET /api/health

Verifica el funcionamiento de la API y la conexión
con PostgreSQL.

Respuesta exitosa:

{
  "success": true,
  "message": "TaskFlow API funcionando correctamente",
  "database": "Conectada"
}

Códigos de respuesta:

- 200: servicio disponible.
- 503: conexión con PostgreSQL no disponible.

## 6. Swagger

La documentación interactiva está disponible en:

http://localhost:4000/api/docs

## 7. Registro de solicitudes

Morgan registra las peticiones HTTP realizadas al servidor.

Chalk permite diferenciar visualmente los métodos
y los códigos de respuesta.

## 8. Modelo de datos

La base de datos contiene cuatro tablas principales:

- usuarios
- proyectos
- miembros_proyecto
- tareas

Consultar database/schema.sql para revisar
los campos, restricciones y relaciones.

## 9. Seguridad

- Las credenciales se almacenan en variables de entorno.
- El archivo .env está excluido de Git.
- CORS restringe los orígenes permitidos por el navegador.
- Las consultas SQL deben utilizar parámetros.
- La autenticación y autorización se implementarán
  en la siguiente fase.

## 10. Estado actual

Configuración inicial del backend completada.

Funcionalidades pendientes:

- Registro e inicio de sesión.
- Autenticación JWT.
- CRUD de proyectos.
- CRUD de tareas.
- Autorización por roles.
- Pruebas automatizadas.
- Despliegue.

## 11. Uso académico

Proyecto desarrollado para la asignatura
Electiva - Desarrollo de Aplicaciones Web,
Corporación Universitaria Iberoamericana.
