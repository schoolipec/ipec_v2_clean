# Deployment v2.suplenitud.com en VPS

**Fecha:** 2026-10-20  
**Entorno:** Hostinger VPS (179.236.255.48)  
**Estado:** LISTO PARA DESPLEGAR

---

## ✅ REQUISITOS PREVIOS

- [x] PostgreSQL corriendo en n8n-postgres-1
- [x] Traefik configurado y corriendo
- [x] Dominio v2.suplenitud.com resolviendo a 179.236.255.48
- [x] n8n workflow v2 creado (ID: vjjcOHw37n9Lm1ZX)
- [x] Docker y Docker Compose instalados en VPS

---

## 📋 PASO 1: Preparar el VPS

### 1a. Conectarse al VPS

```bash
ssh -i C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519 root@179.236.255.48
```

### 1b. Crear directorio para v2

```bash
mkdir -p /opt/suplenitud-v2/app
cd /opt/suplenitud-v2
```

---

## 📦 PASO 2: Copiar Código Local al VPS

### Desde tu PC (PowerShell):

```powershell
# Copiar todo el proyecto web
scp -r -i "C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519" `
  "C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\web" `
  root@179.236.255.48:/opt/suplenitud-v2/app/

# Copiar docker-compose.yml
scp -i "C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519" `
  "C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\docker-compose.yml" `
  root@179.236.255.48:/opt/suplenitud-v2/

# Copiar deploy/.env
scp -i "C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519" `
  "C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\deploy\.env" `
  root@179.236.255.48:/opt/suplenitud-v2/
```

---

## 🔧 PASO 3: Configurar Variables en VPS

### En el VPS (SSH):

```bash
cd /opt/suplenitud-v2

# Editar deploy/.env y configurar MAILCOW_PASSWORD
nano deploy/.env

# Cambiar:
# MAILCOW_PASSWORD=<CONFIGURAR_EN_VPS>
# Por la contraseña real de MailCow (en /opt/mailcow-dockerized)
```

---

## 🚀 PASO 4: Iniciar Contenedor

### En el VPS:

```bash
cd /opt/suplenitud-v2

# Levantar contenedor (primera vez compila y corre migraciones)
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f ipec-v2

# Verificar que está corriendo
docker ps -f name=ipec-v2
```

**Esperar:** ~2-3 minutos para que termine npm install + build

---

## ✅ PASO 5: Verificar Deployment

### Accesos:

```
Sitio público:       https://v2.suplenitud.com/
Panel admin:         https://v2.suplenitud.com/admin/sign-in
Prisma Studio:       https://v2.suplenitud.com/api/studio (¡NO EXPUESTO en prod!)
```

### Verificaciones:

```bash
# 1. Verificar que el contenedor está saludable
docker-compose ps

# 2. Ver logs
docker-compose logs ipec-v2 | tail -50

# 3. Probar conexión a BD desde contenedor
docker-compose exec ipec-v2 npx prisma db execute --stdin < /dev/null

# 4. Verificar que Traefik enrutó correctamente
curl -H "Host: v2.suplenitud.com" http://localhost/admin/sign-in
```

---

## 🔐 PASO 6: Crear Usuario Admin en VPS

### En el VPS:

```bash
cd /opt/suplenitud-v2/app

# Bootstrap admin (usa variables de .env.production)
docker-compose exec ipec-v2 npm run admin:bootstrap

# Si necesitas otro usuario:
docker-compose exec ipec-v2 npm run admin:bootstrap
```

---

## 🧪 PASO 7: Primera Prueba

### 1. Acceder a https://v2.suplenitud.com/admin/sign-in
- Email: jscothserver@gmail.com
- Password: 72900968

### 2. Ver tabla de peticiones en admin panel
- Ir a `/admin/prayer-requests`
- Debe estar vacía

### 3. Enviar petición de prueba desde formulario público
- Ir a https://v2.suplenitud.com
- Llenar formulario "Petición de Oración"
- Enviar

### 4. Verificar flujo
- [ ] Petición aparece en BD (Prisma Studio o admin panel)
- [ ] Email llega a peticiones@suplenitud.com
- [ ] Telegram notificación llega a tu chat (si está configurado)
- [ ] n8n recibió webhook (revisar logs de n8n)

---

## 🔄 PASO 8: Actualizar Código Futuro

```bash
cd /opt/suplenitud-v2

# 1. Bajar cambios desde git/local
git pull  # Si está bajo control de versión
# O copiar código nuevamente con scp

# 2. Reconstruir contenedor
docker-compose up -d --build

# 3. Aplicar migraciones (si hay nuevas)
docker-compose exec ipec-v2 npm run db:migrate

# 4. Ver logs
docker-compose logs -f ipec-v2
```

---

## 🆘 TROUBLESHOOTING

### Error: "database "suplenitud_web" does not exist"
```bash
# Crear BD en PostgreSQL del VPS
docker exec -it n8n-postgres-1 psql -U postgres -c "CREATE DATABASE suplenitud_web;"
```

### Error: "Connection refused" a PostgreSQL
- Verificar que `n8n-internal` network existe y está correcta
- Verificar credenciales en deploy/.env

### Contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs ipec-v2

# Reiniciar
docker-compose restart ipec-v2
```

### Traefik no enruta a v2.suplenitud.com
- Verificar que v2.suplenitud.com resuelve a 179.236.255.48
- Verificar labels en docker-compose.yml
- Reiniciar Traefik: `docker-compose restart traefik`

---

## 📝 Notas Importantes

1. **Base de datos compartida:** Usa la misma BD `suplenitud_web` que el resto (n8n, etc.)
2. **Webhook n8n:** Debe apuntar a `ipec-prayer-v2` (duplicado en n8n)
3. **SSL:** Traefik auto-genera con Let's Encrypt
4. **DNS:** Wildcard ya está configurado en IONOS (`A * → 179.236.255.48`)

---

## ✅ CHECKLIST FINAL

- [ ] DNS resuelve v2.suplenitud.com
- [ ] Código copiado al VPS
- [ ] deploy/.env configurado con contraseñas reales
- [ ] docker-compose up -d ejecutado
- [ ] Contenedor en estado "healthy"
- [ ] Usuario admin creado
- [ ] https://v2.suplenitud.com carga
- [ ] Login funciona
- [ ] Petición de prueba enviada y llega a todo el flujo
