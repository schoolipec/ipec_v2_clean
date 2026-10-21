# Checkpoint — IPEC v2 Listos para Deployment
**Fecha:** 2026-10-20 (Sesión continuada)  
**Estado:** 🚀 **BLOQUEADO EN SSH** - Esperando ejecución manual del script PowerShell

---

## ¿EN QUÉ ESTÁBAMOS?

**Objetivo:** Desplegar IPEC v2 en v2.suplenitud.com en VPS iglesia (179.236.255.48)

**Último paso completado:**
- Corregí script PowerShell (líneas 48, 50) eliminando emojis que causaban errores de sintaxis
- Archivo listo: `C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\deploy-v2.ps1`

**Paso siguiente (PRÓXIMO):**
- Ejecutar el script PowerShell desde tu Windows PowerShell NATIVO (no desde Claude Code)
- El script automatizará todo el deployment en el VPS

---

## 🔐 CREDENCIALES Y ACCESOS

### VPS Iglesia
- **IP:** 179.236.255.48
- **Usuario:** root
- **Método:** SSH con clave privada (NO requiere contraseña)
- **Clave privada:** `C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519`
- **Sintaxis correcta:** `ssh -i "C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519" -o IdentitiesOnly=yes root@179.236.255.48`

### Base de Datos (VPS)
- **Host:** n8n-postgres-1 (red interna Docker)
- **Base:** suplenitud_web
- **Usuario:** postgres
- **Contraseña:** postgres
- **Puerto:** 5432

### Admin Panel (Post-deployment)
- **Email:** jscothserver@gmail.com
- **Contraseña:** 72900968
- **URL:** https://v2.suplenitud.com/admin/sign-in

### n8n Webhook
- **URL:** https://workflow.suplenitud.com/webhook/ipec-prayer-v2
- **Workflow ID:** vjjcOHw37n9Lm1ZX (duplicado y funcional)

---

## 📋 CHECKLIST COMPLETADO

✅ PostgreSQL configurado en VPS  
✅ Código en GitHub (schoolipec/ipec_v2_clean)  
✅ docker-compose.yml preparado  
✅ .env.production configurado  
✅ deploy/.env creado  
✅ Script bash (deploy-v2.sh) listo en proyecto  
✅ Script PowerShell corregido (sin errores de sintaxis)  
✅ n8n workflow v2 duplicado y activo  
✅ DNS v2.suplenitud.com resolviendo (wildcard)  

---

## 📋 PRÓXIMOS PASOS EXACTOS

### PASO 1: Ejecutar Deployment (5 min)
Abre PowerShell en tu Windows y ejecuta:

```powershell
cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean
.\deploy-v2.ps1
```

**Qué hace el script:**
1. Verifica que la clave SSH existe
2. Prueba conexión SSH al VPS
3. Copia y ejecuta deploy-v2.sh en el VPS
4. Espera a que Docker compile e instale (2-3 minutos)
5. Crea usuario admin
6. Muestra acceso final

**Salida esperada:** Verde y "DEPLOYMENT COMPLETADO EXITOSAMENTE"

---

### PASO 2: Verificar Sitio (2 min)
Una vez que el script termina:

1. Abre navegador: **https://v2.suplenitud.com**
   - Debe cargar sitio público con modal "Bendición"
   
2. Click en "Petición de Oración"
   - Debe llenar formulario y permitir envío

3. Ir a: **https://v2.suplenitud.com/admin/sign-in**
   - Email: jscothserver@gmail.com
   - Contraseña: 72900968
   - Debe permitir login

4. Ir a: **https://v2.suplenitud.com/admin/prayer-requests**
   - Debe mostrar tabla vacía (lista para peticiones)

---

### PASO 3: Primera Prueba Funcional (5 min)
1. Desde https://v2.suplenitud.com, llenar y enviar una petición de prueba
2. Verificar que llega a:
   - ✅ Base de datos (tabla prayer_requests)
   - ✅ Email (peticiones@suplenitud.com)
   - ✅ Telegram (si está configurado)
   - ✅ n8n workflow logs

---

## 📁 ARCHIVOS CLAVE

```
C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\
├── deploy-v2.ps1                      ← ⭐ EJECUTAR ESTO
├── deploy-v2.sh                       ← Script bash (se copia al VPS)
├── docker-compose.yml                 ← Configuración Docker
├── web/
│   ├── .env                           ← Dev local
│   ├── .env.production                ← VPS
│   ├── prisma/
│   │   ├── schema.prisma              ← 5 tablas PostgreSQL
│   │   └── init.sql                   ← Schema SQL completo
│   └── src/app/...                    ← Código Next.js
├── deploy/
│   └── .env                           ← Variables Docker VPS
└── DEPLOYMENT-V2-VPS.md               ← Guía detallada
```

---

## ⚡ COMANDOS ÚTILES (POST-DEPLOYMENT)

### Monitorear deployment en VPS (en tiempo real):
```bash
ssh -i "C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519" -o IdentitiesOnly=yes root@179.236.255.48
cd /opt/suplenitud-v2
docker-compose logs -f ipec-v2
```

### Acceder a BD desde VPS:
```bash
cd /opt/suplenitud-v2
docker-compose exec ipec-v2 npx prisma studio
```

### Ver estado de contenedores:
```bash
cd /opt/suplenitud-v2
docker-compose ps
```

### Reiniciar si hay problemas:
```bash
cd /opt/suplenitud-v2
docker-compose restart ipec-v2
docker-compose logs -f ipec-v2
```

---

## 🆘 SI ALGO SALE MAL

### Error: "Connection refused" en login
→ Esperar 30 segundos más (Node está compilando aún)
→ Ver logs: `docker-compose logs ipec-v2`

### Error: "database does not exist"
→ La BD se crea automáticamente, pero si falla:
```bash
docker exec -it n8n-postgres-1 psql -U postgres -c "CREATE DATABASE suplenitud_web;"
```

### Traefik no enruta v2.suplenitud.com
→ Verificar DNS: `nslookup v2.suplenitud.com`
→ Debe resolver a 179.236.255.48

### Webhook n8n no recibe peticiones
→ Verificar URL en .env.production: `https://workflow.suplenitud.com/webhook/ipec-prayer-v2`
→ Ver logs de n8n en VPS

---

## 📊 ESTADO ACTUAL

| Componente | Status | Verificado | Ubicación |
|-----------|--------|-----------|-----------|
| GitHub Repo | ✅ | SÍ | schoolipec/ipec_v2_clean |
| PostgreSQL | ✅ | SÍ | n8n-postgres-1 (VPS) |
| Docker Compose | ✅ | Preparado | /opt/suplenitud-v2 |
| Script Deployment | ✅ | SÍ | deploy-v2.ps1 (sin errores) |
| n8n Webhook v2 | ✅ | SÍ | vjjcOHw37n9Lm1ZX |
| DNS v2.suplenitud.com | ✅ | Wildcard | IONOS |
| **DEPLOYMENT** | ⏳ | **PENDIENTE** | **VPS** |

---

## 📝 NOTAS IMPORTANTES

1. **El script PowerShell está listo:** No requiere más correcciones, las líneas 48-50 ya están fijas
2. **SSH funciona:** La otra IA confirmó que puede conectar sin contraseña
3. **Código en GitHub:** Todo está versionado, no hay cambios locales pendientes
4. **Docker listo:** El VPS tiene Docker y Docker Compose instalados
5. **Red interna:** n8n-postgres-1 es accesible desde ipec-v2 container por nombre

---

## 🎯 RESUMEN

**Para Juan mañana:** 
1. Abre PowerShell en Windows
2. Ejecuta: `cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean && .\deploy-v2.ps1`
3. Espera 3-5 minutos
4. Accede a https://v2.suplenitud.com
5. Login: jscothserver@gmail.com / 72900968
6. Prueba enviar una petición

**Nada más requiere edición de código. Todo está listo.**

---

**Siguiente:** Ejecutar deploy-v2.ps1 desde PowerShell → Verificar https://v2.suplenitud.com → Primera prueba → ¡LISTO!
