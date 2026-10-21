# Acceso VPS Iglesia Plenitud en Cristo

**Última actualización:** 2026-10-20  
**Estado:** ✅ CLARIFICADO - Respuesta recibida de la otra IA

---

## Información Confirmada (Respuesta otra IA)

### Ubicación del VPS
- **Proveedor:** Hostinger
- **IP:** `179.236.255.48`
- **Usuario SSH:** `root`
- **Clave SSH:** `C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519` ✅ Configurada y funcional en servidor

### Servicios en el VPS
- **n8n:** `workflow.suplenitud.com` (Docker)
- **MailCow:** `mail.suplenitud.com` (Docker)
- **PostgreSQL:** Base de datos compartida (puerto 5432, no publicado)
- **Traefik:** Reverse proxy (puertos 80/443 únicamente públicos)

### Documentación del Proyecto
- **Libro de Comandos:** `C:\ProgramandoconClaude\Proyectos\enProceso\IPEC\Documentacion\LibroDeComandos.md`
- **Referencias SSH:** Usan `-i "C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519"` en comandos históricos

---

## Respuestas Confirmadas

### 1. ✅ Acceso SSH al VPS
- **Usuario SSH:** `root`
- **Clave SSH:** `C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519`
- **¿Está configurada en servidor?** ✅ **SÍ** (funcional)

### 2. ✅ Workflows de n8n para Peticiones de Oración

#### Demo (original)
- **ID:** `34d0a58c-ef6f-4f00-81be-b9eca82ee7e8`
- **Webhook:** `https://workflow.suplenitud.com/webhook/ipec-prayer-notification`

#### v2.suplenitud.com (duplicado - ACTUAL)
- **ID:** `vjjcOHw37n9Lm1ZX` ✅ **Configurado**
- **Webhook:** `https://workflow.suplenitud.com/webhook/ipec-prayer-v2`
- **Nodos principales:** 
  - Webhook (recibe payload de Next.js)
  - Normalización de datos
  - Email (hacia `peticiones@suplenitud.com`)
  - Telegram (hacia IDs recibidos dinámicamente)
- **¿Está activo?** ✅ **SÍ**

### 3. ✅ Configuración n8n
- **N8N_ENCRYPTION_KEY:** Desconocida (no es necesaria para operación)
- **Webhook URL:** `https://workflow.suplenitud.com/webhook/ipec-prayer-notification` ✅ Registrada y funcional
- **Base de datos:**
  - n8n usa su propia PostgreSQL
  - suplenitud_web (aplicación Next.js) guarda las peticiones
  - Ambas están en el mismo servidor

### 4. ✅ Flujo de Notificaciones (CONFIRMADO)
**El flujo HÍBRIDO actual es:**
1. **Formulario público** → Next.js `/api/prayer`
2. **Next.js guarda** la petición en tabla `prayer_requests` (suplenitud_web)
3. **Next.js llama** webhook de n8n: `https://workflow.suplenitud.com/webhook/ipec-prayer-notification`
4. **n8n recibe** el payload con: `name`, `request`, `telegramChatIds`, `emailCopyRecipients`, `adminUrl`
5. **n8n normaliza** los datos
6. **n8n envía:**
   - ✅ **Email** a `peticiones@suplenitud.com` (vía MailCow)
   - ✅ **Telegram** a los IDs dinámicos recibidos desde Next.js
   - ⏳ **BCC copies** (pendiente integración desde `emailCopyRecipients`)
7. **Si webhook falla:** La petición sigue guardada en la BD (no se pierde)

### 5. ✅ Usuarios Telegram/Email
- **Telegram IDs:** Enviados dinámicamente desde Next.js (tabla `prayer_alert_preferences`) — no hay lista fija en n8n
- **Emails:** 
  - Principal: `peticiones@suplenitud.com`
  - Copias BCC: Configurables dinámicamente desde Next.js (pendiente integración en n8n)

---

## Configuración Requerida en Proyecto (ipec_v2_clean)

### En `.env.local`:
```
N8N_PRAYER_WEBHOOK_URL=https://workflow.suplenitud.com/webhook/ipec-prayer-notification
```

### En `src/app/api/prayer/route.ts`:
Debe incluir en el payload:
- ✅ `telegramChatIds` (dinámico desde DB)
- ✅ `emailCopyRecipients` (dinámico desde DB)
- ✅ `adminUrl` (para link de detalle)

---

## Próximos Pasos

1. ✅ Verificar que `N8N_PRAYER_WEBHOOK_URL` está en `.env.local`
2. ✅ Verificar que `/api/prayer` envía los datos correctos al webhook
3. ⏳ Integrar BCC copies en n8n (opcional pero recomendado)
4. **PRIMERA PRUEBA EN VIVO:**
   - Enviar petición desde formulario público
   - Verificar que llega a `peticiones@suplenitud.com`
   - Verificar que llega Telegram a Juan (ID: 5332512577)
