# Strapi v5 Setup - IPEC v2 Clean

**Fecha:** Oct 19, 2026  
**Estado:** Documentación de referencia  
**Versión:** Strapi v5

---

## Descripción General

Strapi es un CMS headless self-hosted que permite gestionar contenido multiidioma sin estar atado a un proveedor. Este proyecto usa:

- **Strapi v5** - Versión más reciente y estable
- **PostgreSQL 16** - Base de datos relacional
- **Docker** - Containerización para facilidad de deploy
- **Multiidioma** - Soporte para 5 idiomas (ES/EN/PT/KO/DE)

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│ IPEC v2 Clean - Arquitectura de Contenido               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Next.js Web (5 idiomas)  <──>  Strapi v5 API          │
│  /web/                               /strapi-cms/      │
│                                     - PostgreSQL 16    │
│                                     - Contenido        │
│                                     - Usuarios         │
│  Next.js Admin (2 idiomas) <──>  Editor Visual         │
│  /admin/                           (WordPress-like)    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Configuración Local (Desarrollo)

### Requisitos

- Docker + Docker Compose instalados
- Node.js 18+ (para CLI de Strapi si es necesario)
- 2GB RAM libre mínimo
- Puerto 1337 disponible (Strapi)
- Puerto 5433 disponible (PostgreSQL)

### Estructura de Directorios

```
strapi-cms/
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .env (NO versionar - crear manualmente)
├── src/
│   ├── api/
│   │   ├── hero/
│   │   ├── about/
│   │   ├── services/
│   │   ├── contact/
│   │   ├── testimonials/
│   │   └── footer/
│   └── plugins/
├── public/
│   └── uploads/
└── config/
    └── database.js
```

### Paso 1: Crear archivo .env

```bash
cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\strapi-cms
cp .env.example .env
```

Contenido de `.env`:

```env
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=ipec_strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres_dev_password
DATABASE_SSL=false

# Strapi
NODE_ENV=development
STRAPI_ADMIN_BACKEND_URL=http://localhost:1337
STRAPI_URL_PREFIX=/api
STRAPI_API_TOKEN_SALT=your_random_salt_here_min_16_chars
STRAPI_ADMIN_JWT_SECRET=your_random_jwt_secret_min_16_chars
STRAPI_TRANSFER_TOKEN_SALT=your_random_token_salt_min_16_chars

# API
API_PORT=1337
API_URL=http://localhost:1337
```

### Paso 2: Levantar Strapi con Docker

```bash
# Desde strapi-cms/
docker-compose up -d

# Ver logs
docker-compose logs -f strapi

# Esperar a que PostgreSQL esté lista (unos 30-45 segundos)
docker-compose ps
```

### Paso 3: Acceder a Strapi

1. Ir a **http://localhost:1337/admin**
2. Crear cuenta admin (solo la primera vez)
3. Ingresar credenciales

---

## Modelos de Contenido (Content-Types)

### 1. **Hero Section** (Sección Principal)

```json
{
  "name": "Hero",
  "description": "Sección principal del sitio",
  "fields": {
    "title": { "type": "string", "required": true, "i18n": true },
    "subtitle": { "type": "string", "i18n": true },
    "description": { "type": "richtext", "i18n": true },
    "cta_button_text": { "type": "string", "i18n": true },
    "cta_button_link": { "type": "string", "i18n": true },
    "image": { "type": "media", "allowedTypes": ["images"] },
    "background_color": { "type": "string", "default": "#082942" },
    "order": { "type": "integer", "default": 1 }
  }
}
```

### 2. **About Section** (Acerca de)

```json
{
  "name": "About",
  "fields": {
    "title": { "type": "string", "required": true, "i18n": true },
    "description": { "type": "richtext", "i18n": true },
    "mission": { "type": "text", "i18n": true },
    "vision": { "type": "text", "i18n": true },
    "values": { "type": "json", "i18n": true },
    "image": { "type": "media" },
    "order": { "type": "integer", "default": 2 }
  }
}
```

### 3. **Services** (Servicios)

```json
{
  "name": "Service",
  "description": "Servicios individuales",
  "fields": {
    "title": { "type": "string", "required": true, "i18n": true },
    "description": { "type": "richtext", "i18n": true },
    "icon": { "type": "string", "i18n": false },
    "image": { "type": "media" },
    "order": { "type": "integer" },
    "color": { "type": "string", "default": "#328045" }
  }
}
```

### 4. **Contact Info** (Información de Contacto)

```json
{
  "name": "Contact",
  "fields": {
    "email": { "type": "email" },
    "phone": { "type": "string" },
    "address": { "type": "string", "i18n": true },
    "hours": { "type": "json", "i18n": true },
    "social_links": { "type": "json" },
    "map_coordinates": { "type": "json" }
  }
}
```

### 5. **Footer Content**

```json
{
  "name": "Footer",
  "fields": {
    "copyright_text": { "type": "string", "i18n": true },
    "quick_links": { "type": "json", "i18n": true },
    "social_links": { "type": "json" },
    "logo": { "type": "media" }
  }
}
```

---

## Configuración de Multiidioma en Strapi

1. **Instalar plugin i18n** (viene por defecto en v5)
2. En cada content-type, marcar campos con `i18n: true`
3. En panel admin, verás selector de idioma por cada campo
4. Lenguajes soportados:
   - **es** - Español (Default)
   - **en** - Inglés
   - **pt** - Portugués
   - **ko** - Coreano
   - **de** - Alemán

---

## API Endpoints Generados Automáticamente

Una vez creados los content-types, Strapi genera automáticamente:

```
GET    /api/heroes              (listar heroes)
POST   /api/heroes              (crear hero)
GET    /api/heroes/:id          (obtener por ID)
PUT    /api/heroes/:id          (actualizar)
DELETE /api/heroes/:id          (eliminar)

GET    /api/abouts              (igual para cada modelo)
GET    /api/services
GET    /api/contacts
GET    /api/footers
```

### Parámetro de Idioma

```
GET /api/heroes?locale=en       (obtener en inglés)
GET /api/heroes?locale=es       (obtener en español)
```

---

## Deployment en VPS Hostinger

### Opción 1: Docker en VPS (Recomendado)

```bash
# 1. SSH a VPS
ssh root@tu-vps.hostinger.com

# 2. Instalar Docker si no está instalado
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Subir archivos de strapi-cms via SFTP o git clone

# 4. Levantar contenedores
docker-compose up -d

# 5. Ver si está corriendo
docker-compose ps
docker-compose logs strapi | tail -50
```

### Opción 2: Cloudflare Tunnel (Sin exponer IP)

Ver `CLOUDFLARE-TUNNEL.md` para configurar tunnel seguro.

---

## Credenciales de Base de Datos

```
Host: postgres (dentro de Docker)
Host: localhost (desde host local)
Host: 192.168.x.x (desde otro contenedor en same network)

Puerto: 5432 (interno) / 5433 (externo)
Usuario: postgres
Contraseña: postgres_dev_password (cambiar en producción)
Base de datos: ipec_strapi
```

---

## Troubleshooting

### Error: "Connection refused" a PostgreSQL

```bash
# Verificar que postgres está corriendo
docker-compose ps

# Si no, reiniciar
docker-compose down
docker-compose up -d
```

### Error: "Cannot find module 'strapi'"

```bash
# Reconstruir imagen
docker-compose build --no-cache strapi
docker-compose up -d
```

### Limpiar datos y reiniciar

```bash
# ⚠️ CUIDADO - Borra TODA la base de datos
docker-compose down -v
docker-compose up -d
```

---

## Próximos Pasos

1. ✅ Levantar Strapi en Docker local
2. ✅ Crear todos los content-types (Hero, About, Services, etc.)
3. ✅ Configurar multiidioma en cada tipo
4. ⏳ Agregar contenido de prueba
5. ⏳ Generar API tokens para Next.js
6. ⏳ Conectar Next.js web al API de Strapi
7. ⏳ Crear editor visual en admin panel

---

**Última actualización:** Oct 19, 2026
