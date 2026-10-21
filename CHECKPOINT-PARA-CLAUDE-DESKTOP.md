# IPEC v2 — Estado Actual para Claude Desktop
**Fecha:** 2026-10-21  
**Usuario:** Juan (principios de Alzheimer - instrucciones CLARAS y EXACTAS)  
**Estado:** DEPLOYMENT PARCIAL - REQUIERE DIAGNÓSTICO SIN MODIFICACIONES

---

## ¿QUÉ ESTAMOS HACIENDO?

Desplegar IPEC v2 (panel admin iglesia) en VPS en dominio **v2.suplenitud.com**

---

## ¿DÓNDE ESTAMOS AHORA?

### EN EL VPS (179.236.255.48):

```
/opt/suplenitud-v2/
├── app/                    ← Código clonado de GitHub (COMPLETO)
│   ├── web/                ← Proyecto Next.js (aquí está el código real)
│   ├── strapi-cms/
│   ├── admin/
│   └── ... (otros directorios)
├── docker-compose.yml      ← Configurado (monta ./web:/app)
├── .env                    ← Variables cargadas correctamente
└── deploy/                 ← Carpeta de support
```

### CONTENEDOR:
- **Nombre:** ipec-v2-nextjs
- **Estado:** Restarting (fallando)
- **Error:** `/app/package.json` no encontrado
- **Razón:** El contenedor NO ve el código en `/app`

### RED:
- ✅ `n8n-internal` EXISTE
- ✅ PostgreSQL accesible en `n8n-postgres-1:5432`

---

## ¿QUÉ FUNCIONA?

✅ GitHub clonado correctamente  
✅ Docker Compose instalado (v5.6.0)  
✅ Red `n8n-internal` existe  
✅ Variables de entorno `.env` cargadas  
✅ SSH funciona  

---

## ¿QUÉ NO FUNCIONA?

❌ Contenedor falla al iniciar  
❌ `npm install` no encuentra `package.json`  
❌ `/app` dentro del contenedor está VACÍO  
❌ v2.suplenitud.com devuelve 404  

---

## ¿POR QUÉ FALLA?

**HIPÓTESIS:** El volumen `./web:/app` no se está montando correctamente en el contenedor.

**VERIFICACIÓN NECESARIA (SIN MODIFICAR NADA):**

1. Detener el contenedor:
```bash
cd /opt/suplenitud-v2
docker compose down
```

2. Verificar que los archivos están EN EL VPS:
```bash
ls -la /opt/suplenitud-v2/web/
```
(Debe mostrar: package.json, src/, next.config.js, etc.)

3. Verificar que docker-compose.yml es CORRECTO:
```bash
cat /opt/suplenitud-v2/docker-compose.yml | grep -A 5 "volumes:"
```
(Debe mostrar: `- ./web:/app`)

4. Si ambos checkeos pasan, ENTONCES reiniciar:
```bash
docker compose up -d
docker compose logs -f ipec-v2
```

---

## REGLAS DE ORO (PARA NO ENSUCIAR)

🚫 **NO CREAR CARPETAS/ARCHIVOS en /opt/suplenitud-v2** si ya existen  
🚫 **NO EDITAR docker-compose.yml** sin verificar primero  
🚫 **NO EJECUTAR COMANDOS DESTRUCTIVOS** (rm, reset, etc.)  
✅ **SÍ:** Verificar estructura y diagnosticar  
✅ **SÍ:** Mostrar logs completos antes de cualquier cambio  
✅ **SÍ:** Preguntar qué cambiar y por qué  

---

## SIGUIENTE PASO EXACTO

**Para Claude Desktop:**

1. Conectarse al VPS:
```bash
ssh -i "C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519" -o IdentitiesOnly=yes root@179.236.255.48
```

2. Ejecutar los 4 checkeos de arriba (SIN MODIFICAR NADA)

3. Reportar QUÉ VES en cada verificación

4. SI TODO PASA: Reiniciar contenedor y esperar 3 min

5. SI ALGO FALLA: Mostrar error exacto y pausar (preguntar a Juan antes de cambiar)

---

## CREDENCIALES (CUANDO SEA NECESARIO)

**Admin Panel (DESPUÉS de que funcione):**
- Email: jscothserver@gmail.com
- Contraseña: 72900968

**n8n Webhook:**
- URL: https://workflow.suplenitud.com/webhook/ipec-prayer-v2
- ID: vjjcOHw37n9Lm1ZX

**PostgreSQL (en VPS):**
- Host: n8n-postgres-1
- BD: suplenitud_web
- Usuario: postgres
- Contraseña: postgres

---

## DOCUMENTACIÓN REFERENCIA

- `/opt/suplenitud-v2/DEPLOYMENT-V2-VPS.md` (en VPS)
- `C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\DEPLOYMENT-V2-VPS.md` (en Windows)
- `C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\CHECKPOINT-FINAL-2026-10-20.md` (historial)

---

## RESUMEN PARA JUAN

**¿En qué estábamos?**
- Deployando IPEC v2 en VPS
- El código se copió correctamente
- El contenedor intenta levantar pero falla

**¿Dónde nos quedamos?**
- Verificando POR QUÉ falla el contenedor
- Sin hacer cambios aún

**¿Qué falta?**
1. Diagnosticar la razón exacta del error
2. Aplicar el fix (si es simple)
3. Verificar que v2.suplenitud.com responde
4. Primera prueba de petición de oración
5. Migrar a suplenitud.com (producción)

---

**INSTRUCCIÓN FINAL:** Ejecuta los 4 checkeos. Reporta EXACTAMENTE qué ves. No hagas nada más.
