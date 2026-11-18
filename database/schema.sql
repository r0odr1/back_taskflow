
-- ============================================================
-- PROYECTO: TASKFLOW
-- BASE DE DATOS: PostgreSQL
-- ARCHIVO: schema.sql
--
-- DESCRIPCIÓN:
-- Esquema inicial de almacenamiento para la gestión de usuarios, proyectos, miembros y tareas.
--
-- Este script está destinado a una base de datos vacía. No debe ejecutarse nuevamente sin revisar las tablas
-- existentes y las posibles migraciones aplicadas.
-- ============================================================


-- ============================================================
-- TABLA: usuarios
--
-- PROPÓSITO:
-- Almacenar las cuentas de acceso a TaskFlow.
--
-- REGLAS:
-- - Cada usuario tiene un correo único.
-- - La contraseña se almacena mediante hash.
-- - El rol inicial es USER.
-- ============================================================

CREATE TABLE usuarios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- Nombre completo del usuario.
    nombre VARCHAR(100) NOT NULL,
    -- Correo utilizado para identificarse.
    email VARCHAR(150) UNIQUE NOT NULL,
    -- Hash de la contraseña; nunca texto plano.
    password_hash TEXT NOT NULL,
    -- Rol general dentro de la aplicación.
    rol VARCHAR(20) NOT NULL DEFAULT 'USER'
        CHECK (rol IN ('ADMIN', 'USER')),
    -- Fecha y hora de creación de la cuenta.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: proyectos
--
-- PROPÓSITO:
-- Almacenar los proyectos administrados en TaskFlow.
--
-- RELACIÓN:
-- Cada proyecto tiene un usuario propietario.
-- ============================================================

CREATE TABLE proyectos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- Nombre del proyecto.
    nombre VARCHAR(150) NOT NULL,
    -- Información descriptiva del proyecto.
    descripcion TEXT,
    -- Fechas de planificación del proyecto.
    fecha_inicio DATE,
    fecha_fin DATE,
    -- Usuario que administra el proyecto.
    propietario_id INTEGER NOT NULL
        REFERENCES usuarios(id),
    -- Fecha y hora de registro.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: miembros_proyecto
--
-- PROPÓSITO:
-- Relacionar usuarios con los proyectos en los que participan.
--
-- RELACIÓN:
-- Muchos usuarios pueden participar en muchos proyectos.
--
-- REGLA:
-- Un usuario no puede estar registrado dos veces
-- como miembro del mismo proyecto.
-- ============================================================

CREATE TABLE miembros_proyecto (
    proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    -- Garantiza que cada asociación sea única.
    PRIMARY KEY (proyecto_id, usuario_id)
);

-- ============================================================
-- TABLA: tareas
--
-- PROPÓSITO:
-- Almacenar las actividades asociadas a cada proyecto.
--
-- RELACIONES:
-- - Cada tarea pertenece a un proyecto.
-- - Una tarea puede estar asignada a un usuario.
--
-- ESTADOS:
-- PENDIENTE, EN_PROGRESO, EN_REVISION, COMPLETADA.
--
-- PRIORIDADES:
-- BAJA, MEDIA, ALTA.
-- ============================================================

CREATE TABLE tareas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- Nombre de la tarea.
    titulo VARCHAR(150) NOT NULL,
    -- Detalle de la actividad.
    descripcion TEXT,
    -- Estado de seguimiento de la tarea.
    estado VARCHAR(20) DEFAULT 'PENDIENTE'
        CHECK (estado IN (
            'PENDIENTE',
            'EN_PROGRESO',
            'EN_REVISION',
            'COMPLETADA'
        )),
    -- Nivel de importancia de la actividad.
    prioridad VARCHAR(10) DEFAULT 'MEDIA'
        CHECK (prioridad IN (
            'BAJA',
            'MEDIA',
            'ALTA'
        )),

    -- Fecha prevista para finalizar la tarea.
    fecha_limite DATE,
    -- Proyecto al que pertenece la tarea.
    proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    -- Usuario responsable, si está asignada.
    asignado_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    -- Fecha y hora de creación de la tarea.
    created_at TIMESTAMPTZ DEFAULT NOW()
);
