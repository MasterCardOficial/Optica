# 📚 Documentación Técnica - Integración Google Sheets

## Arquitectura del Sistema

### Flujo de Datos

```
┌─────────────────┐
│  Navegador Web  │
│  (Frontend)     │
└────────┬────────┘
         │
         │ fetch() POST/GET
         ▼
┌─────────────────────────┐
│ Google Apps Script      │
│ (Backend/API)           │
│ - doPost(): Guardar     │
│ - doGet(): Consultar    │
└────────┬────────────────┘
         │
         │ SpreadsheetApp API
         ▼
┌─────────────────────────┐
│   Google Sheets         │
│   (Base de Datos)       │
│   Tabla: Citas          │
└─────────────────────────┘
```

---

## Componentes del Sistema

### 1. Frontend (JavaScript)

#### `api-config.js`
Archivo de configuración centralizado.

```javascript
const API_CONFIG = {
  SHEETS_API_URL: 'https://script.google.com/macros/s/.../exec',
  TIMEOUT: 10000,
  DEV_MODE: false  // true = localStorage, false = Google Sheets
};
```

**Propósito**: Separar configuración del código para facilitar cambios de entorno.

#### `appointments.js`
Maneja el formulario de agendar citas.

**Funciones principales:**

- `saveAppointment()` (async)
  - Crea objeto appointment
  - Si `API_URL` y `!DEV_MODE`: POST a Google Sheets
  - Fallback: `saveToLocalStorage()`
  - Siempre guarda backup en localStorage

```javascript
async function saveAppointment() {
  const appointment = { /* datos */ };
  
  if (API_URL && !DEV_MODE) {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',  // Google requiere no-cors
      body: JSON.stringify(appointment)
    });
  }
  
  saveToLocalStorage(appointment);  // Backup
}
```

#### `consultar-citas.js`
Maneja la consulta de citas por cédula.

**Funciones principales:**

- `searchAppointments(documentType, documentNumber)` (async)
  - Si `API_URL` y `!DEV_MODE`: GET de Google Sheets
  - URL: `${API_URL}?cedula=${documentNumber}`
  - Fallback: `searchInLocalStorage()`
  - Devuelve array de citas ordenadas por fecha

- `createAppointmentCard(appointment)`
  - Compara `appointmentDateTime` con `now`
  - Si pasada: badge "⏱️ Cita Vencida"
  - Si futura: badge "🔔 Próxima Cita"
  - Oculta recomendaciones en citas pasadas

---

### 2. Backend (Google Apps Script)

#### `citas-api.gs`
API RESTful simple con dos endpoints.

**Endpoint 1: doPost(e)** - Guardar cita

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Citas');
  
  sheet.appendRow([
    timestamp,
    data.id,
    data.appointmentNumber,
    data.personalInfo.fullName,
    // ... otros campos
  ]);
  
  return JSON.stringify({ success: true });
}
```

**Parámetros POST:**
- Body: JSON con estructura de appointment (ver abajo)

**Respuesta:**
```json
{
  "success": true,
  "message": "Cita guardada exitosamente",
  "appointmentNumber": "SURT-1234567890123"
}
```

**Endpoint 2: doGet(e)** - Consultar citas

```javascript
function doGet(e) {
  const cedula = e.parameter.cedula;
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Citas');
  
  // Filtrar rows por cédula (columna F)
  const appointments = rows.filter(row => row[5] === cedula);
  
  // Ordenar por fecha DESC
  appointments.sort((a, b) => b.dateObject - a.dateObject);
  
  return JSON.stringify({ success: true, appointments });
}
```

**Parámetros GET:**
- `?cedula=1234567890`

**Respuesta:**
```json
{
  "success": true,
  "count": 2,
  "appointments": [
    { /* appointment 1 */ },
    { /* appointment 2 */ }
  ]
}
```

---

## Estructura de Datos

### Objeto Appointment (JavaScript)

```javascript
{
  id: 1699999999999,  // Date.now()
  appointmentNumber: "SURT-1699999999999",
  
  personalInfo: {
    fullName: "Juan Pérez García",
    documentType: "CC",
    documentNumber: "1234567890",
    email: "juan@example.com",
    phone: "3001234567"
  },
  
  service: {
    id: "examen-visual",
    name: "Examen Visual Completo",
    duration: "30-45 minutos",
    price: "Desde $50.000"
  },
  
  medicalInfo: {
    hasCurrentGlasses: true,
    hasContactLenses: false,
    hasEyeConditions: "Miopía",
    medications: "Ninguno",
    allergies: ""
  },
  
  date: {
    day: 15,
    month: 11,  // 0-indexed (0 = Enero, 11 = Diciembre)
    year: 2024,
    dateObj: Date
  },
  
  time: "10:00 AM",
  status: "confirmada",  // "confirmada", "cancelada", "completada"
  createdAt: "2024-11-15T10:00:00.000Z"  // ISO string
}
```

### Fila en Google Sheets

| A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 15/11/2024 10:00 | 1699999999999 | SURT-1699999999999 | Juan Pérez García | CC | 1234567890 | juan@example.com | 3001234567 | Examen Visual Completo | 15/11/2024 | 10:00 AM | confirmada | {"hasCurrentGlasses":true,...} | 2024-11-15T10:00:00.000Z |

**Nota**: `medicalInfo` se guarda como JSON serializado.

---

## Seguridad

### 🔒 Consideraciones Actuales

1. **No hay autenticación**: Cualquiera con la URL puede acceder
2. **Datos sensibles**: Cédulas, emails y teléfonos son visibles
3. **CORS abierto**: Cualquier sitio puede hacer requests

### 🛡️ Mejoras Recomendadas para Producción

#### Opción 1: API Key Simple
```javascript
// En api-config.js
const API_CONFIG = {
  SHEETS_API_URL: 'https://...',
  API_KEY: 'tu-clave-secreta-aqui'
};

// En appointments.js y consultar-citas.js
await fetch(API_URL, {
  headers: {
    'X-API-Key': API_CONFIG.API_KEY
  }
});

// En citas-api.gs
function doPost(e) {
  const apiKey = e.parameter.apiKey || e.postData.params?.apiKey;
  if (apiKey !== 'tu-clave-secreta-aqui') {
    return JSON.stringify({ success: false, message: 'Unauthorized' });
  }
  // ... resto del código
}
```

#### Opción 2: OAuth 2.0
Usar autenticación de Google para verificar usuarios.

#### Opción 3: Backend Real
Migrar a Node.js/Express + PostgreSQL/MongoDB para control total.

---

## Limitaciones de Google Apps Script

| Límite | Valor |
|--------|-------|
| Ejecuciones por día | 20,000 |
| Tiempo de ejecución | 6 min/script |
| Tamaño de respuesta | 10 MB |
| Requests simultáneos | ~30 |

**Estimación**: Para una óptica con 50 citas/día:
- 50 POST (guardar) + 50 GET (consultar) = 100 requests/día
- 200x menos del límite diario ✅

---

## Modos de Operación

### Modo Desarrollo (`DEV_MODE: true`)

**Comportamiento:**
- ❌ NO usa Google Sheets
- ✅ Guarda en localStorage
- ✅ Lee de localStorage
- 🎯 Útil para: Desarrollo local sin internet

**Cuándo usar:**
- Desarrollo inicial
- Testing sin afectar producción
- Demostración offline

### Modo Producción (`DEV_MODE: false`)

**Comportamiento:**
- ✅ Usa Google Sheets
- ✅ Guarda backup en localStorage
- 🔄 Fallback a localStorage en errores
- 🎯 Útil para: Sitio en vivo

**Cuándo usar:**
- Sitio web productivo
- Múltiples dispositivos/usuarios
- Persistencia real de datos

---

## Manejo de Errores

### Frontend (appointments.js & consultar-citas.js)

```javascript
try {
  const response = await fetch(API_URL, { /* ... */ });
  console.log('✅ Operación exitosa');
} catch (error) {
  console.error('❌ Error:', error);
  console.log('💾 Usando fallback localStorage');
  // Continúa con localStorage
}
```

**Errores comunes:**
- Network timeout
- CORS issues
- Apps Script no disponible
- Límites de cuota alcanzados

**Estrategia**: Siempre hay fallback a localStorage para no perder datos.

### Backend (citas-api.gs)

```javascript
try {
  // Operación con SpreadsheetApp
} catch (error) {
  return JSON.stringify({
    success: false,
    message: 'Error al guardar la cita',
    error: error.toString()
  });
}
```

---

## Testing

### Función de Prueba Incluida

En `citas-api.gs` hay una función `testEndpoint()`:

```javascript
function testEndpoint() {
  const testData = { /* cita de prueba */ };
  
  // Simular POST
  const postResult = doPost({ postData: { contents: JSON.stringify(testData) } });
  Logger.log(postResult.getContent());
  
  // Simular GET
  const getResult = doGet({ parameter: { cedula: '1234567890' } });
  Logger.log(getResult.getContent());
}
```

**Cómo usar:**
1. Apps Script > Seleccionar función: `testEndpoint`
2. Clic en **Ejecutar** ▶️
3. Ver resultados en **Registros de ejecución**

---

## Monitoreo y Logs

### Frontend
Abre Consola del navegador (F12) y busca:

```
📤 Guardando cita en Google Sheets...
✅ Cita guardada en Google Sheets
💾 Cita guardada en localStorage: { ... }
```

```
📤 Consultando Google Sheets...
✅ Encontradas 2 citas en Google Sheets
📋 Citas encontradas: 2
```

### Backend
Apps Script > **Ejecuciones** (icono de reloj):

- Ver historial de ejecuciones
- Tiempo de ejecución
- Errores si los hay
- Logs con `Logger.log()`

---

## Migración de Datos

### De localStorage a Google Sheets

Si ya tienes citas en localStorage y quieres migrarlas:

```javascript
// Ejecutar en Consola del navegador
(async function migrateToSheets() {
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  
  for (const apt of appointments) {
    await fetch(API_CONFIG.SHEETS_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apt)
    });
    
    console.log(`✅ Migrada cita ${apt.appointmentNumber}`);
    await new Promise(r => setTimeout(r, 1000));  // Esperar 1s entre requests
  }
  
  console.log('🎉 Migración completada');
})();
```

---

## Actualización del Sistema

### Cambiar URL de Apps Script

1. Editar `assets/js/config/api-config.js`:
   ```javascript
   SHEETS_API_URL: 'nueva-url-aqui'
   ```

2. Guardar y **limpiar caché** del navegador:
   - Chrome/Edge: `Ctrl+Shift+Delete`
   - Seleccionar "Imágenes y archivos en caché"
   - Recargar: `Ctrl+Shift+R`

### Agregar Nuevos Campos

1. **Google Sheet**: Agregar columna (ej: "O: Dirección")
2. **Apps Script**: Modificar `doPost()` para incluir nuevo campo
3. **Frontend**: Agregar campo al objeto `appointment`
4. Reimplementar Apps Script (nueva versión)

---

## Preguntas Frecuentes

**P: ¿Por qué `mode: 'no-cors'` en POST pero `mode: 'cors'` en GET?**

R: Google Apps Script maneja POST con `no-cors` (limitación de Google). GET funciona con CORS normal porque Apps Script devuelve headers correctos.

**P: ¿Cuánto tiempo tarda guardar una cita?**

R: Típicamente 1-3 segundos. Depende de latencia de red y carga de Google.

**P: ¿Qué pasa si dos personas agendan al mismo tiempo?**

R: Google Sheets maneja concurrencia automáticamente. Ambas filas se insertarán correctamente.

**P: ¿Puedo ver quién modificó una cita?**

R: Sí. En Google Sheets: Clic derecho en celda > **Mostrar historial de edición**.

**P: ¿Cómo exporto los datos?**

R: Google Sheets > **Archivo** > **Descargar** > Formato (Excel, CSV, PDF).

---

## Contacto y Soporte

Para problemas técnicos específicos, revisar:
1. Consola del navegador (frontend)
2. Logs de Apps Script (backend)
3. Este documento de solución de problemas

---

## Changelog

### v1.0 (2024-11-15)
- ✅ Integración inicial con Google Sheets
- ✅ POST para guardar citas
- ✅ GET para consultar por cédula
- ✅ Indicador de citas vencidas
- ✅ Fallback a localStorage
- ✅ Modo desarrollo/producción
