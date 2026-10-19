# Script para iniciar Docker Desktop y Strapi
# Ejecutar como: powershell -ExecutionPolicy Bypass -File start-docker.ps1

Write-Host "=== Iniciando Docker Desktop ===" -ForegroundColor Cyan

# Intentar iniciar Docker Desktop
$dockerPath = "C:\Program Files\Docker\Docker\Docker.exe"

if (Test-Path $dockerPath) {
    Write-Host "Encontrado Docker Desktop en: $dockerPath" -ForegroundColor Green
    & $dockerPath
    Write-Host "Docker Desktop iniciando..." -ForegroundColor Yellow
    Write-Host "Espera 30-60 segundos para que Docker esté listo..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
} else {
    Write-Host "Docker Desktop no encontrado en ubicación esperada" -ForegroundColor Red
    Write-Host "Intenta iniciar Docker Desktop manualmente desde: Inicio > Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Intentar acceder a Docker
$maxAttempts = 60
$attempt = 0

Write-Host "`nEsperando que Docker esté disponible..." -ForegroundColor Yellow

while ($attempt -lt $maxAttempts) {
    try {
        $result = docker ps 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Docker está listo" -ForegroundColor Green
            break
        }
    } catch {}

    $attempt++
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 1
}

if ($attempt -eq $maxAttempts) {
    Write-Host "`n✗ Docker no respondió después de 60 segundos" -ForegroundColor Red
    Write-Host "Intenta iniciar Docker Desktop manualmente y luego ejecuta:" -ForegroundColor Yellow
    Write-Host "cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\strapi-cms" -ForegroundColor Yellow
    Write-Host "docker compose up -d" -ForegroundColor Yellow
    exit 1
}

# Levantar Strapi
Write-Host "`n=== Levantando Strapi ===" -ForegroundColor Cyan
cd "C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\strapi-cms"

Write-Host "Ejecutando: docker compose up -d" -ForegroundColor Yellow
docker compose up -d

Start-Sleep -Seconds 3

Write-Host "`n=== Estado de Contenedores ===" -ForegroundColor Cyan
docker compose ps

Write-Host "`n=== Esperando que Strapi responda ===" -ForegroundColor Yellow
$maxAttempts = 45
$attempt = 0
$strapiReady = $false

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:1337/admin/login" -ErrorAction Stop -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            $strapiReady = $true
            Write-Host "`n✓ Strapi está listo" -ForegroundColor Green
            break
        }
    } catch {}

    $attempt++
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 1
}

if ($strapiReady) {
    Write-Host "`n" -ForegroundColor Green
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  ✓ STRAPI LISTO PARA USAR                             ║" -ForegroundColor Green
    Write-Host "║                                                        ║" -ForegroundColor Green
    Write-Host "║  URL: http://localhost:1337/admin                     ║" -ForegroundColor Green
    Write-Host "║                                                        ║" -ForegroundColor Green
    Write-Host "║  Email: jscothserver@gmail.com                        ║" -ForegroundColor Green
    Write-Host "║  Password: 72900968                                   ║" -ForegroundColor Green
    Write-Host "║                                                        ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
} else {
    Write-Host "`n✗ Strapi no respondió después de 45 segundos" -ForegroundColor Yellow
    Write-Host "Revisar logs:" -ForegroundColor Yellow
    Write-Host "docker compose logs strapi" -ForegroundColor Yellow
}
