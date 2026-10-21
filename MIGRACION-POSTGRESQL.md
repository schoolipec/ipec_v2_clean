# Migración a PostgreSQL — IPEC v2

**Fecha:** 2026-10-20  
**Estado:** EN PROGRESO

---

## Cambios Realizados

✅ **Schema.prisma:**
- Cambio de `provider = "sqlite"` a `provider = "postgresql"`
- Agregada tabla `PrayerAlertPreferences`

✅ **.env.local:**
- Agregada `DATABASE_URL` con configuración PostgreSQL local
- Comentarios con alternativas para VPS

---

## Paso 1: PostgreSQL Local (Desarrollo)

### Opción A: PostgreSQL ya instalado en Windows

```bash
# Verificar que PostgreSQL esté corriendo
psql --version
```

Si no tienes PostgreSQL, descargalo: https://www.postgresql.org/download/windows/

### Opción B: PostgreSQL via Docker (Recomendado para desarrollo)

```bash
docker run --name suplenitud-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=suplenitud_web \
  -p 5432:5432 \
  -d postgres:16-alpine
```

---

## Paso 2: Crear la Base de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres -h localhost

# En la consola psql:
CREATE DATABASE suplenitud_web;
\c suplenitud_web
```

---

## Paso 3: Ejecutar Migraciones de Prisma

```bash
cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\web

# Generar cliente Prisma
npx prisma generate

# Crear/aplicar migraciones (detecta cambios del schema)
npx prisma migrate dev --name initial

# O si prefieres sincronizar sin historial de migraciones:
npx prisma db push
```

**Nota:** Si quieres usar los datos existentes del VPS, haz un dump de la BD y restablécela aquí.

---

## Paso 4: Verificar Migraciones

```bash
# Abrir Prisma Studio para ver la BD
npx prisma studio

# Debe mostrar las tablas:
# - User
# - Session
# - UserInvitation
# - PrayerRequest
# - PrayerAlertPreferences
```

---

## Paso 5: Testear Conexión

```bash
# En el proyecto, ejecutar un test simple:
npm run dev

# En navegador:
http://localhost:3000/admin/sign-in

# Si carga sin errores de BD → ✅ Funcionando
```

---

## Paso 6: Configurar para VPS (Después)

Una vez que funcione localmente, para el VPS:

### 6a. En VPS — Crear BD y usuario:

```bash
# SSH al VPS
ssh -i C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519 root@179.236.255.48

# Dentro del contenedor PostgreSQL:
docker exec -it n8n-postgres-1 psql -U postgres

# Crear BD y usuario si no existen:
CREATE DATABASE suplenitud_web;
CREATE USER ipec_user WITH PASSWORD 'secure_password';
ALTER ROLE ipec_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE suplenitud_web TO ipec_user;
```

### 6b. En `.env` del VPS (deploy/.env):

```
DATABASE_URL=postgresql://ipec_user:secure_password@n8n-postgres-1:5432/suplenitud_web?schema=public
```

### 6c. Deploy en VPS:

```bash
# En el VPS, dentro del contenedor Next.js:
npx prisma migrate deploy

# O si es la primera vez:
npx prisma migrate dev --name initial
```

---

## Checklist de Verificación

- [ ] PostgreSQL instalado/corriendo localmente
- [ ] BD `suplenitud_web` creada
- [ ] `.env.local` con `DATABASE_URL` correcta
- [ ] `npx prisma migrate dev` ejecutado sin errores
- [ ] `npx prisma studio` muestra todas las tablas
- [ ] `npm run dev` inicia sin errores de BD
- [ ] Panel admin carga correctamente
- [ ] Datos existentes visibles en Prisma Studio
- [ ] ✅ LISTO para despliegue en v2.suplenitud.com

---

## Próximos Pasos

1. Ejecutar los pasos 1-5 en desarrollo local
2. Verificar que todo funciona
3. Documentar credenciales de VPS
4. Configurar BD en VPS
5. Crear Docker Compose para v2.suplenitud.com
6. Desplegar y hacer primeira prueba en vivo
