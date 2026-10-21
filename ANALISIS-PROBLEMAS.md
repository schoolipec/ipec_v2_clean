# Análisis de Problemas — IPEC v2
**Fecha:** 2026-10-21  
**Hora:** 01:06 UTC  

---

## ¿POR QUÉ NO LEVANTA?

### Problema Root Cause

El código en GitHub tiene **incompatibilidades con Next.js 16 + Turbopack**:

1. **Turbopack no soporta `export const runtime = 'nodejs'`** + `cacheComponents`
   - Solución: Remover `export const runtime` de todos los routes

2. **next.config.ts usa loaders de Tailwind que no existen**
   - `@tailwindcss/turbopack` no está disponible
   - Solución: Simplificar next.config.ts, remover turbopack rules

3. **Incompatibilidad de config nativa**
   - `experimental.cacheComponents` → debe ser `cacheComponents`
   - Solución: Actualizar sintaxis

---

## BASURA CREADA (QUE DEBEMOS LIMPIAR)

### En Windows Local:

❌ Múltiples checkpoints históricos (ya NO se usan)
- `CHECKPOINT-FINAL-2026-10-20.md`
- `CHECKPOINT-MIGRACION-COMPLETADA.md`
- `CHECKPOINT-2026-10-20-FINAL.md`

❌ Scripts de debugging/exploración (ya NO se usan):
- Múltiples versiones de `deploy-v2.ps1` (anteriores a la actual)
- Múltiples versiones de `deploy-v2.sh` (antes de fixes CRLF)

✅ GUARDAR (limpios, actualizados):
- `CHECKPOINT-PARA-CLAUDE-DESKTOP.md`
- `LIMPIEZA-DESORDEN.md`
- `deploy-v2.ps1` (versión actual)
- `deploy-v2.sh` (versión actual con LF puro)

---

## CAMBIOS HECHOS HOY (Y QUE RESOLVIERON PROBLEMAS)

✅ Copiar `package.json` correcto al VPS (agregó bcryptjs, nodemailer, prisma)  
✅ Copiar código `web/` a ubicación correcta en VPS  
✅ Remover `export const runtime = 'nodejs'` de rutas  
✅ Simplificar `next.config.ts`  

---

## PRÓXIMO PASO (CUANDO COMPILE)

Si **AÚN HAY ERRORES después de compilar**:

### Opción A: Verificar manualmente
```bash
ssh root@179.236.255.48
cd /opt/suplenitud-v2/web
npm run build  # Ejecutar build manualmente
```

### Opción B: Limpiar cache si persiste
```bash
cd /opt/suplenitud-v2
docker compose down
rm -rf web/node_modules web/.next
docker compose up -d
```

### Opción C: Nuclear (última opción)
```bash
# Borrar TODO en VPS y reclonear limpio
cd /opt
rm -rf suplenitud-v2
mkdir -p suplenitud-v2
cd suplenitud-v2
git clone https://github.com/schoolipec/ipec_v2_clean.git app
cp app/docker-compose.yml .
cp app/deploy/.env .env
docker compose up -d
```

---

## CHECKLIST DE LIMPIEZA LOCAL (DESPUÉS)

- [ ] Eliminar checkpoints viejos (3 archivos)
- [ ] Verificar que `package.json` y `next.config.ts` son la versión correcta
- [ ] Hacer git commit limpio
- [ ] Documentar qué se removió

---

## RESUMEN PARA JUAN

**¿Por qué no levantaba?**  
El código tenía incompatibilidades con Next.js 16 que hicimos cambios poniendo parches por todos lados.

**¿Qué hicimos?**  
1. Remover exports de runtime incompatibles
2. Simplificar next.config.ts
3. Copiar código correcto al VPS

**¿Y si aún no levanta?**  
Opciones A, B o C de arriba (en orden).

**¿Después?**  
Limpiar la basura que creamos hoy.

---

**Estado actual:** Contenedor compilando (01:06 UTC). Esperar 1-2 minutos.
