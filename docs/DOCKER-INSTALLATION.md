# Docker Installation - Windows 10/11

**Fecha:** Oct 19, 2026  
**Sistema:** Windows 10 Pro / Windows 11

---

## Opción 1: Docker Desktop (Recomendado)

### Descarga e Instalación

1. Ir a https://www.docker.com/products/docker-desktop
2. Descargar "Docker Desktop for Windows"
3. Ejecutar instalador `.exe`
4. Aceptar términos
5. Esperar instalación (10-15 minutos)

### Habilitación de WSL 2 (Windows Subsystem for Linux)

Docker Desktop requiere WSL 2:

```powershell
# Ejecutar PowerShell como Admin
wsl --install

# Reiniciar Windows
Restart-Computer

# Verificar WSL 2
wsl --list --verbose
```

### Verificar Instalación

```bash
docker --version
docker run hello-world
```

---

## Opción 2: Instalar Docker sin Docker Desktop

```powershell
# Con Chocolatey
choco install docker

# O con Windows Package Manager
winget install docker.cli
```

---

## Configuración Post-Instalación

### Habilitar Docker Daemon

```powershell
# Iniciar servicio Docker
Start-Service docker

# Verificar que está corriendo
Get-Service docker
```

### Agregar Usuario Actual a Grupo Docker

```powershell
# Ejecutar como Admin
$user = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
New-LocalGroup -Name docker -Description "Docker users" -ErrorAction Ignore
Add-LocalGroupMember -Group docker -Member $user -ErrorAction Ignore

# Cerrar sesión y volver a iniciar
```

---

## Verificación Rápida

```bash
# Listar imágenes
docker images

# Ver contenedores
docker ps -a

# Información del sistema
docker info
```

---

## Troubleshooting

### "WSL 2 not installed"

```powershell
# Actualizar kernel WSL 2
wsl --update

# O instalar manualmente desde:
# https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package
```

### "Docker daemon is not running"

```powershell
# Iniciar Docker Desktop manualmente
# O desde línea de comandos:
Start-Service docker
```

### "Cannot connect to Docker daemon"

```bash
# Verificar que Docker está corriendo
docker ps

# Si falla, reiniciar Docker
# Desde Docker Desktop: Settings > Troubleshoot > Restart Docker
```

---

## Siguiente Paso

Una vez instalado Docker:

```bash
cd C:\ProgramandoconClaude\Proyectos\enProceso\ipec_v2_clean\strapi-cms
docker compose up -d
```

---

**Más información:** https://docs.docker.com/desktop/install/windows-install/
