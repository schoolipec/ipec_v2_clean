-- IPEC v2 Clean - PostgreSQL 16 Initialization Script
-- Este script se ejecuta automáticamente al crear el contenedor por primera vez

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurar cliente de caracteres
SET client_encoding = 'UTF8';

-- Log de inicialización
\echo '✓ PostgreSQL 16 inicializado para Strapi v5'
\echo '✓ Extensiones creadas: uuid-ossp, pg_trgm'
\echo '✓ Encoding: UTF-8'
\echo '✓ Ready para Strapi'
