# 🔗 Integración con Google Sheets - Surtilentes Óptica

Esta guía te ayudará a configurar Google Sheets como base de datos para el sistema de citas de Surtilentes.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Paso 1: Crear Google Sheet](#paso-1-crear-google-sheet)
3. [Paso 2: Configurar Google Apps Script](#paso-2-configurar-google-apps-script)
4. [Paso 3: Obtener URL de Implementación](#paso-3-obtener-url-de-implementación)
5. [Paso 4: Configurar el Sitio Web](#paso-4-configurar-el-sitio-web)
6. [Paso 5: Probar la Integración](#paso-5-probar-la-integración)
7. [Solución de Problemas](#solución-de-problemas)

---

## ✅ Requisitos Previos

- Una cuenta de Google (Gmail)
- Permisos de edición en Google Sheets
- Acceso al código del sitio web de Surtilentes

---

## 📊 Paso 1: Crear Google Sheet

### 1.1 Crear Nueva Hoja de Cálculo

1. Ve a [Google Sheets](https://sheets.google.com)
2. Clic en **"+ Crear"** o **"+ Nueva hoja de cálculo"**
3. Nombra la hoja: **"Surtilentes - Base de Datos Citas"**

### 1.2 Configurar Columnas

Renombra la pestaña a **"Citas"** y crea las siguientes columnas en la **fila 1**:

**IMPORTANTE: Son 22 columnas en total (de A hasta V). Haz scroll horizontal para verlas todas.**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Tipo Documento | Cédula | Número Cita | Nombre Completo | Fecha Nacimiento | Teléfono | Email | Dirección | Ciudad | Servicio | Precio | Duración | Fecha Cita | Hora | Primera Vez | Usa Lentes/Gafas | Tiene Fórmula Anterior | Motivo Principal | Notas Adicionales | Estado | Fecha Creación |

**Detalles de cada columna:**
- **A - Timestamp**: Fecha y hora de registro automática
- **B - Tipo Documento**: CC, TI, CE, Pasaporte, etc.
- **C - Cédula**: Número de documento del paciente
- **D - Número Cita**: Código único de la cita (ej: SURT-1234567890)
- **E - Nombre Completo**: Nombre y apellidos del paciente
- **F - Fecha Nacimiento**: Fecha de nacimiento del paciente
- **G - Teléfono**: Número de contacto (10 dígitos)
- **H - Email**: Correo electrónico
- **I - Dirección**: Dirección de residencia
- **J - Ciudad**: Ciudad de residencia
- **K - Servicio**: Tipo de servicio solicitado
- **L - Precio**: Costo del servicio
- **M - Duración**: Tiempo estimado del servicio
- **N - Fecha Cita**: Día de la cita agendada
- **O - Hora**: Hora de atención (sistema por llegada)
- **P - Primera Vez**: Si/No - ¿Es primera vez en Surtilentes?
- **Q - Usa Lentes/Gafas**: gafas / lentes / ambos / no
- **R - Tiene Fórmula Anterior**: Si/No - ¿Tiene fórmula previa?
- **S - Motivo Principal**: Razón de la visita
- **T - Notas Adicionales**: Síntomas, comentarios del paciente
- **U - Estado**: confirmada / completada / cancelada
- **V - Fecha Creación**: Timestamp de registro en formato ISO

### 1.3 Obtener el ID de la Hoja

1. Copia la URL de tu Google Sheet
2. La URL se verá así:
   ```
   https://docs.google.com/spreadsheets/d/17abc123xyz456_ESTE_ES_EL_ID_789def/edit
   ```
3. El **SHEET_ID** es la parte entre `/d/` y `/edit`
4. En el ejemplo anterior: `17abc123xyz456_ESTE_ES_EL_ID_789def`
5. **Guarda este ID** para el siguiente paso

---

## ⚙️ Paso 2: Configurar Google Apps Script

### 2.1 Abrir Editor de Apps Script

1. En tu Google Sheet, ve a **Extensiones** > **Apps Script**
2. Se abrirá una nueva pestaña con el editor

### 2.2 Copiar el Código

1. **Borra todo el código predeterminado** del editor
2. Abre el archivo `google-apps-script/citas-api.gs` de tu proyecto
3. **Copia todo el contenido** del archivo
4. **Pega el código** en el editor de Apps Script

### 2.3 Configurar el SHEET_ID

1. Busca la línea que dice:
   ```javascript
   const SHEET_ID = 'TU_SHEET_ID_AQUI';
   ```
2. Reemplaza `'TU_SHEET_ID_AQUI'` con el ID que copiaste en el Paso 1.3
3. Ejemplo:
   ```javascript
   const SHEET_ID = '17abc123xyz456_ESTE_ES_EL_ID_789def';
   ```

### 2.4 Guardar el Proyecto

1. Clic en el icono de **disquete** 💾 o `Ctrl+S` / `Cmd+S`
2. Nombra el proyecto: **"API Citas Surtilentes"**

---

## 🌐 Paso 3: Obtener URL de Implementación

### 3.1 Implementar como Aplicación Web

1. En el editor de Apps Script, clic en **"Implementar"** (arriba a la derecha)
2. Selecciona **"Nueva implementación"**

### 3.2 Configurar Permisos

En el diálogo que aparece:

- **Tipo**: Selecciona **"Aplicación web"**
- **Descripción**: "API de Citas v1"
- **Ejecutar como**: **"Yo"** (tu cuenta de Google)
- **Quién tiene acceso**: **"Cualquier persona"** ⚠️ *Importante*

### 3.3 Autorizar Permisos

1. Clic en **"Implementar"**
2. Google pedirá que **autorices permisos**:
   - Clic en **"Revisar permisos"**
   - Selecciona tu cuenta de Google
   - Si aparece advertencia "Aplicación no verificada":
     - Clic en **"Avanzado"**
     - Clic en **"Ir a API Citas Surtilentes (no seguro)"**
   - Clic en **"Permitir"**

### 3.4 Copiar la URL de Implementación

1. Aparecerá un diálogo con la **URL de implementación**
2. Se verá así:
   ```
   https://script.google.com/macros/s/AKfycbx...XYZ123/exec
   ```
3. **Copia esta URL completa** (incluyendo `/exec` al final)
4. **Guarda esta URL** para el siguiente paso

---

## 💻 Paso 4: Configurar el Sitio Web

### 4.1 Editar Archivo de Configuración

1. Abre el archivo: `assets/js/config/api-config.js`
2. Busca la línea:
   ```javascript
   SHEETS_API_URL: 'TU_URL_DE_APPS_SCRIPT_AQUI',
   ```
3. Reemplaza con la URL que copiaste en el Paso 3.4:
   ```javascript
   SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbx...XYZ123/exec',
   ```

### 4.2 Activar Modo Producción

1. En el mismo archivo, busca:
   ```javascript
   DEV_MODE: true
   ```
2. Cámbialo a:
   ```javascript
   DEV_MODE: false
   ```

### 4.3 Guardar y Subir

1. **Guarda el archivo** `api-config.js`
2. **Sube los cambios** a tu servidor web

---

## 🧪 Paso 5: Probar la Integración

### 5.1 Probar Guardar Cita

1. Abre el sitio web en un navegador
2. Ve a **"Agendar Cita"**
3. Completa el formulario paso a paso
4. Al confirmar, abre **Consola del navegador** (F12)
5. Deberías ver:
   ```
   📤 Guardando cita en Google Sheets...
   ✅ Cita guardada en Google Sheets
   ```
6. **Verifica tu Google Sheet**: debe aparecer una nueva fila con los datos

### 5.2 Probar Consultar Cita

1. En el sitio web, ve a **"Consultar Citas"**
2. Ingresa el **número de cédula** que usaste en la cita de prueba
3. Deberías ver la cita listada con:
   - Badge verde **"🔔 Próxima Cita"** (si es futura)
   - Badge gris **"⏱️ Cita Vencida"** (si ya pasó)

---

## 🔧 Solución de Problemas

### Problema: "Error al guardar en Google Sheets"

**Soluciones:**

1. Verifica que el `SHEET_ID` esté correcto en el código de Apps Script
2. Asegúrate de que la URL de implementación esté completa (con `/exec`)
3. Revisa que `DEV_MODE: false` en `api-config.js`
4. Verifica que la pestaña se llame exactamente **"Citas"**

### Problema: "No se encontraron citas en Google Sheets"

**Soluciones:**

1. Verifica que existan citas guardadas en la hoja
2. Asegúrate de buscar con el número de cédula correcto
3. Revisa que las columnas estén en el orden correcto (especialmente "Número Documento" en columna F)

### Problema: Aplicación no guarda en Sheets, solo en localStorage

**Soluciones:**

1. Verifica que `DEV_MODE: false` en `api-config.js`
2. Verifica que `SHEETS_API_URL` no sea `'TU_URL_DE_APPS_SCRIPT_AQUI'`
3. Limpia la caché del navegador y recarga la página (Ctrl+Shift+R)

### Problema: "CORS error" o "No 'Access-Control-Allow-Origin'"

**Soluciones:**

- En Apps Script, verifica que **"Quién tiene acceso"** esté como **"Cualquier persona"**
- Limpia e implementa nuevamente el script:
  1. Apps Script > **Implementar** > **Administrar implementaciones**
  2. Clic en **Editar** (icono lápiz)
  3. **Nueva versión** > **Implementar**

### Modo Desarrollo (Fallback)

Si necesitas usar **solo localStorage** temporalmente:

1. En `api-config.js`, cambia:
   ```javascript
   DEV_MODE: true
   ```
2. Esto desactiva Google Sheets y usa localStorage como base de datos local

---

## 📝 Notas Importantes

- **Seguridad**: Los datos estarán públicamente accesibles a través de la URL de Apps Script. Para producción real, considera agregar autenticación.
- **Límites de Google**: Google Apps Script tiene [límites de cuotas](https://developers.google.com/apps-script/guides/services/quotas):
  - Ejecuciones por día: 20,000 (más que suficiente para una óptica)
  - Tiempo de ejecución: 6 minutos por ejecución
- **Backup**: El sistema guarda en localStorage como respaldo automático

---

## 📧 Soporte

Si tienes problemas:

1. Revisa la **Consola del navegador** (F12) para mensajes de error
2. Revisa los **Logs de Apps Script**: Apps Script > **Ejecuciones** (icono de reloj)
3. Verifica que todos los pasos estén completos

---

## ✅ Checklist de Configuración

- [ ] Google Sheet creado con columnas correctas
- [ ] SHEET_ID copiado correctamente
- [ ] Código de Apps Script pegado y guardado
- [ ] SHEET_ID configurado en el código
- [ ] Script implementado como "Aplicación web"
- [ ] Permisos autorizados ("Cualquier persona")
- [ ] URL de implementación copiada
- [ ] `api-config.js` actualizado con la URL
- [ ] `DEV_MODE: false` configurado
- [ ] Prueba de guardar cita exitosa
- [ ] Prueba de consultar cita exitosa
- [ ] Badge de "Cita Vencida" visible en citas pasadas

---

¡Listo! 🎉 Ahora tu sistema de citas está integrado con Google Sheets.
