# Guía: Crear Content-Types en Strapi Admin

**Tiempo estimado:** 30-45 minutos  
**Fecha:** Oct 19, 2026

---

## 🚀 Inicio Rápido

**URL:** http://localhost:1337/admin

Si es primera vez:
1. Click en **"Let's start"**
2. Llenar formulario con:
   - **Email:** jscothserver@gmail.com
   - **Password:** 72900968
   - **Confirmar password:** 72900968
3. Click **"Let's Start**

---

## 📋 Content-Types a Crear

Vamos a crear 9 modelos. Aquí está la estructura exacta para cada uno:

---

## 1️⃣ Hero Section

**Ruta:** Content-Type Builder → Create new collection type  
**Nombre:** `hero` (singular, lowercase)

### Campos:

| Campo | Tipo | Requerido | i18n | Notas |
|-------|------|-----------|------|-------|
| title | String | ✅ | ✅ | "Crece en tu vida espiritual" |
| subtitle | String | ❌ | ✅ | "Bienvenido a nuestra iglesia" |
| description | Rich Text | ❌ | ✅ | Descripción larga con formato |
| cta_button_text | String | ❌ | ✅ | "Conoce más" / "Learn more" |
| cta_button_link | String | ❌ | ✅ | "/servicios" o "/services" |
| image | Media (Single) | ❌ | ❌ | Imagen del héroe |
| background_color | String | ❌ | ❌ | Default: #082942 |
| order | Integer | ❌ | ❌ | Default: 1 |

**Instrucciones:**
1. Click **Create new collection type**
2. Llenar nombre: `hero`
3. Click **Continue**
4. Agregar cada campo:
   - Para String: Click **Add another field** → **Text** → Single line text
   - Para Rich Text: Click **Add another field** → **Rich Text**
   - Para Media: Click **Add another field** → **Media**
   - Para Integer: Click **Add another field** → **Number** → Integer
5. Para campos multiidioma: Marcar checkbox **Enable i18n for this field**
6. Click **Finish**
7. Click **Save**
8. Click **Publish**

---

## 2️⃣ About Section

**Nombre:** `about`

### Campos:

| Campo | Tipo | Requerido | i18n |
|-------|------|-----------|------|
| title | String | ✅ | ✅ |
| description | Rich Text | ❌ | ✅ |
| mission | Text | ❌ | ✅ |
| vision | Text | ❌ | ✅ |
| values | JSON | ❌ | ✅ |
| image | Media (Single) | ❌ | ❌ |
| order | Integer | ❌ | ❌ |

**Nota sobre JSON:** Para `values`, es un array de strings:
```json
["Amor", "Transparencia", "Crecimiento Espiritual"]
```

---

## 3️⃣ Service (Servicios)

**Nombre:** `service` (singular)

### Campos:

| Campo | Tipo | Requerido | i18n |
|-------|------|-----------|------|
| title | String | ✅ | ✅ |
| description | Rich Text | ❌ | ✅ |
| icon | String | ❌ | ❌ |
| image | Media (Single) | ❌ | ❌ |
| color | String | ❌ | ❌ |
| order | Integer | ❌ | ❌ |

**Para `icon`:** Usar nombres de Tabler Icons (https://tabler-icons.io/)
- Ejemplos: `heart`, `pray`, `book`, `users`, `music`

---

## 4️⃣ Contact Info

**Nombre:** `contact`

### Campos:

| Campo | Tipo | Requerido | i18n |
|-------|------|-----------|------|
| email | Email | ✅ | ❌ |
| phone | String | ❌ | ❌ |
| address | String | ❌ | ✅ |
| hours | JSON | ❌ | ✅ |
| social_links | JSON | ❌ | ❌ |
| map_coordinates | JSON | ❌ | ❌ |

**Estructura de `hours`:**
```json
{
  "monday": { "open": "09:00", "close": "18:00" },
  "sunday": { "open": "10:00", "close": "14:00" }
}
```

**Estructura de `social_links`:**
```json
{
  "facebook": "https://facebook.com/...",
  "instagram": "https://instagram.com/...",
  "youtube": "https://youtube.com/...",
  "whatsapp": "https://wa.me/..."
}
```

---

## 5️⃣ Testimonial

**Nombre:** `testimonial`

### Campos:

| Campo | Tipo | Requerido | i18n |
|-------|------|-----------|------|
| author_name | String | ✅ | ❌ |
| author_role | String | ❌ | ❌ |
| content | Text | ✅ | ✅ |
| author_image | Media (Single) | ❌ | ❌ |
| rating | Integer | ❌ | ❌ |
| order | Integer | ❌ | ❌ |

**Para `rating`:** Números del 1-5

---

## 6️⃣ Footer Content

**Nombre:** `footer`

### Campos:

| Campo | Tipo | Requerido | i18n |
|-------|------|-----------|------|
| copyright_text | String | ❌ | ✅ |
| quick_links | JSON | ❌ | ✅ |
| social_links | JSON | ❌ | ❌ |
| logo | Media (Single) | ❌ | ❌ |

**Estructura de `quick_links`:**
```json
[
  { "label": "Inicio", "url": "/" },
  { "label": "Acerca de", "url": "/acerca-de" },
  { "label": "Servicios", "url": "/servicios" }
]
```

---

## 7️⃣ Gallery Item

**Nombre:** `gallery-item`

### Campos:

| Campo | Tipo | Requerido | i18n |
|-------|------|-----------|------|
| title | String | ✅ | ✅ |
| description | Text | ❌ | ✅ |
| image | Media (Single) | ✅ | ❌ |
| category | String | ❌ | ❌ |
| order | Integer | ❌ | ❌ |

**Para `category`:** Ejemplos: "events", "worship", "community"

---

## 8️⃣ Event

**Nombre:** `event`

### Campos:

| Campo | Tipo | Requerido | i18n |
|-------|------|-----------|------|
| title | String | ✅ | ✅ |
| description | Rich Text | ❌ | ✅ |
| start_date | Date | ✅ | ❌ |
| end_date | Date | ❌ | ❌ |
| location | String | ❌ | ✅ |
| image | Media (Single) | ❌ | ❌ |
| event_url | String | ❌ | ❌ |
| order | Integer | ❌ | ❌ |

**Para fechas:** Formato ISO: `2026-10-20T18:00:00Z`

---

## 9️⃣ Global Settings

**Nombre:** `global-settings`

### Campos:

| Campo | Tipo | Requerido | i18n |
|-------|------|-----------|------|
| site_name | String | ✅ | ❌ |
| site_description | String | ❌ | ❌ |
| logo | Media (Single) | ❌ | ❌ |
| favicon | Media (Single) | ❌ | ❌ |
| primary_color | String | ❌ | ❌ |
| secondary_color | String | ❌ | ❌ |
| accent_color | String | ❌ | ❌ |
| fonts | JSON | ❌ | ❌ |

**Para `fonts`:**
```json
{
  "heading": "Inter",
  "body": "Inter"
}
```

---

## 🌐 Configurar Multiidioma (IMPORTANTE)

**Después de crear todos los content-types:**

1. Ir a **Settings** (icono de engranaje)
2. Click en **Internationalization**
3. Click en **Locales**
4. Click **Create new locale**
5. Repetir para cada idioma:
   - ✅ `es` (Español) - Default
   - ⏳ `en` (Inglés)
   - ⏳ `pt` (Portugués)
   - ⏳ `ko` (Coreano)
   - ⏳ `de` (Alemán)

**Para cada idioma:**
- Display name: Nombre del idioma
- Iso code: Código ISO (en, pt, ko, de)
- Click **Save**

---

## 📝 Marcar Campos como Multiidioma

Para CADA content-type, después de crear:

1. Ir a **Content-Type Builder**
2. Click en el content-type (ej: `hero`)
3. Para cada campo que tenga `✅` en columna `i18n`:
   - Click en el campo
   - En panel derecho, marcar **✓ Enable i18n for this field**
   - Click **Save**
4. Repetir para todos los campos multiidioma

---

## ✅ Checklist de Creación

- [ ] Hero
- [ ] About
- [ ] Service
- [ ] Contact
- [ ] Testimonial
- [ ] Footer
- [ ] Gallery Item
- [ ] Event
- [ ] Global Settings
- [ ] Agregar 5 locales (es, en, pt, ko, de)
- [ ] Marcar todos los campos como i18n

---

## 🧪 Agregar Contenido de Prueba

Una vez creados todos los content-types:

1. Ir a **Content Manager** (en menú izquierdo)
2. Click en **Heroes**
3. Click **Create new entry**
4. Llenar formulario en ESPAÑOL:
   - title: "Crece en tu vida espiritual"
   - subtitle: "Bienvenido a IPEC"
   - description: "Somos una comunidad de fe..."
   - cta_button_text: "Conoce más"
   - cta_button_link: "/acerca-de"
5. Click **Publish**
6. En el menú desplegable de idioma (arriba), click **Add another locale**
7. Seleccionar **English**
8. Traducir a inglés:
   - title: "Grow in your spiritual life"
   - subtitle: "Welcome to IPEC"
   - etc.
9. Click **Publish**

Repetir para otros content-types con contenido mínimo.

---

## 🔑 Generar API Token

Cuando todo esté creado:

1. Ir a **Settings**
2. Click **API Tokens**
3. Click **Create new API Token**
4. Llenar:
   - Name: `frontend-public`
   - Type: `Full access` (por ahora)
   - Description: "Token para Next.js frontend"
5. Click **Save**
6. **COPIAR** el token que aparece
7. Guardar en `web/.env` y `admin/.env`:
   ```env
   STRAPI_API_TOKEN=<token_aqui>
   ```

---

## 🧪 Verificar Conexión

```bash
# Obtener héroes en español
curl "http://localhost:1337/api/heroes?locale=es"

# Deberías ver el contenido que creaste
{
  "data": [{
    "id": 1,
    "title": "Crece en tu vida espiritual",
    ...
  }]
}
```

---

**Tiempo estimado:** 30-45 minutos  
**Siguiente paso:** Generar API token y conectar Next.js

---

**Última actualización:** Oct 19, 2026
