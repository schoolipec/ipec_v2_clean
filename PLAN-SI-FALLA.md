# Plan B — Si v2.suplenitud.com NO carga después de compilar
**Ejecutar SOLO si después de 3 minutos aún hay 404**

---

## PASO 1: Verificar estado real en VPS

```bash
ssh -i "C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519" -o IdentitiesOnly=yes root@179.236.255.48

cd /opt/suplenitud-v2
docker compose logs ipec-v2 | grep -E "Ready|error|Error|failed" | tail -20
```

¿Qué dice?

- Si dice "Ready in...": El servidor está UP. Ir a **PASO 2**.
- Si hay errores: Copiar los errores y parar aquí. Necesitamos diagnosticar.
- Si no dice nada: Esperar más, aún compilando.

---

## PASO 2: Si dice "Ready", pero aún hay 404

El servidor está corriendo pero Traefik no lo enruta.

```bash
# Verificar que Traefik ve el contenedor
curl -H "Host: v2.suplenitud.com" http://localhost/

# Si aún 404, reiniciar Traefik
docker compose restart traefik

# Luego recarga en navegador
```

---

## PASO 3: Si todo falla

**Limpiar y reclonear desde cero:**

```bash
cd /opt
docker compose -f suplenitud-v2/docker-compose.yml down
rm -rf suplenitud-v2/web suplenitud-v2/.next suplenitud-v2/node_modules

# Copiar código limpio desde local
# (Ejecutar desde Windows PowerShell)
scp -i "C:\...\id_ed25519" -r "C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\web" root@179.236.255.48:/opt/suplenitud-v2/

# En VPS:
cd /opt/suplenitud-v2
docker compose up -d --build
docker compose logs -f ipec-v2
```

---

## PASO 4: Nuclear (última opción)

Si nada funciona, borrar TODO y empezar:

```bash
# EN VPS:
cd /opt
rm -rf suplenitud-v2
mkdir suplenitud-v2
cd suplenitud-v2

# Clonar repositorio limpio
git clone https://github.com/schoolipec/ipec_v2_clean.git app

# Copiar configuración
cp app/docker-compose.yml .
cp app/web/package.json web/  # Actualizar si es necesario
cp app/.env ./

# Levantar
docker compose up -d
```

---

**NO HAGAS ESTO MANUALMENTE. Reporta qué dice el comando del PASO 1.**
