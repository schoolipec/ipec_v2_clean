# Quick Start - IPEC v2 Clean

**Tiempo estimado:** 10-15 minutos (primer run)

---

## ✅ Checklist Inicial

- [ ] Docker instalado y corriendo
- [ ] Node.js 18+ instalado
- [ ] Git configurado
- [ ] Acceso a la carpeta del proyecto

---

## 1. Clonar el Proyecto

```bash
cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean

# Ver estado
git status

# Ver rama actual (debe ser main)
git branch
```

---

## 2. Instalar Dependencias (Web y Admin)

```bash
# Web
cd web
npm install
cd ..

# Admin
cd admin
npm install
cd ..
```

---

## 3. Configurar Strapi

```bash
# Entrar a carpeta Strapi
cd strapi-cms

# Crear archivo .env desde ejemplo
cp .env.example .env

# Ver contenido del .env
cat .env
```

**Editar `.env`** - Cambiar valores por defecto:
```env
NODE_ENV=development
POSTGRES_PASSWORD=postgres_dev_password
JWT_SECRET=dev_jwt_secret_123456
API_TOKEN_SALT=dev_api_token_salt_123456
ADMIN_JWT_SECRET=dev_admin_jwt_secret_123456
APP_KEYS=dev_app_key_1_123456,dev_app_key_2_123456
```

---

## 4. Levantar Stack Completo

### Opción A: Docker (Recomendado)

```bash
# Desde strapi-cms/
docker-compose up -d

# Ver logs de Strapi
docker-compose logs -f strapi

# Esperar a que veas: "✓ Server is running at http://localhost:1337"
```

### Opción B: Local (sin Docker)

```bash
# PostgreSQL debe estar corriendo en puerto 5432
# Luego en strapi-cms/:

npm install
npm run develop
```

---

## 5. Acceder a Strapi Admin

1. Ir a **http://localhost:1337/admin**
2. Crear cuenta admin (email + password)
3. Guardar credenciales

**Credenciales default para testing:**
- Email: `jscothserver@gmail.com`
- Password: `72900968`

---

## 6. Crear Content-Types (Primero)

En el panel de Strapi Admin:

### Steps:
1. **Content-Type Builder** (icono de construcción)
2. **Create new collection type**
3. Nombre: `hero` (singular, lowercase)
4. Agregar campos:

**Hero Content-Type:**
```
- title (String, Required)
- subtitle (String)
- description (Rich Text)
- cta_button_text (String)
- cta_button_link (String)
- image (Media - Single)
- order (Integer, Default: 1)
```

5. **Save** y **Publish**
6. Ir a **Settings > Internationalization > Locales**
7. Agregar locales: `en`, `pt`, `ko`, `de` (además del default `es`)

---

## 7. Crear Contenido de Prueba

1. **Content Manager** (en el menú)
2. **Heroes** (o el content-type que creaste)
3. **Create new entry**
4. Llenar campos en español
5. **Publish**
6. **Add another locale** → Repetir en inglés
7. **Save**

---

## 8. Generar API Token

1. **Settings** → **API Tokens**
2. **Create new API Token**
3. Nombre: `frontend-read`
4. Type: `Full access` (por ahora)
5. **Save**
6. Copiar token y guardar en `.env` de **web** y **admin**:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
STRAPI_API_TOKEN=your_token_here
```

---

## 9. Levantar Next.js Web

```bash
cd web
npm run dev

# Ir a http://localhost:3000
```

---

## 10. Levantar Next.js Admin

```bash
# Otra terminal
cd admin
npm run dev

# Ir a http://localhost:3001
```

---

## ✅ Verificación Final

- [ ] Strapi running: `http://localhost:1337/admin`
- [ ] Web running: `http://localhost:3000`
- [ ] Admin running: `http://localhost:3001`
- [ ] API test: `curl http://localhost:1337/api/heroes`
- [ ] Contenido visible en web

---

## 🐛 Troubleshooting

### "Cannot connect to postgres"
```bash
docker-compose restart postgres
docker-compose logs postgres
```

### "Port 1337 already in use"
```bash
# Cambiar puerto en docker-compose.yml:
ports:
  - "1338:1337"  # Usar 1338 en lugar de 1337
```

### "Module not found"
```bash
# Reinstalar dependencias
npm install
# O
npm ci
```

### "API returns 401 Unauthorized"
```bash
# Verificar que API_TOKEN está en .env
# Verificar que token es válido en Strapi admin
```

---

## 📚 Documentación Completa

- **STRAPI-SETUP.md** - Configuración detallada
- **API-INTEGRATION.md** - Cómo conectar Next.js
- **README.md** - Overview del proyecto

---

## 🎯 Próximos Pasos Después de Quick Start

1. Crear todos los content-types (About, Services, Contact, Footer)
2. Llenar contenido en 5 idiomas
3. Implementar componentes en web
4. Crear editor visual en admin
5. Deploy a v2.suplenitud.com

---

**¿Necesitas ayuda?**
- Revisar logs: `docker-compose logs -f`
- Reiniciar todo: `docker-compose down && docker-compose up -d`
- Limpiar todo: `docker-compose down -v` (⚠️ borra datos)

---

**Última actualización:** Oct 19, 2026
