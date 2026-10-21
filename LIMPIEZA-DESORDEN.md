# Limpieza de Desorden — IPEC v2
**Fecha:** 2026-10-21  
**Objetivo:** Limpiar lo que se acumuló sin propósito durante el diagnóstico

---

## ¿QUÉ DESORDEN CREAMOS?

### EN WINDOWS LOCAL:

1. **Scripts PowerShell múltiples (algunos con errores previos):**
   - ✅ `deploy-v2.ps1` - CORRECTO, GUARDAR
   - ❌ `conectar-vps.ps1` - Útil pero NO es parte del proyecto, MOVER
   - ❌ `conectar-vps.bat` - Útil pero NO es parte del proyecto, MOVER

2. **Archivos bash convertidos varias veces:**
   - ✅ `deploy-v2.sh` - CORRECTO, GUARDAR

3. **Múltiples checkpoints (históricos, confusos):**
   - ❌ `CHECKPOINT-FINAL-2026-10-20.md` - VIEJO, ELIMINAR
   - ❌ `CHECKPOINT-MIGRACION-COMPLETADA.md` - VIEJO, ELIMINAR
   - ❌ `CHECKPOINT-2026-10-20-FINAL.md` - DUPLICADO, ELIMINAR
   - ✅ `CHECKPOINT-PARA-CLAUDE-DESKTOP.md` - ACTUAL, GUARDAR

---

## INSTRUCCIONES DE LIMPIEZA (PARA CLAUDE DESKTOP)

### PASO 1: Mover scripts de conexión SSH
Esos scripts son ÚTILES pero deben estar en la carpeta de CLAVES SSH, no en el proyecto:

```bash
# Estos ya existen en C:\ProgramandoconClaude\Proyectos\claves_ssh\
# No hay nada que mover, pero verificar que están allá:
ls C:\ProgramandoconClaude\Proyectos\claves_ssh\
```

Los scripts `conectar-vps.ps1` y `conectar-vps.bat` **YA están en el lugar correcto**.

### PASO 2: Eliminar checkpoints viejos

**NO BORRAR SIN CONFIRMAR A JUAN PRIMERO**, pero la lista de archivos a eliminar es:

```
C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\
├── CHECKPOINT-FINAL-2026-10-20.md           ← ELIMINAR
├── CHECKPOINT-MIGRACION-COMPLETADA.md       ← ELIMINAR
└── CHECKPOINT-2026-10-20-FINAL.md           ← ELIMINAR
```

**Comandos (ejecutar SOLO si Juan confirma):**
```powershell
cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\
rm CHECKPOINT-FINAL-2026-10-20.md
rm CHECKPOINT-MIGRACION-COMPLETADA.md
rm CHECKPOINT-2026-10-20-FINAL.md
```

### PASO 3: Guardar en Git

Después de limpiar, hacer commit:

```bash
cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\
git status
git add -A
git commit -m "Limpieza: remover checkpoints duplicados y obsoletos"
git push
```

---

## QUÉ GUARDAR (SIN TOCAR)

✅ `deploy-v2.ps1` - Script principal de deployment  
✅ `deploy-v2.sh` - Script bash para VPS  
✅ `docker-compose.yml` - Configuración Docker  
✅ `CHECKPOINT-PARA-CLAUDE-DESKTOP.md` - Documento actual  
✅ `LIMPIEZA-DESORDEN.md` - Este archivo  
✅ `/web` - Código Next.js  
✅ `/strapi-cms` - CMS  
✅ Todos los archivos `.md` de DOCUMENTACIÓN (DEPLOYMENT-V2-VPS.md, ACCESO-VPS-IGLESIA.md, etc.)

---

## EN EL VPS (179.236.255.48)

✅ `/opt/suplenitud-v2/` - Necesario, NO TOCAR  
✅ `/opt/suplenitud-v2/app/` - Código clonado, NO ELIMINAR  
✅ `/opt/suplenitud-v2/docker-compose.yml` - Configuración, NO MODIFICAR sin diagnóstico  
✅ `/opt/suplenitud-v2/.env` - Variables, NECESARIO  
⚠️ `/opt/suplenitud-v2/deploy/` - Soporte, PUEDE LIMPIARSE DESPUÉS si no se usa

---

## RESUMEN PARA CLAUDE DESKTOP

**Después de diagnosticar y arreglar el error del contenedor:**

1. ✅ Verificar que todo funciona
2. ⚠️ **LUEGO (NO ANTES)**: Preguntar a Juan si desea limpiar checkpoints viejos
3. ✅ Si Juan dice sí: Eliminar archivos listados arriba
4. ✅ Hacer commit limpio
5. ✅ LISTO

---

## IMPORTANTE

🚨 **NO LIMPIAR NADA HASTA QUE IPEC v2 ESTÉ FUNCIONANDO EN v2.suplenitud.com**

La limpieza es ÚLTIMIDLO paso, después de:
1. Diagnosticar el error del contenedor
2. Aplicar el fix
3. Verificar que https://v2.suplenitud.com responde
4. Hacer primera prueba de petición de oración

---

**Prioridad:** DIAGNÓSTICO + FIX > LIMPIEZA

**No hacer:** Limpiar en medio del proceso, eso añade riesgo.
