# 🔔 Sistema de Recordatorios Automáticos

## ✨ Características Implementadas

### 1. **Lógica de Horario Inteligente** ⏰
Si son las **6:00 PM (18:00)** o después:
- ❌ **NO** se puede seleccionar el día actual
- ✅ **SÍ** se puede seleccionar desde mañana en adelante
- 💡 Tooltip explicativo si intentas seleccionar hoy después de las 6pm

**Ejemplo:**
- Hoy es Lunes a las 7:30 PM → Puedes agendar desde Martes
- Hoy es Lunes a las 3:00 PM → Puedes agendar desde hoy

---

### 2. **Recordatorio por Email** 📧
El sistema envía **automáticamente** un email de recordatorio **1 día antes** de cada cita.

**Contenido del email:**
- 🔔 Asunto: "Recordatorio: Tu cita es MAÑANA"
- 📋 Número de cita
- 📅 Fecha y hora
- 🔬 Servicio contratado
- ⏰ Recordatorios importantes
- 📍 Ubicación con Google Maps
- 📞 Información de contacto

---

## 🚀 Configuración del Recordatorio Automático

### Paso 1: Abrir Google Apps Script
1. Ve a [script.google.com](https://script.google.com)
2. Abre tu proyecto "API Citas Surtilentes"

### Paso 2: Crear Trigger (Activador)
1. En el menú izquierdo, click en el **ícono del reloj ⏰** ("Activadores")
2. Click en **"+ Agregar activador"** (abajo a la derecha)

### Paso 3: Configurar el Trigger
Completa el formulario así:

**Función a ejecutar:**
```
sendAppointmentReminders
```

**Origen del evento:**
```
Basado en tiempo
```

**Tipo de activador basado en tiempo:**
```
Activador de tiempo
```

**Seleccionar tipo de activador basado en tiempo:**
```
Temporizador por días
```

**Seleccionar hora del día:**
```
De 7 p.m. a 8 p.m.
```

*Nota: Puedes elegir otro horario si prefieres. Recomendamos las 7-8pm para que los pacientes reciban el recordatorio en la tarde/noche.*

**Notificaciones por errores:**
```
Notificarme diariamente (recomendado)
```

### Paso 4: Guardar
1. Click en **"Guardar"**
2. Si aparece un popup de autorización:
   - Click en **"Revisar permisos"**
   - Selecciona tu cuenta
   - Click en **"Avanzado"** → **"Ir a [proyecto] (no seguro)"**
   - Click en **"Permitir"**

### Paso 5: ¡Listo! ✅
El sistema ahora enviará recordatorios automáticamente todos los días a las 7-8pm a los pacientes que tengan cita mañana.

---

## 🧪 Probar el Sistema

### Opción A: Prueba Manual
1. En el editor de Apps Script
2. Selecciona la función: **`testReminders`**
3. Click en ▶️ **"Ejecutar"**
4. Revisa los logs para ver el resultado

### Opción B: Crear Cita de Prueba
1. Ve a tu sitio web
2. Agenda una cita para **mañana**
3. Usa tu propio email
4. Espera hasta las 7-8pm (o la hora que configuraste)
5. Revisa tu email (también SPAM)

---

## 📋 Lógica del Sistema

El sistema funciona así:

1. **Cada día a las 7-8pm** (o la hora que configures):
   - Se ejecuta automáticamente `sendAppointmentReminders()`
   
2. **La función revisa todas las citas:**
   - Busca citas cuya fecha sea "mañana"
   - Filtra solo las que estén "confirmadas"
   - Verifica que tengan email válido
   
3. **Envía el recordatorio:**
   - Email personalizado con diseño profesional
   - Información completa de la cita
   - Link a Google Maps
   - Recordatorios importantes

4. **Registra estadísticas:**
   - Cuántos recordatorios se enviaron
   - Cuántos se omitieron (sin email o no confirmadas)

---

## 🔍 Verificar que Funciona

### Ver Logs del Trigger:
1. En Apps Script, ve a **"Ejecuciones"** (⚡ en el menú izquierdo)
2. Verás el historial de ejecuciones diarias
3. Click en cualquier ejecución para ver los logs

### Ejemplo de logs exitosos:
```
🔔 Iniciando envío de recordatorios de citas...
📅 Buscando citas para mañana: 5/3/2026
✅ Recordatorio enviado a: juan@example.com (Juan Pérez)
✅ Recordatorio enviado a: maria@example.com (María García)
═══════════════════════════════════════
✅ Recordatorios enviados: 2
⏭️ Recordatorios omitidos: 0
═══════════════════════════════════════
```

---

## ⚙️ Personalización

### Cambiar horario de envío:
En la configuración del trigger, puedes elegir:
- Por la mañana: 8-9am
- Medio día: 12-1pm  
- Por la tarde: 3-4pm
- Por la noche: 7-8pm (recomendado)

### Cambiar el mensaje:
Edita la función `sendReminderEmail()` en el archivo `citas-api.gs`

### Enviar 2 días antes:
En la función `sendAppointmentReminders()`, cambia:
```javascript
tomorrow.setDate(tomorrow.getDate() + 1);
```
Por:
```javascript
tomorrow.setDate(tomorrow.getDate() + 2);
```

---

## 🆘 Solución de Problemas

### ❌ "No se envían los recordatorios"

**Verifica:**
1. ✅ El trigger está creado y activo (⏰ Activadores)
2. ✅ La función está autorizada (ejecuta `testReminders` primero)
3. ✅ Las citas tienen email válido en la columna H
4. ✅ Las citas están marcadas como "confirmada" en la columna U
5. ✅ La fecha de la cita coincide con mañana

### ❌ "Error de autorización"

**Solución:**
1. Ve a Activadores (⏰)
2. Elimina el trigger
3. Ejecuta manualmente `testReminders`
4. Autoriza los permisos
5. Crea el trigger de nuevo

### ❌ "Los emails llegan a SPAM"

**Solución:**
- Es normal las primeras veces
- Pide a los pacientes marcar como "No es spam"
- Después de varios envíos, Gmail aprende que son legítimos

---

## 📊 Límites y Capacidad

**Google Apps Script - Plan Gratuito:**
- ✅ **100 emails por día** (más que suficiente)
- ✅ Sin costo adicional
- ✅ Totalmente automático

Si tienes más de 100 citas por día, considera:
- Upgrade a Google Workspace (2,000 emails/día)
- O usa el sistema Python alternativo (500 emails/día)

---

## ✅ Checklist de Configuración

- [ ] Código actualizado en Google Apps Script
- [ ] Función `testReminders()` ejecutada exitosamente
- [ ] Trigger creado para ejecución diaria
- [ ] Trigger autorizado con permisos
- [ ] Prueba con cita para mañana realizada
- [ ] Email de recordatorio recibido
- [ ] **Sistema funcionando 100%** 🎉

---

**¿Necesitas ayuda adicional?**  
Revisa los logs en "Ejecuciones" (⚡) del editor de Apps Script.

---

© 2026 Surtilentes Óptica - Sistema automatizado de recordatorios
