# IPEC v2 Clean - Iglesia Plenitud en Cristo

Proyecto completamente restructurado con arquitectura moderna, profesional y escalable.

## 📁 Estructura del Proyecto

```
ipec_v2_clean/
├── web/                    # Sitio público (Next.js 16, React 19, Tailwind v3)
│   ├── src/app/           # App Router de Next.js
│   ├── src/components/    # Componentes reutilizables
│   ├── src/lib/           # Utilidades y helpers
│   ├── src/i18n/          # Configuración de idiomas (ES/EN/PT/KO/DE)
│   └── public/            # Assets estáticos (logos, imágenes)
│
├── admin/                  # Panel admin (Next.js 16 + Mantine UI)
│   ├── src/app/(admin)/   # Rutas protegidas del admin
│   ├── src/cms-editor/    # Editor visual tipo WordPress
│   ├── src/components/    # Componentes Mantine
│   ├── src/lib/           # Helpers y API integration
│   └── src/i18n/          # Idiomas (ES/EN, EN por default)
│
├── shared/                 # Código compartido entre web y admin
│   ├── types/             # TypeScript interfaces
│   ├── constants/         # Constantes globales
│   └── utils/             # Funciones de utilidad
│
├── strapi-cms/            # Configuración de Strapi CMS
│   ├── docker-compose.yml # Stack de Strapi + PostgreSQL
│   ├── .env.example       # Variables de entorno
│   └── README.md          # Guía de setup de Strapi
│
└── docs/                  # Documentación del proyecto
    ├── ARCHITECTURE.md    # Decisiones de arquitectura
    ├── SETUP.md           # Guía de instalación
    └── DEPLOYMENT.md      # Guía de deployment
```

## 🎨 Colores Oficiales

```
Light Mode:
- Navy (Primary): #082942
- Green (Accent): #328045
- Lime (Highlight): #b6dc26
- Paper (Background): #f7fcfe
- Mist (Secondary BG): #e7f5fb

Dark Mode:
Variantes más oscuras del mismo esquema
```

## 🌍 Idiomas

**Sitio Web (web/):**
- Español (ES) - Default
- Inglés (EN)
- Portugués (PT)
- Coreano (KO)
- Alemán (DE)

**Panel Admin (admin/):**
- Inglés (EN) - Default
- Español (ES)

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 16.4** - Framework React full-stack
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v3** - Styling (web)
- **Mantine UI v9** - Component library (admin)
- **next-intl** - Internacionalización

### Backend/CMS
- **Strapi v5** - Headless CMS
- **PostgreSQL 16** - Base de datos
- **Docker** - Containerización

### Autenticación & Autorización
- **Better Auth** - Sistema de autenticación
- **Spatie Permission** - Control de permisos (Laravel-compatible)

## 📦 Instalación

### Web
```bash
cd web
npm install
npm run dev
# Abre http://localhost:3000
```

### Admin
```bash
cd admin
npm install
npm run dev
# Abre http://localhost:3001
```

### Strapi CMS
```bash
cd strapi-cms
docker-compose up -d
# Accede a http://localhost:1337/admin
```

## 📝 Credenciales Default

**Sitio Web & Admin Panel:**
- Usuario: `jscothserver`
- Email: `jscothserver@gmail.com`
- Password: `72900968` (cambiar en producción)

**Strapi CMS:**
- Se configura al primer inicio

## 🔄 Workflow de Contenido

1. **Editor (Iglesia)** edita contenido en Strapi CMS
2. **Strapi API** expone el contenido via REST/GraphQL
3. **Next.js Web** consume API y renderiza en 5 idiomas
4. **Panel Admin** muestra editor visual tipo WordPress

## 🚢 Deployment

Todos los servicios están dockerizados para facilitar deployment:
- Web: Docker container
- Admin: Docker container
- Strapi: Docker container

Ver `docs/DEPLOYMENT.md` para instrucciones específicas.

## 📞 Soporte

Para preguntas sobre la arquitectura, revisar `docs/ARCHITECTURE.md`

---

**Proyecto actualizado:** Oct 19, 2026
**Versión:** 2.0 Clean
**Estado:** 🔨 En desarrollo
