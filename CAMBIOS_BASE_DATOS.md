# 📊 CAMBIOS EN LA BASE DE DATOS - SURTILENTES

**Fecha:** Marzo 3, 2026  
**Versión:** 2.0  

---

## 🎯 ¿QUÉ SE ACTUALIZÓ?

Se expandió la base de datos de **16 columnas** a **23 columnas** para capturar **TODOS** los datos del formulario sin excepción.

---

## 📋 NUEVA ESTRUCTURA - 23 COLUMNAS

### Columnas Anteriores (16)
| Columna | Nombre Anterior |
|---------|----------------|
| B | ID |
| G | Email |
| H | Teléfono |
| O | Info Médica (JSON) |

### Columnas Actualizadas (23)

| Col | Nombre | Descripción | Ejemplo |
|-----|--------|-------------|---------|
| **A** | Timestamp | Fecha/hora automática de registro | 03/03/2026 10:30:25 |
| **B** | **Cédula** | ✨ **CAMBIADO de "ID"** - Número documento | 1234567890 |
| **C** | Número Cita | Código único de cita | SURT-1709481234567 |
| **D** | Nombre Completo | Nombre y apellidos | Juan Alberto Pérez Gómez |
| **E** | Tipo Documento | CC, TI, CE, Pasaporte | CC |
| **F** | Número Documento | Número completo | 1234567890 |
| **G** | **Fecha Nacimiento** | ✨ **NUEVO** - Fecha nacimiento | 15/05/1990 |
| **H** | Teléfono | 10 dígitos | 3001234567 |
| **I** | Email | Correo electrónico | juan@example.com |
| **J** | **Dirección** | ✨ **NUEVO** - Dirección residencia | Calle 10 #5-32 |
| **K** | **Ciudad** | ✨ **NUEVO** - Ciudad residencia | Cartagena |
| **L** | Servicio | Nombre del servicio | Examen Visual Completo |
| **M** | Precio | Valor del servicio | $50,000 |
| **N** | Duración | Tiempo estimado | 30 min |
| **O** | Fecha Cita | Día de la cita | 15/11/2024 |
| **P** | Hora | Hora de atención | 10:00 AM |
| **Q** | **Primera Vez** | ✨ **NUEVO** - ¿Primera vez? | si / no |
| **R** | **Usa Lentes/Gafas** | ✨ **NUEVO** - Qué usa | gafas / lentes / ambos / no |
| **S** | **Tiene Fórmula Anterior** | ✨ **NUEVO** - ¿Tiene fórmula? | si / no |
| **T** | **Motivo Principal** | ✨ **NUEVO** - Razón visita | examen-rutina |
| **U** | **Notas Adicionales** | ✨ **NUEVO** - Comentarios detallados | Dolor de cabeza al leer |
| **V** | Estado | Estado de la cita | confirmada |
| **W** | Fecha Creación | Timestamp ISO | 2024-11-15T10:00:00.000Z |

---

## ✨ CAMBIOS PRINCIPALES

### 1. Cambio de Nombre: "ID" → "Cédula"
- **Antes:** Columna B = "ID" (número genérico)
- **Ahora:** Columna B = "Cédula" (número de documento)
- **Razón:** Más descriptivo y útil para búsquedas

### 2. Datos Personales Completos (7 nuevas columnas)
**Agregado:**
- ✅ Fecha de Nacimiento (Col G)
- ✅ Dirección (Col J)
- ✅ Ciudad (Col K)

**Beneficio:** Registro completo del paciente para historiales médicos

### 3. Información Médica Expandida (5 nuevas columnas)
**Antes:** Todo en 1 columna JSON (difícil de analizar)
```json
{"hasGlasses": true, "additionalInfo": "..."}
```

**Ahora:** Campos separados y legibles
- ✅ Primera Vez (Col Q): "si" o "no"
- ✅ Usa Lentes/Gafas (Col R): "gafas", "lentes", "ambos", "no"
- ✅ Tiene Fórmula Anterior (Col S): "si" o "no"
- ✅ Motivo Principal (Col T): "examen-rutina", "problemas-vision", etc.
- ✅ Notas Adicionales (Col U): Texto libre con síntomas/comentarios

**Beneficio:** 
- Filtros y análisis más fáciles en Google Sheets
- No necesitas parsear JSON
- Reportes y estadísticas directos

---

## 📂 ARCHIVOS ACTUALIZADOS

### 1. **GUIA_CONFIGURACION_GOOGLE_SHEETS.md**
```diff
- [ ] Google Sheet creada con 16 columnas
+ [ ] Google Sheet creada con 23 columnas (A hasta W)
```
- ✅ Tabla actualizada con 23 columnas
- ✅ Instrucciones claras de cada columna
- ✅ "ID" cambiado a "Cédula"

### 2. **google-apps-script/citas-api.gs**
```javascript
// ANTES (16 columnas)
sheet.appendRow([
  'Timestamp', 'ID', 'Número Cita', 'Nombre Completo',
  'Tipo Documento', 'Número Documento', 'Email', 'Teléfono',
  'Servicio', 'Precio', 'Duración', 'Fecha', 'Hora',
  'Estado', 'Info Médica', 'Fecha Creación'
]);

// AHORA (23 columnas)
sheet.appendRow([
  'Timestamp', 'Cédula', 'Número Cita', 'Nombre Completo',
  'Tipo Documento', 'Número Documento', 'Fecha Nacimiento',
  'Teléfono', 'Email', 'Dirección', 'Ciudad',
  'Servicio', 'Precio', 'Duración', 'Fecha Cita', 'Hora',
  'Primera Vez', 'Usa Lentes/Gafas', 'Tiene Fórmula Anterior',
  'Motivo Principal', 'Notas Adicionales',
  'Estado', 'Fecha Creación'
]);
```

**Cambios en appointmentData:**
- ✅ 23 valores en el array (antes 16)
- ✅ Columna B ahora usa `data.personalInfo.documentNumber` (Cédula)
- ✅ Campos médicos individuales en lugar de JSON
- ✅ Datos personales completos (birthDate, address, city)

### 3. **google-apps-script/README_CONFIGURACION.md**
- ✅ Tabla actualizada a 23 columnas
- ✅ Descripción detallada de cada columna
- ✅ Valores posibles para campos de opciones múltiples

### 4. **INTEGRACION_SHEETS_RESUMEN.md**
- ✅ Diagrama ASCII actualizado con 23 columnas
- ✅ Documentación técnica de cada columna
- ✅ Ejemplos de datos

### 5. **assets/js/pages/consultar-citas.js**
```javascript
// ANTES: Mostraba solo 5 campos personales
<div class="detail-item">...</div>

// AHORA: Muestra 8 campos personales
- Nombre Completo
- Tipo Documento
- Número Documento
- ✅ Fecha de Nacimiento (NUEVO)
- Teléfono
- Email
- ✅ Dirección (NUEVO)
- ✅ Ciudad (NUEVO)
```

**Sección Médica Actualizada:**
```javascript
// ANTES: 4 campos genéricos
- ¿Usa gafas actualmente?
- ¿Tiene fórmula médica?
- ¿Tiene alergias oculares?
- Información Adicional

// AHORA: 5 campos específicos
- ✅ ¿Primera vez en Surtilentes?
- ✅ ¿Usa lentes o gafas? (con opciones detalladas)
- ✅ ¿Tiene fórmula anterior?
- ✅ Motivo Principal (con traducción de códigos)
- ✅ Notas Adicionales
```

---

## 🔄 MIGRACIÓN

### ¿Qué pasa con las citas antiguas?

**No hay problema:** El sistema es compatible hacia atrás.

- **Citas creadas ANTES de esta actualización:**
  - Se mostrarán con los campos que tenían
  - Los nuevos campos aparecerán como "N/A"
  - No se pierde ningún dato existente

- **Citas creadas DESPUÉS de esta actualización:**
  - Incluirán todos los 23 campos
  - Datos completos y detallados

### ¿Necesito hacer algo con las citas viejas?

**NO.** El código maneja automáticamente:
```javascript
// Ejemplo en citas-api.gs
data.personalInfo.birthDate || 'N/A'  // Si no existe, pone N/A
```

---

## 💡 VENTAJAS DEL NUEVO SISTEMA

### 1. **Análisis de Datos Más Fácil**
```excel
// Ahora puedes hacer en Google Sheets:
=COUNTIF(Q:Q, "si")          // ¿Cuántos son primera vez?
=COUNTIF(R:R, "gafas")       // ¿Cuántos usan gafas?
=FILTER(A:W, T:T="problemas-vision")  // Filtrar por motivo
```

### 2. **Reportes Automáticos**
- Tabla dinámica de servicios más solicitados
- Gráficos de tipos de pacientes (primera vez vs recurrentes)
- Análisis de motivos de visita más frecuentes

### 3. **Búsqueda y Filtrado**
- Filtrar por ciudad para análisis regional
- Buscar pacientes por fecha de nacimiento
- Filtrar por tipo de corrección (gafas/lentes)

### 4. **Historiales Completos**
- Dirección para envíos o seguimiento
- Fecha nacimiento para campañas de cumpleaños
- Notas médicas detalladas para seguimiento

---

## 📊 EJEMPLO DE FILA COMPLETA

```
A: 03/03/2026 14:30:25
B: 1234567890
C: SURT-1709481234567
D: María Fernanda López García
E: CC
F: 1234567890
G: 22/08/1995
H: 3159876543
I: maria.lopez@gmail.com
J: Carrera 45 #28-15 Apto 302
K: Cartagena
L: Examen Visual Completo
M: $50,000
N: 30 min
O: 10/03/2026
P: Por orden de llegada
Q: no
R: gafas
S: si
T: problemas-vision
U: Últimamente veo borroso de lejos, especialmente al conducir de noche
V: confirmada
W: 2026-03-03T14:30:25.123Z
```

---

## ✅ VERIFICACIÓN POST-ACTUALIZACIÓN

Cuando configures Google Sheets con las nuevas 23 columnas:

1. ✅ Verifica que la columna B diga **"Cédula"** (no "ID")
2. ✅ Haz scroll horizontal y confirma que llegues hasta la columna **W**
3. ✅ Crea una cita de prueba
4. ✅ Verifica que aparezcan los 23 campos llenos
5. ✅ Consulta la cita y verifica que se vean todos los datos

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### "Solo veo 16 columnas en mi Google Sheet"
- Borra la hoja y créala nuevamente siguiendo la guía actualizada
- O agrega manualmente las 7 columnas faltantes al final (G, J, K, Q, R, S, T, U)

### "Las citas viejas muestran N/A en los nuevos campos"
- ✅ **Esto es normal y esperado**
- Las citas antiguas no tienen esos datos porque no se pedían antes
- Las nuevas citas sí tendrán todos los campos llenos

### "El modal de detalles no muestra los campos nuevos"
- Limpia la caché del navegador (Ctrl+Shift+Delete)
- Refresca la página (Ctrl+F5 o Cmd+Shift+R)
- Verifica que usaste el archivo consultar-citas.js actualizado

---

## 📝 PRÓXIMOS PASOS

1. **Sigue la guía:** [GUIA_CONFIGURACION_GOOGLE_SHEETS.md](GUIA_CONFIGURACION_GOOGLE_SHEETS.md)
2. **Crea tu Google Sheet** con las 23 columnas
3. **Configura el Apps Script** con citas-api.gs actualizado
4. **Prueba el sistema** creando una cita completa
5. **Verifica en Google Sheets** que se guarden los 23 campos

---

**¡El sistema ahora captura TODO sin excepciones! 🎉**

*Documento generado: Marzo 3, 2026*  
*Versión: 2.0 - Base de Datos Completa*
