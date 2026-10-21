# CHECKPOINT — IPEC v2 Clean
**Última actualización:** Oct 20, 2026  
**Estado:** ✅ Sitio público COMPLETO + Panel Admin COMPLETO (v2 con roles y usuarios)  
**Rama:** main  
**Dev server:** `cd web && npm run dev` → http://localhost:3000

---

## 🏗️ ARQUITECTURA ACTUAL

- **Sitio público:** `web/` — Next.js 15 + Tailwind v4 + next-intl v4
- **Contenido:** `web/src/i18n/messages/*.json` — 5 idiomas: es, en, pt, ko, de
- **Panel admin:** `web/src/app/admin/` — Next.js App Router + Prisma + bcryptjs
- **Base de datos:** SQLite en `web/prisma/dev.db` (Prisma 5)
- **Auth:** Cookies httpOnly + sesiones en DB (bcryptjs para hash)

---

## ✅ COMPLETADO

### Sitio Público (`/web`)
- ✅ Next.js 15 + Turbopack + Tailwind v4 + next-intl v4
- ✅ 5 idiomas: ES (default), EN, PT, KO, DE
- ✅ Sistema de temas light/dark (CSS variables via JS)
- ✅ Header, Footer, ScrollToTop, ThemeProvider
- ✅ HeroSection, LiveSection, GroupsSection, AboutSection
- ✅ ContactSection/PrayerForm → API → n8n webhook
- ✅ OfferingSection, VisionSection, SocialSection
- ✅ BibleModal — versículo del día
- ✅ Página /pastors — todas las rutas de idiomas
- ✅ Botón Instagram: gradiente correcto (#833ab4→#fd1d1d→#fcb045)

### Panel Admin — Sesión Oct 20, 2026
- ✅ **Bug idioma corregido** — `useAdminLang()` debe llamarse DENTRO del Provider; patrón: wrapper renderiza `<AdminShell><ContentComponent/></AdminShell>`
- ✅ **Sign-in rediseñado** — fondo blanco+ondas SVG azul/verde (branding iglesia), logo `logo-dark.png` al 60%, sin subtítulo de nombre
- ✅ **AdminShell** — ondas SVG azul/verde de fondo, sidebar/header con rgba+backdrop-filter para efecto translúcido
- ✅ **Prayer Requests** — tabla `PrayerRequest` en Prisma/SQLite, API `/api/prayer` guarda en DB primero y luego envía webhook n8n (no pierde datos si n8n falla), página `/admin/prayer-requests` con filtros/expandir/marcar-orado/eliminar, "Coming soon" quitado del sidebar
- ✅ **profile/page.tsx** — centrado con `maxWidth:720px margin:0 auto`, responsive con `repeat(auto-fit,minmax(220px,1fr))`, nuevo bloque de cambio de email (requiere contraseña actual), bilingüe con patrón correcto de contexto

### Panel Admin (`/admin`) — SISTEMA COMPLETO v2
- ✅ **Login** — `/admin/sign-in` con email + contraseña
- ✅ **Roles:** SUPER_ADMIN | ADMIN | TREASURER | USHER
- ✅ **Base de datos:** SQLite con Prisma 5 (User, Session, UserInvitation)
- ✅ **Sesiones reales:** cookie `ipec_admin_session` + tabla Session en DB
- ✅ **Middleware** — protege todas las rutas `/admin`, `/admin/*` y `/api/admin/*`
- ✅ **Gestión de usuarios** — `/admin/users` (solo SUPER_ADMIN)
  - Tabla de usuarios con roles, estado, último acceso
  - Invitar usuario por email (nodemailer, desde `no-reply@suplenitud.com`)
  - Cambiar rol de usuario
  - Eliminar usuario
- ✅ **Sistema de invitaciones** — `/admin/accept-invitation?token=...`
  - Sin contraseña preestablecida
  - El usuario crea su contraseña al aceptar la invitación
- ✅ **Primer login** — `/admin/change-password` (forzado si `mustChangePassword=true`)
- ✅ **Perfil** — `/admin/profile` (nombre, email, teléfono, WhatsApp, Telegram ID, cambio de contraseña)
- ✅ **Logout → redirige a `/`** (raíz del sitio, no a /admin/logout)
- ✅ **AdminShell** — layout compartido: logo real IPEC, sidebar grupos PRINCIPAL/MINISTERIO/SISTEMA, header con campana + dropdown usuario (idioma, perfil, logout)
- ✅ **Dashboard** — `/admin` muestra saludo + estadísticas + accesos rápidos (no redirige a /content)
- ✅ **Editor de contenido** — `/admin/content` refactorizado: usa AdminShell, tabs horizontales de sección, Guardar al fondo del formulario
- ✅ **SuperAdmin inicial creado:** jscothserver@gmail.com

---

## ⚙️ VARIABLES DE ENTORNO

### `web/.env` (Prisma + Bootstrap — NO commitear valores reales)
```env
DATABASE_URL="file:./prisma/dev.db"
INITIAL_SUPERADMIN_EMAIL="jscothserver@gmail.com"
INITIAL_SUPERADMIN_PASSWORD="72900968"
```

### `web/.env.local` (Next.js + SMTP)
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
N8N_PRAYER_WEBHOOK_URL=           # URL del webhook n8n para oraciones

# SMTP para invitaciones por email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=                        # Cuenta de correo
SMTP_PASS=                        # Contraseña o App Password
SMTP_FROM=no-reply@suplenitud.com
```

---

## 🚀 CÓMO CORRER EL PROYECTO

```bash
cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\web
npm run dev
```

- Sitio público: http://localhost:3000
- Panel admin: http://localhost:3000/admin → redirige a /admin/sign-in
- Login: jscothserver@gmail.com / 72900968

### Crear SuperAdmin en producción
```bash
# 1. Configurar en .env:
INITIAL_SUPERADMIN_EMAIL="tu@correo.com"
INITIAL_SUPERADMIN_PASSWORD="contraseña_temporal"

# 2. Ejecutar bootstrap:
npm run admin:bootstrap

# 3. Eliminar las variables del .env después de usarlas
```

### Comandos de base de datos
```bash
npm run db:studio     # Abrir Prisma Studio (GUI)
npm run db:migrate    # Aplicar nuevas migraciones
```

---

## ⚠️ NOTAS TÉCNICAS IMPORTANTES

1. **Tailwind v4 + Turbopack**: Las clases `dark:` NO funcionan en dev. Se usan CSS custom properties aplicadas via JS en `ThemeProvider`.
2. **Admin usa estilos inline**: Para evitar conflictos con Tailwind del sitio público.
3. **SQLite no soporta enums de Prisma**: Los roles son `String` en la DB. Valores válidos: `SUPER_ADMIN`, `ADMIN`, `TREASURER`, `USHER`.
4. **Inglés sin prefijo**: El inglés vive en `src/app/page.tsx` (no en `[locale]/`). Los otros idiomas en `src/app/[locale]/`.
5. **Middleware en Edge runtime**: Solo verifica existencia de cookie. La validación real (expiry + DB) se hace en las API routes.
6. **SMTP en desarrollo**: Si no se configura SMTP, las invitaciones se guardan en DB pero el email falla silenciosamente (la invitación sigue siendo válida).

---

## 📋 COMPLETADO (sesión Oct 20, 2026 — continuación)

- ✅ **AdminDashboard.tsx** — completamente bilingüe: saludo, roles, estadísticas, accesos rápidos, nota de pedidos de oración
- ✅ **content/page.tsx** — completamente bilingüe: tabs de secciones, labels de todos los ~70 campos, textos de UI (guardar, cargar, error). Patrón wrapper+inner aplicado
- ✅ **accept-invitation/page.tsx** — bilingüe (detecta idioma del navegador, ya que es página pre-sesión)
- ✅ **change-password/page.tsx** — bilingüe (mismo enfoque)
- ✅ **prayer-requests/page.tsx** — bug fix: `Array.isArray(data)` antes de `setRequests` para evitar error cuando la API retorna objeto de error

## ⚠️ ACCIÓN REQUERIDA — Regenerar cliente Prisma

El modelo `PrayerRequest` existe en la DB (migración aplicada) pero el cliente Prisma generado NO lo incluye porque `prisma generate` falló con EPERM (el dev server tenía el DLL bloqueado).

**Para arreglarlo:**
1. Detener el dev server (`Ctrl+C` en la terminal donde corre `npm run dev`)
2. `npx prisma generate`
3. `npm run dev`

Sin esto, la página `/admin/prayer-requests` mostrará lista vacía (o error 500 de la API).

## 📋 PENDIENTES PRÓXIMOS (pedidos por Juan)

- [ ] **Branding configurable desde panel** — logo, nombre empresa y footer del sign-in editables desde Settings (solo SUPER_ADMIN). Footer oculto por default. Necesita: `data/branding.json` + `/api/admin/settings` + sección en `/admin/profile` o nueva ruta `/admin/settings`

## 📋 PENDIENTES FUTUROS

- [ ] Configurar `N8N_PRAYER_WEBHOOK_URL` con URL real de n8n en producción
- [ ] Configurar SMTP real para envío de invitaciones
- [ ] Cambiar contraseña del SuperAdmin antes del deploy a producción
- [ ] Deploy en VPS — Nginx como proxy inverso
- [ ] Editor de versículos bíblicos en panel admin
- [ ] Gestión de métricas de visitas (reemplazar contador simple por algo más profesional)
- [ ] Configurar Google Analytics (`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`)
- [ ] 2FA (campo existe en DB, pendiente implementación UI)

---

## 📁 ESTRUCTURA DE ARCHIVOS CLAVE

```
web/
├── prisma/
│   ├── schema.prisma          # User, Session, UserInvitation
│   ├── dev.db                 # SQLite (NO commitear)
│   └── migrations/            # Historial de migraciones
├── scripts/
│   └── bootstrap-admin.ts     # Crear primer SuperAdmin
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Home EN
│   │   ├── pastors/page.tsx    # Pastors EN
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Home multiidioma
│   │   │   └── pastors/page.tsx
│   │   ├── admin/
│   │   │   ├── _components/
│   │   │   │   └── AdminShell.tsx   # Layout sidebar compartido
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Redirect → /admin/content
│   │   │   ├── sign-in/page.tsx     # Login (email + password)
│   │   │   ├── login/page.tsx       # Redirect → /admin/sign-in
│   │   │   ├── change-password/page.tsx  # Primer login
│   │   │   ├── accept-invitation/page.tsx # Aceptar invitación
│   │   │   ├── profile/page.tsx     # Perfil del usuario
│   │   │   ├── users/page.tsx       # Gestión de usuarios (SUPER_ADMIN)
│   │   │   └── content/page.tsx     # Editor de contenido
│   │   └── api/
│   │       ├── prayer/route.ts
│   │       └── admin/
│   │           ├── auth/
│   │           │   ├── login/route.ts   # POST login
│   │           │   └── logout/route.ts  # POST logout → /
│   │           ├── users/
│   │           │   ├── route.ts         # GET lista, POST crear
│   │           │   └── [id]/route.ts    # PATCH rol, DELETE
│   │           ├── invitations/
│   │           │   ├── route.ts         # POST enviar, GET listar
│   │           │   └── accept/route.ts  # POST aceptar token
│   │           ├── profile/route.ts     # GET ver, PATCH actualizar
│   │           ├── change-password/route.ts # POST cambio forzado
│   │           └── content/route.ts     # GET/PUT contenido JSON
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── auth.ts            # getAdminSession, requireAdminSession
│   │   └── email.ts           # sendInvitationEmail
│   └── i18n/messages/         # es.json, en.json, pt.json, ko.json, de.json
├── middleware.ts               # Protege /admin, maneja intl
├── .env                        # DATABASE_URL + bootstrap vars
└── .env.local                  # SMTP + site URL
```
