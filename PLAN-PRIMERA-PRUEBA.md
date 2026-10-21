# Plan: Primera Prueba de Petición de Oración

**Fecha:** 2026-10-20  
**Objetivo:** Validar que el flujo completo de notificaciones funciona en vivo

---

## Estado Actual

| Componente | Estado |
|-----------|--------|
| **Webhook URL en .env** | ✅ Configurado: `https://workflow.suplenitud.com/webhook/ipec-prayer-notification` |
| **Código `/api/prayer`** | ✅ Envía petición al webhook |
| **Workflow n8n** | ✅ ID: `34d0a58c-ef6f-4f00-81be-b9eca82ee7e8` (activo) |
| **Email a peticiones@suplenitud.com** | ✅ Configurado en n8n |
| **Notificaciones Telegram** | ✅ Configuradas en n8n |
| **Servidor Next.js** | ✅ Corriendo en `http://localhost:3000` |

---

## Paso a Paso: PRIMERA PRUEBA

### 1️⃣ **Verificar que el servidor está corriendo**
```bash
# En terminal:
cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\web
npm run dev
```
✅ Debe estar corriendo en `http://localhost:3000`

### 2️⃣ **Preparar datos de prueba**
Necesito que antes de hacer la prueba, confirmes:
- **Tu Telegram ID:** `5332512577` ¿Es correcto?
- **Tu perfil en admin panel** → ¿Tienes habilitadas las notificaciones de Telegram?
  - Ruta: `http://localhost:3000/admin/profile`
  - Campo: "ID de Telegram" debe tener valor
  - Checkbox: "Recibir notificaciones por Telegram" debe estar ✅

### 3️⃣ **Enviar petición de prueba**
Ir a `http://localhost:3000` → Formulario público "Petición de Oración"
```
Nombre: [Tu nombre o "Test"]
Petición: [Cualquier texto de prueba, por ejemplo "Esta es una prueba del sistema"]
```
Enviar formulario.

### 4️⃣ **Verificar que llegó a la BD**
```bash
# En otro terminal, acceder a Prisma Studio:
cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\web
npx prisma studio
# Ir a http://localhost:5555 → prayerRequest → debe tener el nuevo registro
```

### 5️⃣ **Verificar que llegó el email**
- Correo: `peticiones@suplenitud.com`
- Esperar máximo 2 minutos
- Verificar bandeja de entrada en MailCow

### 6️⃣ **Verificar que llegó Telegram**
- Bot: `@Multisolucioneslv_bot`
- Debe recibir un mensaje de la petición de oración en tu chat privado
- Esperar máximo 2 minutos

---

## Resultados Esperados

✅ **Todo funciona si:**
1. Petición se guarda en `prayer_requests` en DB
2. Email llega a `peticiones@suplenitud.com`
3. Mensaje de Telegram llega a tu chat privado

❌ **Si algo falla:**
- Revisar logs de Next.js en terminal (`npm run dev`)
- Revisar logs de n8n en VPS (vía SSH)
- Revisar configuración en `workflow.suplenitud.com` panel

---

## Notas Importantes

- **Servidor local (localhost):** No puede alcanzar `workflow.suplenitud.com` directamente si no hay VPN/Proxy
- **Opción 1:** Hacer prueba con servidor en VPSFT o en producción
- **Opción 2:** Usar ZeroTier/VPN local si está disponible

**¿En dónde haremos la prueba?**
- ¿Localhost (desarrollo local)?
- ¿En el VPS demo.suplenitud.com?
- ¿En producción suplenitud.com?

Confirma y procedemos.
