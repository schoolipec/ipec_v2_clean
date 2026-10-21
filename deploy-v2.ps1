# Script de Deployment v2.suplenitud.com
# Ejecutar desde PowerShell

$VPS_IP = "179.236.255.48"
$SSH_KEY = "C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519"
$SCRIPT_PATH = "C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\deploy-v2.sh"

Write-Host "🚀 Iniciando deployment a v2.suplenitud.com..." -ForegroundColor Green
Write-Host ""

# 1. Verificar que la clave SSH existe
if (-not (Test-Path $SSH_KEY)) {
    Write-Host "❌ Clave SSH no encontrada: $SSH_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Clave SSH encontrada" -ForegroundColor Green

# 2. Verificar conectividad
Write-Host "🔗 Verificando conexión al VPS..." -ForegroundColor Yellow
$test = ssh -i $SSH_KEY root@$VPS_IP "echo ok" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Conexión exitosa" -ForegroundColor Green
} else {
    Write-Host "❌ No se puede conectar al VPS" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Ejecutando script de deployment en VPS..." -ForegroundColor Yellow
Write-Host ""

# 3. Ejecutar script bash en el VPS
Get-Content $SCRIPT_PATH | ssh -i $SSH_KEY root@$VPS_IP "bash -s"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅✅✅ DEPLOYMENT COMPLETADO EXITOSAMENTE" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "   1. Acceder a https://v2.suplenitud.com"
    Write-Host "   2. Hacer login con jscothserver@gmail.com / 72900968"
    Write-Host "   3. Enviar petición de prueba desde formulario público"
    Write-Host "   4. Verificar que llegue a BD, Email y Telegram"
    Write-Host ""
    Write-Host "📊 Monitorear en tiempo real:"
    Write-Host "   ssh -i $SSH_KEY root@$VPS_IP"
    Write-Host "   cd /opt/suplenitud-v2 && docker-compose logs -f ipec-v2"
} else {
    Write-Host "❌ Error en el deployment" -ForegroundColor Red
    exit 1
}
