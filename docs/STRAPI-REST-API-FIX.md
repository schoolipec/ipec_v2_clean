# Solución: REST API Endpoints en Strapi v3.6

## 🔴 Problema Identificado

Strapi v3.6.11 **NO expone automáticamente** los REST API endpoints para content-types creados vía filesystem (archivos JSON en `api/{name}/models/`).

Los endpoints `/api/heroes`, `/api/about`, etc. retornan `404 Not Found` porque:
- Los content-types existen en archivos but no en la base de datos de Strapi
- Strapi v3 requiere que los content-types se registren en BD para generar endpoints REST

## ✅ Solución

### Opción A: Crear Content-Types via Admin UI (Recomendado)

1. Abre `http://localhost:1337/admin`
2. Ve a **Plugins** → **Content-Type Builder**
3. Crea cada modelo con sus campos (ver detalles abajo)
4. Strapi generará automáticamente los endpoints REST

### Opción B: Usar API Interna de Strapi (Programático)

Este proyecto incluye un endpoint personalizado que crea los content-types vía API interna.

```bash
# Ejecutar después de que Strapi esté corriendo
cd strapi-cms
node temporal_create_content_types_internal.js
```

## 📋 Content-Types a Crear

Ver `docs/CONTENT-TYPES-GUIDE.md` para la estructura exacta de cada modelo.

## 🚀 Validación

Una vez creados, probar:

```bash
curl http://localhost:1337/api/heroes
curl http://localhost:1337/api/about
curl http://localhost:1337/api/services
# etc...
```

Deberían responder con JSON (vacío si no hay datos, pero con estructura válida).
