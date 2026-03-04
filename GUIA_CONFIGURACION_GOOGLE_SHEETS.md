# 📝 GUÍA COMPLETA: Configurar Google Sheets para Surtilentes Óptica

**Tiempo estimado:** 15-20 minutos  
**Dificultad:** Fácil  
**Fecha:** Marzo 2026

---

## 🎯 ¿QUÉ VAMOS A HACER?

Vamos a conectar tu página web de Surtilentes con Google Sheets para que todas las citas agendadas se guarden automáticamente en una hoja de cálculo.

---

## 📋 REQUISITOS PREVIOS

✅ Tener una cuenta de Gmail/Google  
✅ Acceso a Google Sheets  
✅ Los archivos del proyecto de Surtilentes en tu computadora  

---

# 🚀 PASO 1: CREAR LA HOJA DE CÁLCULO

## 1.1 Crear Nueva Hoja

1. Abre tu navegador
2. Ve a: **https://sheets.google.com**
3. Haz clic en el botón **"+ Crear"** o **"Hoja de cálculo en blanco"**
4. Nombra tu hoja: **"Surtilentes - Base de Datos Citas"**
   - Haz clic donde dice "Hoja de cálculo sin título" (arriba a la izquierda)
   - Escribe el nombre y presiona Enter

## 1.2 Crear las Columnas

En la **fila 1** (la primera fila), escribe EXACTAMENTE estos títulos:

**IMPORTANTE: Escribe cada título en una celda diferente, de izquierda a derecha**

```
Celda A1: Timestamp
Celda B1: Tipo Documento
Celda C1: Cédula
Celda D1: Número Cita
Celda E1: Nombre Completo
Celda F1: Fecha Nacimiento
Celda G1: Teléfono
Celda H1: Email
Celda I1: Dirección
Celda J1: Ciudad
Celda K1: Servicio
Celda L1: Precio
Celda M1: Duración
Celda N1: Fecha Cita
Celda O1: Hora
Celda P1: Primera Vez
Celda Q1: Usa Lentes/Gafas
Celda R1: Tiene Fórmula Anterior
Celda S1: Motivo Principal
Celda T1: Notas Adicionales
Celda U1: Estado
Celda V1: Fecha Creación
```

**Así debe verse tu hoja (scroll horizontal para ver todas las 22 columnas):**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Tipo Documento | Cédula | Número Cita | Nombre Completo | Fecha Nacimiento | Teléfono | Email | Dirección | Ciudad | Servicio | Precio | Duración | Fecha Cita | Hora | Primera Vez | Usa Lentes/Gafas | Tiene Fórmula Anterior | Motivo Principal | Notas Adicionales | Estado | Fecha Creación |

## 1.3 Renombrar la Pestaña

1. Abajo de la hoja verás una pestaña que dice "Hoja 1"
2. Haz clic derecho sobre ella
3. Selecciona "Cambiar nombre"
4. Escribe: **Citas**
5. Presiona Enter

## 1.4 Copiar el ID de tu Hoja (MUY IMPORTANTE)

1. Mira la barra de direcciones (URL) de tu navegador
2. Verás algo como esto:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t/edit
   ```

3. **Copia SOLO la parte entre `/d/` y `/edit`**
   
   En el ejemplo anterior sería:
   ```
   1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
   ```

4. **PEGA ESTE ID AQUÍ (lo necesitarás en el siguiente paso):**
   ```
   MI SHEET_ID ES: _______________________________________________
   ```

✅ **PASO 1 COMPLETADO** - Tu hoja está lista

---

# ⚙️ PASO 2: CONFIGURAR GOOGLE APPS SCRIPT

## 2.1 Abrir el Editor de Scripts

1. En tu Google Sheet (la que acabas de crear)
2. En el menú superior, haz clic en **"Extensiones"**
3. Selecciona **"Apps Script"**
4. Se abrirá una nueva pestaña con un editor de código

## 2.2 Limpiar el Editor

1. En el editor verás algo de código predeterminado
2. **Selecciona TODO** (Ctrl+A o Cmd+A)
3. **Borra todo** (presiona Delete o Backspace)
4. Ahora el editor debe estar completamente vacío

## 2.3 Pegar el Código

1. Ve a tu carpeta del proyecto: `optica-pagina-master\google-apps-script\`
2. Abre el archivo: **`citas-api.gs`**
3. **Selecciona TODO el contenido** del archivo (Ctrl+A)
4. **Copia** (Ctrl+C)
5. Regresa al editor de Apps Script
6. **Pega** el código (Ctrl+V)

## 2.4 Configurar tu SHEET_ID

1. En el código que pegaste, busca la línea 28 (aproximadamente)
2. Verás esto:
   ```javascript
   const SHEET_ID = 'TU_SHEET_ID_AQUI';
   ```

3. **Reemplaza** `'TU_SHEET_ID_AQUI'` con el ID que copiaste en el Paso 1.4

   **EJEMPLO:**
   ```javascript
   // ANTES:
   const SHEET_ID = 'TU_SHEET_ID_AQUI';
   
   // DESPUÉS (con tu ID real):
   const SHEET_ID = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t';
   ```

4. **IMPORTANTE:** Deja las comillas `' '` alrededor del ID

## 2.5 Guardar el Proyecto

1. Haz clic en el icono de **disquete** 💾 (arriba)
2. O presiona **Ctrl+S** / **Cmd+S**
3. Te pedirá un nombre para el proyecto
4. Escribe: **"API Citas Surtilentes"**
5. Haz clic en **"Aceptar"**

✅ **PASO 2 COMPLETADO** - El script está configurado

---

# 🌐 PASO 3: IMPLEMENTAR COMO APLICACIÓN WEB

## 3.1 Iniciar Implementación

1. En el editor de Apps Script (donde está tu código)
2. Arriba a la derecha, busca el botón **"Implementar"**
3. Haz clic en **"Implementar"**
4. Selecciona **"Nueva implementación"**

## 3.2 Configurar la Implementación

Aparecerá un diálogo. Configura así:

1. **Icono de engranaje** (⚙️): Haz clic y selecciona **"Aplicación web"**

2. **Descripción:** Escribe `API de Citas v1`

3. **Ejecutar como:** Selecciona **"Yo"** (tu correo de Google)

4. **Quién tiene acceso:** Selecciona **"Cualquier persona"**
   - ⚠️ IMPORTANTE: Debe decir "Cualquier persona", no "Solo yo"

5. Haz clic en el botón **"Implementar"**

## 3.3 Autorizar Permisos

Google pedirá que autorices la aplicación:

1. Aparecerá un mensaje: **"Autorización necesaria"**
2. Haz clic en **"Revisar permisos"**
3. Selecciona tu cuenta de Google
4. **SI APARECE** "Google hasn't verified this app":
   - Haz clic en **"Advanced"** (Avanzado)
   - Haz clic en **"Go to API Citas Surtilentes (unsafe)"**
   - (No te preocupes, es tu propia aplicación, es seguro)
5. Haz clic en **"Permitir"** o **"Allow"**

## 3.4 Copiar la URL de la API

1. Después de autorizar, aparecerá un mensaje de éxito
2. Verás una **URL larga** que termina en `/exec`
3. Se verá así:
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXX/exec
   ```

4. **COPIA TODA LA URL** (incluyendo el `/exec` al final)
5. **PEGA LA URL AQUÍ (la necesitarás en el siguiente paso):**
   ```
   MI URL DE API ES: _______________________________________________
   ```

6. **NO CIERRES ESTA VENTANA AÚN** - Guarda la URL en un lugar seguro

✅ **PASO 3 COMPLETADO** - Tu API está activa

---

# 💻 PASO 4: CONFIGURAR TU PÁGINA WEB

## 4.1 Abrir el Archivo de Configuración

1. Ve a la carpeta de tu proyecto: `optica-pagina-master`
2. Navega a: `assets\js\config\`
3. Abre el archivo: **`api-config.js`**
4. Ábrelo con un editor de código (Visual Studio Code, Notepad++, o incluso Bloc de notas)

## 4.2 Pegar tu URL de API

1. En el archivo verás algo como esto:
   ```javascript
   const API_CONFIG = {
     SHEETS_API_URL: 'TU_URL_DE_APPS_SCRIPT_AQUI',
     DEV_MODE: true
   };
   ```

2. **Reemplaza** `'TU_URL_DE_APPS_SCRIPT_AQUI'` con la URL que copiaste en el Paso 3.4

   **EJEMPLO:**
   ```javascript
   // ANTES:
   const API_CONFIG = {
     SHEETS_API_URL: 'TU_URL_DE_APPS_SCRIPT_AQUI',
     DEV_MODE: true
   };
   
   // DESPUÉS (con tu URL real):
   const API_CONFIG = {
     SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXX/exec',
     DEV_MODE: true
   };
   ```

3. **IMPORTANTE:** Deja las comillas `' '` alrededor de la URL

## 4.3 Activar Modo Producción

1. En el mismo archivo, busca la línea:
   ```javascript
   DEV_MODE: true
   ```

2. **Cambia** `true` por `false`:
   ```javascript
   DEV_MODE: false
   ```

3. Así debe quedar el archivo completo:
   ```javascript
   const API_CONFIG = {
     SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXX/exec',
     DEV_MODE: false
   };
   
   export default API_CONFIG;
   ```

## 4.4 Guardar el Archivo

1. **Guarda** el archivo (Ctrl+S / Cmd+S)
2. **Cierra** el editor

✅ **PASO 4 COMPLETADO** - Tu página está conectada

---

# ✅ PASO 5: PROBAR QUE TODO FUNCIONA

## 5.1 Abrir tu Página Web

1. Ve a la carpeta: `optica-pagina-master`
2. Abre el archivo: **`index.html`**
3. Ábrelo con tu navegador (doble clic o clic derecho > Abrir con > Chrome/Firefox)

## 5.2 Ir a Agendar Cita

1. En la página, haz clic en **"Agendar Cita"**
2. Llena el formulario completo con datos de prueba:
   - Nombre: Juan Pérez
   - Documento: 123456789
   - Email: test@gmail.com
   - Teléfono: 3001234567
   - Selecciona un servicio
   - Selecciona una fecha futura
   - Completa todos los pasos

## 5.3 Verificar en Google Sheets

1. Vuelve a tu Google Sheet (Paso 1)
2. **Refresca la página** (F5)
3. **Verás una nueva fila (fila 2)** con los datos que acabas de ingresar
4. Si aparece la cita → **¡FUNCIONA! 🎉**

## 5.4 Probar Consultar Cita

1. En tu página, ve a **"Consultar Citas"**
2. Ingresa el número de documento que usaste (123456789)
3. Haz clic en **"Buscar"**
4. Debe aparecer la cita en formato de tabla
5. Haz clic en **"Ver Detalle"** para ver toda la información

---

# 🎉 ¡CONFIGURACIÓN COMPLETADA!

## ✅ Checklist Final

Marca cada casilla cuando lo hayas completado:

- [ ] Google Sheet creada con 22 columnas (A hasta V)
- [ ] Pestaña renombrada a "Citas"
- [ ] SHEET_ID copiado
- [ ] Código de Apps Script pegado
- [ ] SHEET_ID configurado en el código
- [ ] Proyecto de Apps Script guardado
- [ ] Aplicación web implementada
- [ ] Permisos autorizados
- [ ] URL de API copiada
- [ ] URL configurada en api-config.js
- [ ] DEV_MODE cambiado a false
- [ ] Prueba de agendar cita exitosa
- [ ] Datos aparecen en Google Sheet
- [ ] Consulta de citas funciona

---

# 🆘 SOLUCIÓN DE PROBLEMAS

## Problema 1: "No aparece la cita en Google Sheets"

**Soluciones:**

1. Verifica que `DEV_MODE: false` en api-config.js
2. Refresca la página del Google Sheet (F5)
3. Revisa que el SHEET_ID sea correcto
4. Abre la consola del navegador (F12) y busca mensajes de error

## Problema 2: "Error de permisos al implementar"

**Soluciones:**

1. Ve a: https://script.google.com/home/usersettings
2. Marca "Google Apps Script API" como Activado
3. Intenta implementar nuevamente

## Problema 3: "La URL de la API no funciona"

**Soluciones:**

1. Verifica que la URL termine en `/exec`
2. Copia la URL completa, sin espacios
3. Asegúrate de que las comillas estén correctas en api-config.js

## Problema 4: "Aparece mensaje de autorización cada vez"

**Soluciones:**

1. En "Quién tiene acceso" debe decir "Cualquier persona"
2. Re-implementa la aplicación web
3. Autoriza nuevamente

---

# 📞 CONTACTO Y SOPORTE

Si después de seguir todos los pasos algo no funciona:

1. Revisa el Checklist Final
2. Lee la sección de Solución de Problemas
3. Verifica cada paso nuevamente
4. Abre la consola del navegador (F12) para ver errores

---

# 📝 NOTAS IMPORTANTES

⚠️ **NUNCA COMPARTAS:**
- Tu SHEET_ID
- Tu URL de API
- Los datos de tu Google Sheet

✅ **RECUERDA:**
- Google Sheets guarda automáticamente
- Puedes ver el historial de cambios en Google Sheets
- Puedes exportar los datos a Excel cuando quieras
- Las citas se ordenan de más nueva a más antigua

---

# 🎓 INFORMACIÓN ADICIONAL

## ¿Qué hace cada archivo?

### `api-config.js`
Contiene la configuración de conexión:
- URL de Google Sheets
- Modo de desarrollo (true = local, false = online)

### `citas-api.gs`
Script de Google que:
- Recibe las citas desde la web
- Las guarda en Google Sheets
- Permite consultar citas por cédula

### Google Sheet
Base de datos que:
- Almacena todas las citas
- Permite ver, editar y exportar datos
- Se actualiza en tiempo real

---

**¡Éxito en tu implementación! 🚀**

---

*Documento creado: Marzo 2026*  
*Versión: 1.0*  
*Sistema: Surtilentes Óptica - Gestión de Citas*
