# 🏛️ L'ESSENCE DU LUXE v2.0 - INICIO RÁPIDO

## 🚀 INSTALACIÓN EN 5 MINUTOS

### PASO 1: Clonar e Instalar
```bash
cd /ruta/del/proyecto
npm install
npx expo install
```

### PASO 2: Configurar Variables de Entorno
```bash
# Copiar plantilla
cp .env.local.example .env.local

# Editar con tus credenciales
nano .env.local
```

**Variables CRÍTICAS que necesitas:**
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID` (Firebase Console)
- `EXPO_PUBLIC_GOOGLE_CLIENT_ID` (Google Cloud Console)
- `EXPO_PUBLIC_REVENUECAT_API_KEY` (RevenueCat Dashboard)
- `EXPO_PUBLIC_ADMOB_APP_ID` (Google AdMob)

### PASO 3: Iniciar Desarrollo
```bash
# Opción A: En terminal
npx expo start -c

# Opción B: Con PowerShell
.\AutoDeploy.ps1
# Seleccionar opción [3] "Iniciar desarrollo"
```

### PASO 4: Abrir en Dispositivo
- **Android/iOS Emulator:** Presiona `a` o `i` en terminal
- **Físico:** Escanea QR con app Expo Go
- **Web:** Presiona `w`

---

## 📋 REQUISITOS PREVIOS

✅ Node.js v18+  
✅ npm v9+  
✅ Expo CLI: `npm install -g expo-cli`  
✅ Android SDK/Emulator (opcional)  
✅ Xcode (si es Mac)  

---

## 🔐 CONFIGURACIÓN FIREBASE (SIN COSTE)

### 1. Crear Proyecto
1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Click "Crear Proyecto"
3. Nombre: `essence-du-luxe`
4. Desabilitar Google Analytics
5. Click "Crear"

### 2. Habilitar Autenticación
1. **Build > Authentication**
2. Click "Empezar"
3. **Sign-in method > Google**
4. Habilitar + Guardar
5. **Sign-in method > Email/Password**
6. Habilitar + Guardar

### 3. Crear Realtime Database
1. **Build > Realtime Database**
2. Click "Crear Database"
3. Región: Europe (eur3)
4. **Modo seguridad: Prueba** (para dev)
5. Click "Habilitar"

### 4. Obtener Credenciales
1. **Project Settings** (⚙️ arriba a la derecha)
2. **SDK setup and configuration**
3. Copiar objeto Firebase Config
4. Pegaren `.env.local`:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
...
```

---

## 🔑 CONFIGURACIÓN GOOGLE SIGN-IN (SIN COSTE)

### 1. Crear Credenciales OAuth
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services > Credentials**
3. Click "Create Credentials" > "OAuth 2.0 Client ID"
4. Tipo: **Web**
5. Nombre: `EssenceDuLuxe Web`
6. Autorized JavaScript origins: `http://localhost:*`
7. Click Create
8. Copiar `Client ID` → `.env.local` (`EXPO_PUBLIC_GOOGLE_CLIENT_ID`)

### 2. Crear Credenciales Android
1. **+ Create Credentials > OAuth 2.0 Client ID**
2. Tipo: **Android**
3. Nombre: `EssenceDuLuxe Android`
4. Package name: `com.essenceduluxe.perfumerie`
5. SHA-1: Generar con `keytool` (ver sección Build)
6. Click Create
7. Copiar ID → `.env.local` (`EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`)

---

## 💳 CONFIGURACIÓN REVENUECAT (GRATIS)

1. Ir a [RevenueCat Dashboard](https://dashboard.revenuecat.com/)
2. Sign up / Login
3. **Projects > Create Project**
4. Nombre: `EssenceDuLuxe`
5. Seleccionar **Android + iOS**
6. Click Create
7. En **API Keys**, copiar `API Key` (la pública)
8. Pegar en `.env.local`:
```
EXPO_PUBLIC_REVENUECAT_API_KEY=appl_xxxxxxxxxx
```

### Configurar Planes en RevenueCat
1. **Products > Create New**
2. Nombre: `alquimist_monthly`
3. Precio: €4.99
4. Duration: Monthly
5. Crear producto
6. Repetir para `master_monthly` (€9.99)
7. **Entitlements > Create**
   - `alquimist_access`
   - `master_access`
   - `premium_features`

---

## 📱 CONFIGURACIÓN ADMOB (GRATIS)

1. Ir a [Google AdMob](https://admob.google.com/)
2. Sign in con tu Google Account
3. **Apps > Add app**
4. Plataforma: **Android** + **iOS**
5. Nombre: `EssenceDuLuxe`
6. Copiar **App ID** → `.env.local` (`EXPO_PUBLIC_ADMOB_APP_ID`)
7. **Ad units > Create ad unit**
   - Tipo: Banner (por defecto)
   - Nombre: `banner_atelier`
   - Copiar ID → `.env.local` (`EXPO_PUBLIC_ADMOB_BANNER_ID`)
8. Crear más ad units para Interstitial y Rewarded

---

## 🔍 CONFIGURACIÓN GOOGLE CUSTOM SEARCH (100 búsquedas/día GRATIS)

1. Ir a [Google Custom Search Engine](https://cse.google.com/)
2. Click **"Create"**
3. Nombre: `PerfumesSearch`
4. Sites to search: `fragrantica.com`, `perfumediary.com`
5. Click **Create**
6. Ir a **Setup**
7. Copiar **Search engine ID** → `.env.local` (`EXPO_PUBLIC_GOOGLE_SEARCH_ENGINE_ID`)
8. Ir a [Google Cloud Console > APIs & Services > Credentials](https://console.cloud.google.com/)
9. **+ Create Credentials > API Key**
10. Copiar API Key → `.env.local` (`EXPO_PUBLIC_GOOGLE_SEARCH_API_KEY`)

---

## ✅ VERIFICAR CONFIGURACIÓN

```bash
# Ejecutar script de verificación
npm run check-setup

# Debería ver:
# ✅ Firebase: CONFIGURED
# ✅ Google Sign-In: CONFIGURED
# ✅ RevenueCat: CONFIGURED
# ✅ AdMob: CONFIGURED
# ✅ All dependencies: INSTALLED
```

---

## 🚀 COMPILAR PARA PLAY STORE (10 MINUTOS)

```bash
# 1. Generar keystore (PRIMERA VEZ SOLO)
keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias

# 2. Compilar APK
npx eas build --platform android

# 3. (Opcional) Compilar AAB para Play Store
npx eas build --platform android --release

# 4. Descargar desde EAS Dashboard
```

---

## 🐛 TROUBLESHOOTING

### Error: "Firebase not initialized"
```
Solución: Verificar .env.local contiene EXPO_PUBLIC_FIREBASE_*
```

### Error: "Google Sign-In failed"
```
Solución: Verificar EXPO_PUBLIC_GOOGLE_CLIENT_ID en .env.local
```

### Error: "Can't find module"
```
Solución: npm install && npx expo install
```

### Metro Bundler hanging
```
Solución: npx expo start -c (flag -c limpia caché)
```

---

## 📚 DOCUMENTACIÓN COMPLETA

Ver archivos:
- `SETUP_MANUAL_COMPLETO.md` - Configuración detallada
- `ARQUITECTURA_CARPETAS.txt` - Estructura del proyecto
- `RESUMEN_EJECUTIVO_ARQUITECTO.txt` - Golden Rule explicada

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Instalar dependencias
2. ✅ Configurar Firebase
3. ✅ Configurar Google Sign-In
4. ✅ Configurar RevenueCat
5. ✅ Configurar AdMob
6. ✅ Ejecutar `npm start`
7. ✅ Probar en Expo Go
8. ✅ Compilar APK cuando esté listo

---

## 💡 TIPS

- Usa `AutoDeploy.ps1` para automatizar tareas
- Modo **Gris** (do not disturb): Sin anuncios mientras desarrollas
- Guarda en `.env.local` NUNCA en `.env`
- Cada cambio en .env requiere restart: `Ctrl+C` + `npx expo start -c`

---

¡**LISTO PARA PRODUCCIÓN!** 🚀✨

Preguntas? Consulta el Manual del Arquitecto: `MANUAL_ARQUITECTO.md`
