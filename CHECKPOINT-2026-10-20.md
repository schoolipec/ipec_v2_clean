# Checkpoint — IPEC v2 Clean

**Actualizado:** 2026-10-20 (America/Los_Angeles)

---

## En Qué Estamos Trabajando

**Implementación del panel admin Next.js 15 (IPEC v2)** con:
- Autenticación JWT con Better Auth
- Panel administrativo bilingüe (EN/ES)
- Tabla de peticiones de oración con filtros, búsqueda y exportación
- Notificaciones Telegram + Email
- Integración con n8n (pendiente de clarificación)

---

## En Qué Nos Quedamos

### Sesión 2026-10-20 (Actual)

**Tarea:** Investigar y clarificar flujo de notificaciones de peticiones de oración

**Hallazgos:**
1. ✅ **Estructura de VPS clarificada:**
   - IP: `179.236.255.48` (Hostinger, propiedad de Iglesia Plenitud en Cristo)
   - Usuario SSH: `root`
   - Clave SSH teórica: `C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519` (existe pero NO autentica)

2. ✅ **Servicios identificados:**
   - n8n en `workflow.suplenitud.com` (Docker)
   - MailCow en `mail.suplenitud.com` (Docker)
   - PostgreSQL compartido (puerto 5432, no público)
   - Traefik como reverse proxy

3. ❓ **PENDIENTE DE CLARIFICAR con la otra IA:**
   - Acceso SSH real (usuario/contraseña o clave alternativa)
   - Existencia de workflow n8n para peticiones de oración
   - Configuración actual de notificaciones (¿n8n o directo desde Next.js?)
   - IDs de workflows, encryption keys, webhook URLs

4. 📄 **Documentación creada:**
   - `ACCESO-VPS-IGLESIA.md` — Preguntas explícitas para la otra IA
   - `MIGRACION-A-V2-CLEAN.md` — Referencia en proyecto viejo

**Bloqueador:** No se puede acceder al VPS por SSH para verificar workflows de n8n. Esperando respuesta de la otra IA.

---

## Estado de Componentes

### Frontend Admin (Next.js 15)
- ✅ Autenticación JWT
- ✅ Panel responsive (desktop + mobile)
- ✅ Tabla de usuarios con paginación server-side
- ✅ Tabla de peticiones de oración (COMPLETA)
  - Filtros: texto, estado, rango de fechas
  - Acciones: ver detalle, marcar presentada, eliminar
  - Exportar CSV con Excel BOM
  - Vista de impresión para Quelea
- ✅ Dark/Light theme toggle con localStorage
- ✅ Wave SVG background (position: fixed) en todas las rutas admin
- ⏳ Notificaciones (Telegram + Email) — esperando clarificación de flujo

### Backend (Next.js API Routes)
- ✅ `/api/prayer` — Guardar peticiones, notificaciones
- ⏳ n8n webhook — Esperando verificación/configuración

### Base de Datos
- ✅ Migraciones aplicadas en `suplenitud_web` (PostgreSQL)
- ✅ Tablas: users, prayer_requests, prayer_alert_preferences

### n8n (VPS)
- ❓ Workflows para IPEC — DESCONOCIDO (revisar con otra IA)
- ⏳ Webhook para peticiones de oración — PENDIENTE

---

## Next Steps (Ordenados por Prioridad)

1. **BLOQUEADOR:** Recibir respuesta de otra IA sobre acceso VPS y workflows n8n
2. Configurar webhook URL en n8n (si no existe)
3. Crear/verificar workflow n8n para peticiones de oración
4. Configurar notificaciones Telegram en n8n
5. Configurar SMTP en MailCow para `peticiones@suplenitud.com`
6. Hacer first test en vivo: enviar petición de oración → verificar Telegram + Email
7. Documentar todo en `ACCESO-VPS-IGLESIA.md` (consolidado)

---

## Comando para Contactar otra IA

Preguntarle a la otra IA (Claude Desktop, AionUi, etc.):

> "Lee el archivo `C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\ACCESO-VPS-IGLESIA.md` y responde con la información sobre el acceso al VPS de la iglesia y los workflows de n8n."

