com# 📦 Resumen de Integración Google Sheets - Surtilentes

## ✅ Archivos Creados

```
google-apps-script/
├── citas-api.gs                      ← API Backend (Google Apps Script)
├── README_CONFIGURACION.md           ← Guía paso a paso para configurar
└── DOCUMENTACION_TECNICA.md          ← Documentación técnica del sistema

assets/js/config/
└── api-config.js                     ← Configuración centralizada (URL, DEV_MODE)
```

## 🔧 Archivos Modificados

```
assets/js/pages/
├── appointments.js                   ← Ahora guarda en Google Sheets + localStorage
└── consultar-citas.js                ← Ahora consulta por cédula en Sheets + badge vencidas

pages/
├── agendar-cita.html                 ← Agregado <script> api-config.js
└── consultar-citas.html              ← Agregado <script> api-config.js
```

---

## 🎯 Funcionalidades Implementadas

### ✅ 1. Guardar Citas en Google Sheets
- **Formulario "Agendar Cita"** ahora envía datos a Google Sheets
- **Estructura de datos** completa con 14 columnas
- **Backup automático** en localStorage (por si falla la conexión)
- **Modo dual**: Desarrollo (localStorage) o Producción (Sheets)

### ✅ 2. Consultar Citas por Cédula
- **Búsqueda exacta** por número de documento
- **Consulta en Google Sheets** en tiempo real
- **Fallback a localStorage** si no hay conexión
- **Resultados ordenados** por fecha (más reciente primero)

### ✅ 3. Indicador de Citas Vencidas
- **Badge verde** "🔔 Próxima Cita" para citas futuras
- **Badge gris** "⏱️ Cita Vencida" para citas pasadas
- **Comparación fecha + hora** precisa (no solo fecha)
- **Oculta recomendaciones** en citas ya pasadas

---

## 📋 Estructura de la Base de Datos (Google Sheets)

**22 columnas en total (A-V)** - Scroll horizontal para ver todas

```
┌──────────────┬────────────────┬──────────────┬──────────────┬─────────────────┬──────────────────┬──────────┬────────────┬───────────┬─────────┬──────────────────┬──────────┬──────────┬────────────┬──────────┬─────────────┬──────────────────┬────────────────────────┬──────────────────┬──────────────────┬────────────┬─────────────────────┐
│ Timestamp    │ Tipo Documento │ Cédula       │ Número Cita  │ Nombre Completo │ Fecha Nacimiento │ Teléfono │ Email      │ Dirección │ Ciudad  │ Servicio         │ Precio   │ Duración │ Fecha Cita │ Hora     │ Primera Vez │ Usa Lentes/Gafas │ Tiene Fórmula Anterior │ Motivo Principal │ Notas Adicionales │ Estado     │ Fecha Creación      │
├──────────────┼────────────────┼──────────────┼──────────────┼─────────────────┼──────────────────┼──────────┼────────────┼───────────┼─────────┼──────────────────┼──────────┼──────────┼────────────┼──────────┼─────────────┼──────────────────┼────────────────────────┼──────────────────┼──────────────────┼────────────┼─────────────────────┤
│ 03/03/26...  │ CC             │ 1234567890   │ SURT-1699... │ Juan Pérez      │ 15/05/1990       │ 3001234  │ juan@ex... │ Calle 1   │ Bogotá  │ Examen Visual    │ $50,000  │ 30 min   │ 15/11/2024 │ 10:00 AM │ si          │ gafas            │ no                     │ examen-rutina    │ Dolor de cabeza  │ confirmada │ 2024-11-15T10:00... │
└──────────────┴────────────────┴──────────────┴──────────────┴─────────────────┴──────────────────┴──────────┴────────────┴───────────┴─────────┴──────────────────┴──────────┴──────────┴────────────┴──────────┴─────────────┴──────────────────┴────────────────────────┴──────────────────┴──────────────────┴────────────┴─────────────────────┘
      A                B                C               D              E                   F                 G           H            I          J             K              L          M            N          O            P                Q                       R                       S                    T                 U                 V
```

**Columnas:**
- **A - Timestamp**: Fecha/hora de registro en Sheets
- **B - Tipo Documento**: CC, TI, CE, Pasaporte
- **C - Cédula**: Número de documento del paciente (para búsqueda rápida)
- **D - Número Cita**: "SURT-xxxxx" (formato visible)
- **E - Nombre Completo**: Nombre y apellidos del paciente
- **F - Fecha Nacimiento**: Fecha de nacimiento del paciente
- **G - Teléfono**: Número de contacto (10 dígitos)
- **H - Email**: Correo electrónico
- **I - Dirección**: Dirección de residencia
- **J - Ciudad**: Ciudad de residencia
- **K - Servicio**: Nombre del servicio seleccionado
- **L - Precio**: Valor del servicio
- **M - Duración**: Tiempo estimado del servicio
- **N - Fecha Cita**: Fecha de la cita (DD/MM/YYYY)
- **O - Hora**: Hora de atención (sistema por llegada)
- **P - Primera Vez**: Si/No - ¿Es primera vez en Surtilentes?
- **Q - Usa Lentes/Gafas**: gafas / lentes / ambos / no
- **R - Tiene Fórmula Anterior**: Si/No - ¿Tiene fórmula previa?
- **S - Motivo Principal**: Razón de la visita (dropdown)
- **T - Notas Adicionales**: Síntomas, comentarios, detalles del paciente
- **U - Estado**: confirmada, cancelada, completada
- **V - Fecha Creación**: Timestamp ISO de creación

---

## 🔄 Flujo de Trabajo

### Agendar Nueva Cita

```
Usuario completa formulario
         ↓
JavaScript crea objeto appointment
         ↓
¿DEV_MODE false y API_URL configurada?
    ├─── [SÍ] ─→ POST a Google Sheets ─→ ✅ Guardado en Sheets
    ↓                                        ↓
    └─── [NO] ──────────────────────────────┘
                        ↓
            💾 Backup en localStorage
                        ↓
            📧 Notificación al usuario
```

### Consultar Citas

```
Usuario ingresa cédula
         ↓
¿DEV_MODE false y API_URL configurada?
    ├─── [SÍ] ─→ GET de Google Sheets (?cedula=xxx)
    ↓                    ↓
    ↓              ✅ Citas encontradas en Sheets
    ↓                    ↓
    └─── [NO] ─────────┬┘
                       ↓
           💾 Buscar en localStorage
                       ↓
              Ordenar por fecha DESC
                       ↓
           Marcar citas vencidas (fecha < hoy)
                       ↓
           Renderizar tarjetas con badges
```

---

## 🚀 Pasos para Activar

### 1️⃣ Crear Google Sheet
```bash
1. Ir a sheets.google.com
2. Crear nueva hoja: "Surtilentes - Base de Datos Citas"
3. Renombrar pestaña a "Citas"
4. Copiar encabezados de la tabla anterior (columnas A-N)
5. Copiar SHEET_ID de la URL
```

### 2️⃣ Configurar Google Apps Script
```bash
1. Extensiones > Apps Script
2. Copiar código de: google-apps-script/citas-api.gs
3. Reemplazar: const SHEET_ID = 'TU_SHEET_ID_AQUI';
4. Guardar proyecto
```

### 3️⃣ Implementar como Web App
```bash
1. Implementar > Nueva implementación
2. Tipo: Aplicación web
3. Ejecutar como: Yo
4. Quién tiene acceso: Cualquier persona ⚠️
5. Copiar URL de implementación
```

### 4️⃣ Configurar el Sitio Web
```bash
Editar: assets/js/config/api-config.js

SHEETS_API_URL: 'https://script.google.com/macros/s/.../exec',  ← URL del paso 3
DEV_MODE: false  ← Cambiar de true a false
```

### 5️⃣ Probar
```bash
1. Agendar una cita de prueba
2. Verificar que aparezca en Google Sheets
3. Consultar la cita con la cédula ingresada
4. Verificar badge de "Próxima Cita"
```

---

## 💻 Modo Desarrollo vs Producción

### Modo Desarrollo (`DEV_MODE: true`)

```javascript
// api-config.js
DEV_MODE: true
```

**Comportamiento:**
- ❌ No usa Google Sheets
- ✅ Guarda en localStorage del navegador
- 🎯 Ideal para: Testing local, sin internet

**Cuándo usar:**
- Durante desarrollo inicial
- Demostraciones offline
- Testing sin afectar datos reales

### Modo Producción (`DEV_MODE: false`)

```javascript
// api-config.js
DEV_MODE: false
SHEETS_API_URL: 'https://script.google.com/...'
```

**Comportamiento:**
- ✅ Usa Google Sheets como base de datos
- ✅ Backup en localStorage (fallback)
- 🎯 Ideal para: Sitio web en vivo

**Cuándo usar:**
- Sitio web productivo
- Múltiples usuarios/dispositivos
- Persistencia real de datos

---

## 🔧 Configuración Recomendada

### Para Desarrollo Local
```javascript
// api-config.js
const API_CONFIG = {
  SHEETS_API_URL: 'TU_URL_DE_APPS_SCRIPT_AQUI',
  TIMEOUT: 10000,
  DEV_MODE: true  ← Usar localStorage
};
```

### Para Producción
```javascript
// api-config.js
const API_CONFIG = {
  SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbx.../exec',
  TIMEOUT: 10000,
  DEV_MODE: false  ← Usar Google Sheets
};
```

---

## 📊 Características del Badge de Citas Vencidas

### Cita Próxima (Futura)
```html
<span class="badge bg-success ms-2">
  🔔 Próxima Cita
</span>
```
- **Color**: Verde (#198754)
- **Icono**: 🔔 Campana
- **Muestra**: Recomendaciones de qué traer

### Cita Vencida (Pasada)
```html
<span class="badge bg-secondary ms-2">
  ⏱️ Cita Vencida
</span>
```
- **Color**: Gris (#6c757d)
- **Icono**: ⏱️ Reloj
- **Oculta**: Recomendaciones (ya no aplican)

### Lógica de Comparación
```javascript
// Compara fecha + hora, no solo fecha
const appointmentDateTime = new Date(year, month, day, hours, minutes);
const now = new Date();
const isPastDate = appointmentDateTime < now;
```

**Ejemplo:**
- Cita: 15/11/2024 10:00 AM
- Hoy: 15/11/2024 2:00 PM
- Resultado: ⏱️ Cita Vencida (ya pasó la hora)

---

## 📝 Notas Importantes

### ⚠️ Seguridad
- **Datos públicos**: Cualquiera con la URL de Apps Script puede acceder
- **Sin autenticación**: No hay validación de usuarios
- **Recomendación**: Implementar API Key para producción

### 📈 Escalabilidad
- **Límite diario**: 20,000 ejecuciones de Apps Script
- **Para óptica pequeña**: Más que suficiente (50-100 citas/día)
- **Rendimiento**: 1-3 segundos por operación

### 💾 Backup
- **Automático**: Cada cita se guarda también en localStorage
- **Recuperación**: Si falla Sheets, los datos locales persisten
- **Migración**: Script incluido para migrar localStorage → Sheets

---

## 📚 Documentación Adicional

Para más detalles, consulta:

1. **`README_CONFIGURACION.md`**: Guía paso a paso con capturas
2. **`DOCUMENTACION_TECNICA.md`**: Arquitectura y detalles técnicos
3. **`citas-api.gs`**: Código comentado del backend

---

## ✅ Checklist de Verificación

Antes de poner en producción, verifica:

- [ ] Google Sheet creado con 14 columnas
- [ ] SHEET_ID correcto en Apps Script
- [ ] Script implementado como "Aplicación web"
- [ ] Permisos: "Cualquier persona"
- [ ] URL de implementación copiada
- [ ] `api-config.js` actualizado con URL
- [ ] `DEV_MODE: false` en producción
- [ ] Prueba de agendar cita exitosa
- [ ] Prueba de consultar por cédula exitosa
- [ ] Badge "Cita Vencida" funciona correctamente
- [ ] Fallback a localStorage funciona
- [ ] Logs de consola sin errores

---

## 🎉 ¡Sistema Listo!

Tu sistema de citas ahora está integrado con Google Sheets y tiene:

✅ Persistencia real de datos
✅ Búsqueda por cédula
✅ Indicador de citas vencidas
✅ Backup automático
✅ Modo desarrollo/producción
✅ Fallback robusto

**Próximos pasos:**
1. Configurar Google Sheet (5 min)
2. Implementar Apps Script (3 min)
3. Actualizar api-config.js (1 min)
4. Probar y desplegar (5 min)

**Total: ~15 minutos** ⏱️

---

**¿Necesitas ayuda?** Revisa `README_CONFIGURACION.md` para instrucciones detalladas.
