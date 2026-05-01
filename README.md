# 👼 Bautizo de Liam

Web de invitación para el bautizo de Liam con selección de menú.

## ✨ Características

- 🎨 Diseño elegante con efectos 3D (globos, confetti, nubes)
- 🌍 Bilingüe: Español 🇪🇸 y Rumano 🇷🇴
- 🍽️ Selección de menú (Rapito del Cantábrico o Entrecot)
- 📊 Guardado de respuestas en Google Sheets
- 📱 Responsive (móvil y escritorio)

## 🛠️ Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS
- Three.js / React Three Fiber (efectos 3D)
- Framer Motion (animaciones)
- Google Apps Script (almacenamiento)

## 🚀 Ejecutar localmente

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 📦 Desplegar en Vercel

1. Conecta tu repo de GitHub a Vercel
2. Añade la variable de entorno:
   - `VITE_GOOGLE_SCRIPT_URL` = URL de tu Google Apps Script
3. Deploy automático con cada push a `main`

## 🔧 Configurar Google Sheets

1. Crea una hoja de cálculo en Google Sheets
2. Ve a Extensiones → Apps Script
3. Pega este código:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.platoName,
    data.observations
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Implementar → Nueva implementación → Aplicación web
5. Ejecutar como: Yo | Quién tiene acceso: **Cualquier persona**
6. Copia la URL y añádela a `.env` o Vercel

## 📅 Evento

- **Fecha:** 14 de Junio de 2026
- **Lugar:** Parroquia El Salvador

---

Hecho con ❤️ para Liam
