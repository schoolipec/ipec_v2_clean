# FASE 4 - Crear Content-Types en Strapi Admin

## ⚠️ Situación Actual

- Strapi v3.6.11 está corriendo en http://localhost:1337
- Panel admin disponible en http://localhost:1337/admin
- API client, services y hooks están listos en Next.js
- **FALTA**: Crear los 9 content-types en el Admin UI para que Strapi exponga los endpoints REST

## 🎯 Qué Necesitas Hacer

### Paso 1: Abre el Admin Panel
Navega a: **http://localhost:1337/admin**

### Paso 2: Accede a Content-Type Builder
En el menú izquierdo, ve a:
**Plugins** → **Content-Type Builder**

### Paso 3: Crea los 9 Collection Types

Para cada uno, haz clic en **"Create new collection type"** y llena los campos:

---

#### 1️⃣ **HERO**
- **Display name**: Hero
- **API ID**: hero
- Campos:
  - `title` (String, Required)
  - `subtitle` (String)
  - `description` (Rich text)
  - `cta_button_text` (String)
  - `cta_button_link` (String)
  - `image` (Media, Single)
  - `background_color` (String, default: #082942)
  - `order` (Integer, default: 1)

#### 2️⃣ **ABOUT**
- **Display name**: About
- **API ID**: about
- Campos:
  - `title` (String, Required)
  - `description` (Rich text)
  - `mission` (Text)
  - `vision` (Text)
  - `values` (JSON)
  - `image` (Media, Single)
  - `order` (Integer, default: 2)

#### 3️⃣ **SERVICE**
- **Display name**: Service
- **API ID**: service
- Campos:
  - `title` (String, Required)
  - `description` (Rich text)
  - `icon` (String)
  - `image` (Media, Single)
  - `color` (String, default: #328045)
  - `order` (Integer)

#### 4️⃣ **CONTACT**
- **Display name**: Contact
- **API ID**: contact
- Campos:
  - `email` (Email, Required)
  - `phone` (String)
  - `address` (Text)
  - `hours` (JSON)
  - `social_links` (JSON)
  - `map_coordinates` (JSON)

#### 5️⃣ **TESTIMONIAL**
- **Display name**: Testimonial
- **API ID**: testimonial
- Campos:
  - `author_name` (String, Required)
  - `author_role` (String)
  - `content` (Text, Required)
  - `author_image` (Media, Single)
  - `rating` (Integer)
  - `order` (Integer)

#### 6️⃣ **FOOTER**
- **Display name**: Footer
- **API ID**: footer
- Campos:
  - `copyright_text` (Text)
  - `quick_links` (JSON)
  - `social_links` (JSON)
  - `logo` (Media, Single)

#### 7️⃣ **GALLERY-ITEM**
- **Display name**: Gallery Item
- **API ID**: gallery-item
- Campos:
  - `title` (String, Required)
  - `description` (Text)
  - `image` (Media, Single, Required)
  - `category` (String)
  - `order` (Integer)

#### 8️⃣ **EVENT**
- **Display name**: Event
- **API ID**: event
- Campos:
  - `title` (String, Required)
  - `description` (Rich text)
  - `start_date` (DateTime, Required)
  - `end_date` (DateTime)
  - `location` (String)
  - `image` (Media, Single)
  - `event_url` (String)
  - `order` (Integer)

#### 9️⃣ **GLOBAL-SETTING** (Single Type, no Collection)
- **Display name**: Global Setting
- **API ID**: global-setting
- **Type**: Single Type (no Collection)
- Campos:
  - `site_name` (String, Required)
  - `site_description` (Text)
  - `logo` (Media, Single)
  - `favicon` (Media, Single)
  - `primary_color` (String)
  - `secondary_color` (String)
  - `accent_color` (String)
  - `fonts` (JSON)

---

### Paso 4: Guarda y Verifica

1. Después de crear cada content-type, haz clic en **"Save"**
2. Strapi reiniciará automáticamente
3. Los endpoints REST estarán disponibles en:
   - `http://localhost:1337/api/heroes`
   - `http://localhost:1337/api/about`
   - `http://localhost:1337/api/services`
   - etc.

### Paso 5: Prueba los Endpoints

```bash
curl http://localhost:1337/api/heroes
curl http://localhost:1337/api/about
curl http://localhost:1337/api/services
# etc...
```

Deberían retornar:
```json
[]
```

(Arreglo vacío si no hay datos aún, ¡pero el endpoint funciona!)

---

## ✅ Cuando Hayas Terminado

Una vez creados todos los 9 content-types:
1. Los endpoints REST estarán funcionales
2. Next.js puede conectarse al API
3. Pasamos a Fase 5: Crear contenido de prueba y conectar Next.js

## 📝 Nota Importante

- En Strapi v3, los content-types DEBEN ser creados via Admin UI
- Los archivos JSON en `/api/{name}/models/` son solo referencia
- Strapi genera automáticamente los endpoints cuando creas un content-type en el UI

¡Avísame cuando hayas completado todos los 9 content-types!
