#!/bin/bash

# Script de deployment automatico para v2.suplenitud.com
# Uso: ssh -i clave.pem root@179.236.255.48 'bash -s' < deploy-v2.sh

set -e  # Salir si hay error

echo "[INICIO] Iniciando deployment de v2.suplenitud.com..."

# 1. Crear directorio
mkdir -p /opt/suplenitud-v2
cd /opt/suplenitud-v2

# 2. Clonar desde GitHub (o pull si ya existe)
if [ -d "app/.git" ]; then
  echo "[OK] Repositorio existe, actualizando..."
  cd app
  git pull origin main
  cd ..
else
  echo "[CLONE] Clonando repositorio..."
  git clone https://github.com/schoolipec/ipec_v2_clean.git app
fi

# 3. Copiar docker-compose.yml
echo "[CONFIG] Configurando Docker Compose..."
cp app/docker-compose.yml .

# 4. Crear deploy/.env si no existe
if [ ! -f "deploy/.env" ]; then
  echo "[ENV] Creando deploy/.env..."
  mkdir -p deploy
  cat > deploy/.env << 'EOF'
POSTGRES_PASSWORD=postgres
N8N_PRAYER_WEBHOOK_URL=https://workflow.suplenitud.com/webhook/ipec-prayer-v2
TELEGRAM_BOT_TOKEN=8039543299:AAFjgtEMWJ9itLiJzkJ0DDkJvbuEm5pF6ak
PRAYER_EMAIL_INBOX=peticiones@suplenitud.com
MAILCOW_PASSWORD=<CONFIGURAR_EN_VPS>
EOF
  echo "[WARN] Editar deploy/.env con contraseña MailCow real"
fi

# 5. Levantar contenedor
echo "[DOCKER] Levantando contenedor Docker..."
docker-compose up -d

# 6. Esperar a que este listo
echo "[WAIT] Esperando a que el contenedor este listo (2-3 min)..."
sleep 10

# Monitorear estado
for i in {1..30}; do
  if docker-compose ps | grep -q "healthy"; then
    echo "[OK] Contenedor saludable"
    break
  fi
  echo "[...] Esperando... ($i/30)"
  sleep 5
done

# 7. Crear usuario admin
echo "[ADMIN] Creando usuario admin..."
docker-compose exec -T ipec-v2 npm run admin:bootstrap || echo "[WARN] Usuario admin podria ya existir"

# 8. Resumen
echo ""
echo "[SUCCESS] DEPLOYMENT COMPLETADO"
echo ""
echo "[INFO] Accesos:"
echo "   Sitio publico:    https://v2.suplenitud.com/"
echo "   Panel admin:      https://v2.suplenitud.com/admin/sign-in"
echo "   Email usuario:    jscothserver@gmail.com"
echo "   Password:         72900968"
echo ""
echo "[STATUS] Estado de contenedores:"
docker-compose ps
echo ""
echo "[LOGS] Para ver logs en tiempo real:"
echo "   docker-compose logs -f ipec-v2"
echo ""
echo "[UPDATE] Para actualizar codigo:"
echo "   cd /opt/suplenitud-v2/app && git pull && cd .. && docker-compose up -d --build"
