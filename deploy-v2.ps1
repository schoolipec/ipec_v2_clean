# Script de Deployment v2.suplenitud.com
# Ejecutar desde PowerShell

$VPS_IP = "179.236.255.48"
$SSH_KEY = "C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519"
$SCRIPT_PATH = "C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\deploy-v2.sh"

Write-Host "[INICIO] Iniciando deployment a v2.suplenitud.com..." -ForegroundColor Green
Write-Host ""

# 1. Verificar que la clave SSH existe
if (-not (Test-Path $SSH_KEY)) {
    Write-Host "[ERROR] Clave SSH no encontrada: $SSH_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Clave SSH encontrada" -ForegroundColor Green

# 2. Verificar conectividad
Write-Host "[TEST] Verificando conexion al VPS..." -ForegroundColor Yellow
$test = ssh -i $SSH_KEY root@$VPS_IP "echo ok" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Conexion exitosa" -ForegroundColor Green
} else {
    Write-Host "[ERROR] No se puede conectar al VPS" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[EXEC] Ejecutando script de deployment en VPS..." -ForegroundColor Yellow
Write-Host ""

# 3. Copiar script al VPS primero, luego ejecutar (evita problemas de CRLF)
Write-Host "[COPY] Copiando script al VPS..." -ForegroundColor Yellow
scp -i $SSH_KEY $SCRIPT_PATH "root@${VPS_IP}:/tmp/deploy-v2.sh"

Write-Host "[BASH] Ejecutando script en el VPS..." -ForegroundColor Yellow
ssh -i $SSH_KEY root@${VPS_IP} "bash /tmp/deploy-v2.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[SUCCESS] DEPLOYMENT COMPLETADO EXITOSAMENTE" -ForegroundColor Green
    Write-Host ""
    Write-Host "[INFO] Proximos pasos:" -ForegroundColor Cyan
    Write-Host "   1. Acceder a https://v2.suplenitud.com"
    Write-Host "   2. Hacer login con jscothserver@gmail.com / 72900968"
    Write-Host "   3. Enviar peticion de prueba desde formulario publico"
    Write-Host "   4. Verificar que llegue a BD, Email y Telegram"
    Write-Host ""
    Write-Host "[INFO] Monitorear en tiempo real:" -ForegroundColor Cyan
    Write-Host "   ssh -i `"$SSH_KEY`" root@$VPS_IP"
    Write-Host "   cd /opt/suplenitud-v2"
    Write-Host "   docker-compose logs -f ipec-v2"
} else {
    Write-Host "[ERROR] Error en el deployment" -ForegroundColor Red
    exit 1
}
