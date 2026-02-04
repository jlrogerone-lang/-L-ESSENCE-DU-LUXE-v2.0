# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║           AutoDeploy.ps1 - L'ESSENCE DU LUXE v2.0 - MAESTRO SCRIPT           ║
# ║                    PowerShell Automation Framework                           ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# VARIABLES GLOBALES
$ProjectRoot = (Get-Item $PSScriptRoot).Parent.FullName
$ProjectName = "L'Essence du Luxe"
$Version = "2.0.0"
$ProjectDir = (Get-Location).Path

# COLORES PARA CONSOLE
$Colors = @{
    Success = "Green"
    Error = "Red"
    Warning = "Yellow"
    Info = "Cyan"
    Header = "Magenta"
}

# ════════════════════════════════════════════════════════════════════════════════
# FUNCIONES AUXILIARES
# ════════════════════════════════════════════════════════════════════════════════

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor $Colors.Header
    Write-Host "║ $Text" -ForegroundColor $Colors.Header
    Write-Host "╚════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor $Colors.Header
    Write-Host ""
}

function Write-Success {
    param([string]$Text)
    Write-Host "✅ $Text" -ForegroundColor $Colors.Success
}

function Write-Error-Custom {
    param([string]$Text)
    Write-Host "❌ $Text" -ForegroundColor $Colors.Error
}

function Write-Warning-Custom {
    param([string]$Text)
    Write-Host "⚠️  $Text" -ForegroundColor $Colors.Warning
}

function Write-Info {
    param([string]$Text)
    Write-Host "ℹ️  $Text" -ForegroundColor $Colors.Info
}

function Test-CommandExists {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

function Test-NodeVersion {
    if (Test-CommandExists "node") {
        $Version = & node --version
        if ($Version -match "v(\d+)") {
            $MajorVersion = [int]$matches[1]
            if ($MajorVersion -lt 18) {
                Write-Warning-Custom "Node.js v$Version detectado. Se requiere v18+. Actualiza en https://nodejs.org/"
                return $false
            }
            Write-Success "Node.js v$Version OK"
            return $true
        }
    }
    return $false
}

function Test-ProjectStructure {
    $RequiredFiles = @("app.json", "package.json", "tsconfig.json", "babel.config.js")
    $MissingFiles = @()
    
    foreach ($file in $RequiredFiles) {
        if (-not (Test-Path "$ProjectDir\$file")) {
            $MissingFiles += $file
        }
    }
    
    if ($MissingFiles.Count -gt 0) {
        Write-Warning-Custom "Archivos faltantes: $($MissingFiles -join ', ')"
        return $false
    }
    
    Write-Success "Estructura de proyecto verificada"
    return $true
}

# ════════════════════════════════════════════════════════════════════════════════
# OPCIONES DEL MENÚ
# ════════════════════════════════════════════════════════════════════════════════

function Show-Menu {
    Write-Header "🏛️ $ProjectName v$Version - MENU PRINCIPAL"
    
    Write-Host "Selecciona una opción:" -ForegroundColor White
    Write-Host ""
    Write-Host "  [1] 📦 Instalar dependencias (npm install)" -ForegroundColor Cyan
    Write-Host "  [2] 🧹 Limpiar caché Metro + node_modules" -ForegroundColor Cyan
    Write-Host "  [3] 🚀 Iniciar desarrollo (expo start -c)" -ForegroundColor Cyan
    Write-Host "  [4] 🤖 Compilar APK (testing)" -ForegroundColor Cyan
    Write-Host "  [5] 📱 Compilar AAB (Play Store)" -ForegroundColor Cyan
    Write-Host "  [6] 📂 Ver estructura del proyecto (tree)" -ForegroundColor Cyan
    Write-Host "  [7] 🔑 Configurar variables de entorno (.env)" -ForegroundColor Cyan
    Write-Host "  [8] 🔍 Verificar dependencias críticas" -ForegroundColor Cyan
    Write-Host "  [9] 📋 Ver requisitos del sistema" -ForegroundColor Cyan
    Write-Host "  [0] ❌ Salir" -ForegroundColor Red
    Write-Host ""
}

# ════════════════════════════════════════════════════════════════════════════════
# OPCIÓN 1: INSTALAR DEPENDENCIAS
# ════════════════════════════════════════════════════════════════════════════════

function Install-Dependencies {
    Write-Header "📦 INSTALAR DEPENDENCIAS"
    
    if (-not (Test-ProjectStructure)) {
        Write-Error-Custom "Estructura de proyecto incompleta"
        return
    }
    
    Write-Info "Instalando dependencias npm..."
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "npm install completado"
        
        Write-Info "Instalando paquetes Expo..."
        npx expo install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Instalación completada exitosamente"
            Write-Info "Próximo paso: npm run start (opción 3)"
        } else {
            Write-Error-Custom "Error en expo install"
        }
    } else {
        Write-Error-Custom "Error en npm install"
    }
    
    Read-Host "Presiona Enter para volver al menú"
}

# ════════════════════════════════════════════════════════════════════════════════
# OPCIÓN 2: LIMPIAR CACHÉ
# ════════════════════════════════════════════════════════════════════════════════

function Clean-Project {
    Write-Header "🧹 LIMPIAR CACHÉ Y ARCHIVOS TEMPORALES"
    
    $Confirm = Read-Host "¿Eliminar node_modules, .expo y caché de Metro? (s/n)"
    if ($Confirm -eq "s" -or $Confirm -eq "S") {
        Write-Info "Eliminando node_modules..."
        Remove-Item -Path "$ProjectDir\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        
        Write-Info "Eliminando .expo..."
        Remove-Item -Path "$ProjectDir\.expo" -Recurse -Force -ErrorAction SilentlyContinue
        
        Write-Info "Limpiando caché npm..."
        npm cache clean --force
        
        Write-Success "Limpieza completada"
        Write-Warning-Custom "Ejecuta opción [1] para reinstalar"
    }
    
    Read-Host "Presiona Enter para volver al menú"
}

# ════════════════════════════════════════════════════════════════════════════════
# OPCIÓN 3: INICIAR DESARROLLO
# ════════════════════════════════════════════════════════════════════════════════

function Start-Development {
    Write-Header "🚀 INICIAR DESARROLLO (Expo)"
    
    Write-Info "Iniciando servidor Expo..."
    Write-Info "Presiona 'a' para abrir en Android emulator"
    Write-Info "Presiona 'i' para abrir en iOS simulator"
    Write-Info "Escanea QR con Expo Go para dispositivo físico"
    Write-Host ""
    
    npx expo start -c
}

# ════════════════════════════════════════════════════════════════════════════════
# OPCIÓN 4: COMPILAR APK (Testing)
# ════════════════════════════════════════════════════════════════════════════════

function Build-APK {
    Write-Header "🤖 COMPILAR APK PARA TESTING"
    
    Write-Info "Compilando APK con EAS Build..."
    Write-Warning-Custom "Esto requiere EAS CLI configurado"
    Write-Info "Ver: https://eas.expo.dev/"
    Write-Host ""
    
    eas build --platform android --presigned
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "APK compilado correctamente"
        Write-Info "Descárgalo desde EAS Dashboard"
    }
    
    Read-Host "Presiona Enter para volver al menú"
}

# ════════════════════════════════════════════════════════════════════════════════
# OPCIÓN 5: COMPILAR AAB (Play Store)
# ════════════════════════════════════════════════════════════════════════════════

function Build-AAB {
    Write-Header "📱 COMPILAR AAB PARA GOOGLE PLAY STORE"
    
    Write-Info "Compilando Android App Bundle..."
    Write-Warning-Custom "Este archivo es para Google Play Console"
    Write-Host ""
    
    eas build --platform android --release
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "AAB compilado correctamente"
        Write-Info "Sube a Google Play Console: https://play.google.com/console/"
    }
    
    Read-Host "Presiona Enter para volver al menú"
}

# ════════════════════════════════════════════════════════════════════════════════
# OPCIÓN 6: VER ESTRUCTURA
# ════════════════════════════════════════════════════════════════════════════════

function Show-ProjectStructure {
    Write-Header "📂 ESTRUCTURA DEL PROYECTO"
    
    if (Test-CommandExists "tree") {
        tree /L
    } else {
        Write-Warning-Custom "Comando 'tree' no disponible. Mostrando contenido con dir /s"
        Get-ChildItem -Path $ProjectDir -Recurse | Select-Object -First 50 | Format-Table -Property FullName
    }
    
    Read-Host "Presiona Enter para volver al menú"
}

# ════════════════════════════════════════════════════════════════════════════════
# OPCIÓN 7: CONFIGURAR .env
# ════════════════════════════════════════════════════════════════════════════════

function Configure-Env {
    Write-Header "🔑 CONFIGURAR VARIABLES DE ENTORNO (.env.local)"
    
    $EnvFile = "$ProjectDir\.env.local"
    
    Write-Info "Se abrirá la plantilla de variables de entorno"
    Write-Host ""
    
    $EnvTemplate = @"
# ════════════════════════════════════════════════════════════════════════════════
# FIREBASE CONFIGURATION
# ════════════════════════════════════════════════════════════════════════════════
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# ════════════════════════════════════════════════════════════════════════════════
# GOOGLE OAUTH (Google Sign-In)
# ════════════════════════════════════════════════════════════════════════════════
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# ════════════════════════════════════════════════════════════════════════════════
# REVENUECAT (Monetización)
# ════════════════════════════════════════════════════════════════════════════════
EXPO_PUBLIC_REVENUECAT_API_KEY=appl_xxxxxxxxxxxxxxxxxx

# ════════════════════════════════════════════════════════════════════════════════
# ADMOB (Publicidad)
# ════════════════════════════════════════════════════════════════════════════════
EXPO_PUBLIC_ADMOB_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx
EXPO_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-3940256099942544/6300978111
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID=ca-app-pub-3940256099942544/1033173712

# ════════════════════════════════════════════════════════════════════════════════
# GOOGLE CUSTOM SEARCH (Bibliothèque Universelle)
# ════════════════════════════════════════════════════════════════════════════════
EXPO_PUBLIC_GOOGLE_SEARCH_API_KEY=your_google_search_api_key
EXPO_PUBLIC_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# ════════════════════════════════════════════════════════════════════════════════
# ENVIRONMENT
# ════════════════════════════════════════════════════════════════════════════════
NODE_ENV=production
"@

    # Crear archivo si no existe
    if (-not (Test-Path $EnvFile)) {
        Set-Content -Path $EnvFile -Value $EnvTemplate
        Write-Success ".env.local creado en: $EnvFile"
    } else {
        Write-Info ".env.local ya existe en: $EnvFile"
    }
    
    Write-Host ""
    Write-Info "Abriendo archivo para editar..."
    notepad $EnvFile
    
    Read-Host "Presiona Enter para volver al menú"
}

# ════════════════════════════════════════════════════════════════════════════════
# OPCIÓN 8: VERIFICAR DEPENDENCIAS
# ════════════════════════════════════════════════════════════════════════════════

function Verify-Dependencies {
    Write-Header "🔍 VERIFICAR DEPENDENCIAS CRÍTICAS"
    
    $Dependencies = @(
        @{ Name = "Node.js"; Command = "node"; MinVersion = 18 },
        @{ Name = "npm"; Command = "npm"; MinVersion = 9 },
        @{ Name = "Expo CLI"; Command = "expo"; MinVersion = 0 },
        @{ Name = "EAS CLI"; Command = "eas"; MinVersion = 0 }
    )
    
    foreach ($dep in $Dependencies) {
        if (Test-CommandExists $dep.Command) {
            $Version = & $dep.Command --version
            Write-Success "$($dep.Name): $Version"
        } else {
            Write-Error-Custom "$($dep.Name): NO INSTALADO"
            Write-Warning-Custom "Instala desde https://nodejs.org/"
        }
    }
    
    Write-Host ""
    Write-Info "Verificando archivos de proyecto..."
    Test-ProjectStructure | Out-Null
    
    Read-Host "Presiona Enter para volver al menú"
}

# ════════════════════════════════════════════════════════════════════════════════
# OPCIÓN 9: REQUISITOS DEL SISTEMA
# ════════════════════════════════════════════════════════════════════════════════

function Show-Requirements {
    Write-Header "📋 REQUISITOS DEL SISTEMA"
    
    Write-Host "HARDWARE MÍNIMO:" -ForegroundColor Yellow
    Write-Host "  • CPU: Intel i5 / AMD Ryzen 5 o superior"
    Write-Host "  • RAM: 8 GB (16 GB recomendado)"
    Write-Host "  • Almacenamiento: 10 GB libres"
    Write-Host "  • Conexión: Internet estable"
    Write-Host ""
    
    Write-Host "SOFTWARE REQUERIDO:" -ForegroundColor Yellow
    Write-Host "  • Windows 10/11, macOS 10.15+, o Linux (Ubuntu 18.04+)"
    Write-Host "  • Node.js v18.0.0 o superior"
    Write-Host "  • npm v9.0.0 o superior"
    Write-Host "  • Android SDK (para compilar APK/AAB)"
    Write-Host "  • Git (opcional, para control de versiones)"
    Write-Host ""
    
    Write-Host "CUENTAS REQUERIDAS (GRATUITAS):" -ForegroundColor Yellow
    Write-Host "  • Google Cloud Account (Firebase Auth)"
    Write-Host "  • Google Play Console ($25 pago único)"
    Write-Host "  • Expo Account (gratuita)"
    Write-Host "  • RevenueCat Account (gratuita)"
    Write-Host "  • Google AdMob Account (gratuita)"
    Write-Host ""
    
    Write-Host "PUERTOS NECESARIOS:" -ForegroundColor Yellow
    Write-Host "  • 19000-19001 (Expo Server)"
    Write-Host "  • 5555 (Android Debug Bridge)"
    Write-Host "  • 8081 (Metro Bundler)"
    Write-Host ""
    
    Read-Host "Presiona Enter para volver al menú"
}

# ════════════════════════════════════════════════════════════════════════════════
# LOOP PRINCIPAL
# ════════════════════════════════════════════════════════════════════════════════

function Main {
    $ExitScript = $false
    
    while (-not $ExitScript) {
        Show-Menu
        $Choice = Read-Host "Selecciona una opción (0-9)"
        
        switch ($Choice) {
            "1" { Install-Dependencies }
            "2" { Clean-Project }
            "3" { Start-Development }
            "4" { Build-APK }
            "5" { Build-AAB }
            "6" { Show-ProjectStructure }
            "7" { Configure-Env }
            "8" { Verify-Dependencies }
            "9" { Show-Requirements }
            "0" {
                Write-Host ""
                Write-Success "¡Hasta luego! Recuerda: 'npm run start' para desarrollo"
                $ExitScript = $true
            }
            default {
                Write-Error-Custom "Opción no válida. Intenta de nuevo."
            }
        }
        
        if (-not $ExitScript -and $Choice -ne "0") {
            Write-Host ""
        }
    }
}

# ════════════════════════════════════════════════════════════════════════════════
# EJECUTAR
# ════════════════════════════════════════════════════════════════════════════════

# Verificar ejecución como administrador (recomendado pero no obligatorio)
$IsAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $IsAdmin) {
    Write-Warning-Custom "Se recomienda ejecutar como Administrador"
}

# Iniciar menú principal
Main
