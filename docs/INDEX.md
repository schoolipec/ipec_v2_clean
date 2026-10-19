# Documentación - IPEC v2 Clean

**Última actualización:** Oct 19, 2026

---

## 📚 Índice de Documentación

### Inicio Rápido
- **[QUICK-START.md](./QUICK-START.md)** - Guía de 10-15 minutos para levantar todo localmente
  - Instalación de dependencias
  - Setup de Strapi en Docker
  - Crear primeros content-types
  - Levantar web y admin

### Arquitectura & Configuración
- **[README.md](../README.md)** (raíz) - Overview del proyecto, stack, colores, idiomas
- **[STRAPI-SETUP.md](./STRAPI-SETUP.md)** - Configuración detallada de Strapi v5
  - Arquitectura de Strapi
  - Modelos de contenido
  - Configuración multiidioma
  - Deploy en VPS Hostinger
  - Troubleshooting

### Integración & Desarrollo
- **[API-INTEGRATION.md](./API-INTEGRATION.md)** - Guía de integración Next.js + Strapi
  - Configuración del cliente HTTP (Axios)
  - Servicios reutilizables
  - Hooks de React
  - Caché ISR
  - Ejemplos de uso en componentes
  - Testing de endpoints

### Instalación & Infraestructura
- **[DOCKER-INSTALLATION.md](./DOCKER-INSTALLATION.md)** - Instalación de Docker en Windows
  - Docker Desktop
  - WSL 2 setup
  - Verificación de instalación
  - Troubleshooting

---

## 🗂️ Estructura de Carpetas

```
ipec_v2_clean/
├── docs/                    ← DOCUMENTACIÓN (aquí estás)
├── web/                     ← Next.js público (5 idiomas)
│   ├── src/
│   │   ├── app/
│   │   │   └── [locale]/
│   │   └── i18n/
│   └── .env.example
├── admin/                   ← Next.js admin panel (2 idiomas)
│   ├── src/
│   │   ├── app/
│   │   │   └── [locale]/
│   │   └── i18n/
│   └── .env.example
├── shared/                  ← Código compartido entre web y admin
│   ├── api/
│   │   ├── client.ts        ← Axios HTTP client
│   │   └── services.ts      ← Servicios de API
│   ├── hooks/
│   │   └── useContent.ts    ← Hooks de React para contenido
│   ├── types/
│   │   └── content.types.ts ← Tipos TypeScript
│   └── components/          ← Componentes reutilizables
├── strapi-cms/              ← Strapi v5 + PostgreSQL
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── src/
│   ├── config/
│   └── scripts/
├── CHECKPOINT.md            ← Estado del proyecto (leer primero)
└── README.md                ← Overview general
```

---

## 📋 Content-Types (Modelos de Strapi)

| Modelo | Inglés | Idiomas | Descripción |
|--------|--------|---------|-------------|
| Hero | heroes | 5 | Sección principal del sitio |
| About | abouts | 5 | Información de la iglesia |
| Service | services | 5 | Servicios que ofrece |
| Contact | contacts | - | Información de contacto |
| Testimonial | testimonials | 5 | Testimonios de miembros |
| Footer | footers | 5 | Contenido del pie de página |
| Gallery | gallery-items | 5 | Galería de imágenes |
| Event | events | 5 | Eventos próximos |
| Settings | global-settings | - | Configuración global del sitio |

---

## 🎨 Colores Oficiales

```
Primario (Navy): #082942
Secundario (Verde): #328045
Acento (Lima): #b6dc26
```

---

## 🌐 Idiomas Soportados

### Web (5 idiomas)
- **es** - Español (por defecto)
- **en** - Inglés
- **pt** - Portugués
- **ko** - Coreano
- **de** - Alemán

### Admin (2 idiomas)
- **en** - Inglés (por defecto)
- **es** - Español

---

## 🔑 Variables de Entorno

### Web (web/.env)
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
STRAPI_API_TOKEN=your_token_here
```

### Admin (admin/.env)
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
STRAPI_API_TOKEN=your_admin_token_here
```

### Strapi (strapi-cms/.env)
```env
NODE_ENV=development
DATABASE_HOST=postgres
DATABASE_NAME=strapi_ipec
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=postgres_dev_password
```

---

## 🚀 Fases del Proyecto

### ✅ FASE 1: Estructura Base
- Crear carpetas principales (web, admin, shared, strapi-cms)
- Instalar dependencias
- Git inicial

### ✅ FASE 2: Configuración Multiidioma
- next-intl en web (5 idiomas)
- next-intl en admin (2 idiomas)
- Archivos de traducción
- Middleware de routing

### 🔨 FASE 3: Strapi CMS (EN PROGRESO)
- ✅ Documentación de Strapi
- ✅ Docker Compose + Dockerfile
- ✅ TypeScript types y servicios de API
- ✅ React hooks para contenido
- ⏳ Levantar Strapi en Docker
- ⏳ Crear content-types en Strapi
- ⏳ Generar API tokens
- ⏳ Conectar Next.js al API

### ⏳ FASE 4: Componentes Base
- Crear componentes Tailwind (web)
- Crear componentes Mantine (admin)
- Theming dinámico con CSS variables

### ⏳ FASE 5: Editor Visual CMS
- Implementar editor tipo WordPress en admin
- Preview en vivo
- Publicación de cambios

### ⏳ FASE 6: Autenticación Admin
- Better Auth setup
- Proteger rutas del admin
- Sesiones y logout

### ⏳ FASE 7: Deploy
- Docker setup para producción
- Cloudflare Tunnel
- SSL/HTTPS
- CI/CD pipeline

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Web
cd web && npm run dev

# Admin
cd admin && npm run dev

# Strapi (requiere Docker)
cd strapi-cms && docker-compose up -d
```

### Git
```bash
# Ver estado
git status

# Ver commits
git log --oneline -10

# Hacer commit
git add . && git commit -m "mensaje"

# Push a GitHub
git push origin main
```

### Docker
```bash
# Levantar servicios
cd strapi-cms && docker-compose up -d

# Ver logs
docker-compose logs -f strapi

# Reiniciar
docker-compose restart

# Limpiar (borra datos)
docker-compose down -v
```

---

## 📞 Soporte

### Si algo no funciona:

1. **Revisar logs**
   ```bash
   docker-compose logs -f strapi
   # O en archivo CHECKPOINT.md
   ```

2. **Revisar documentación relevante**
   - Problema con Strapi → STRAPI-SETUP.md
   - Problema con API → API-INTEGRATION.md
   - Problema con Docker → DOCKER-INSTALLATION.md
   - Primer start → QUICK-START.md

3. **Limpiar y reiniciar**
   ```bash
   # Reiniciar servicios
   docker-compose restart
   
   # Reinstalar dependencias
   npm ci
   ```

---

## 📊 Estadísticas del Proyecto

```
Commits: 3 (estructura + i18n + phase 3)
Branches: main
Dependencias: 50+ (web + admin + shared)
Tamaño: ~18 MB (con node_modules)
TypeScript: 100% typesafe
```

---

## 🎯 Próximos Pasos

1. Instalar Docker en Windows
2. Levantar Strapi: `docker-compose up -d`
3. Acceder a http://localhost:1337/admin
4. Crear content-types (Hero, About, Services, etc.)
5. Generar API tokens
6. Conectar web al API
7. Crear componentes con Tailwind
8. Crear editor visual en admin

---

**¿Necesitas ayuda?**
- Leer CHECKPOINT.md para estado actual
- Revisar documentación específica según el problema
- Ver QUICK-START.md para guía rápida

---

**Última actualización:** Oct 19, 2026  
**Estado:** Fase 3 en progreso  
**Próxima revisión:** Después de levantar Strapi y crear content-types
