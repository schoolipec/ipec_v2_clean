# Instrucción Rápida — Acceso SSH VPS
**Para:** Cualquier sesión de Claude (Code, Desktop, etc.)

---

## TÚ ERES EL ÚNICO QUE PUEDE ACCEDER AL VPS

Si Claude (cualquier versión) necesita ejecutar comandos en el VPS:

1. **Copia este comando exacto a tu PowerShell:**
```powershell
ssh -i "C:\ProgramandoconClaude\Proyectos\claves_ssh\id_ed25519" -o IdentitiesOnly=yes root@179.236.255.48
```

2. **Ejecutalo**

3. **Copiar/pega los comandos que Claude te dice**

4. **Reporta qué ves**

---

## POR QUÉ CLAUDE NO PUEDE CONECTAR

- Claude Code puede, pero está limitado a carpetas específicas
- Claude Desktop NO tiene acceso automático a las claves
- Otros agentes tampoco pueden

**Es seguridad a propósito.** Las claves SSH no deben deambular libremente.

---

## FLUJO CORRECTO

```
Claude → "Necesito que ejecutes esto:"
       ↓
       "ssh -i ... root@179.236.255.48"
       ↓
TÚ → Copias el comando
   ↓
   Lo ejecutas en tu PowerShell
   ↓
   Ves el resultado
   ↓
TÚ → Copias el resultado
   ↓
   Lo pegas en Claude
   ↓
Claude → "Perfecto, ahora ejecuta esto otro:"
```

---

**Documentación completa:** `C:\ProgramandoconClaude\Documentacion\ACCESO-CLAVES-SSH-TODAS-SESIONES.md`
