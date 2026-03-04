# 📧 CÓMO AUTORIZAR EL ENVÍO DE EMAILS - PASO A PASO

## ✅ VENTAJAS DE ESTA SOLUCIÓN:
- ✅ **100% GRATUITA** - Sin costos ocultos
- ✅ **100 emails por día** - Más que suficiente para tu óptica
- ✅ **SIN LÍMITES DE PAGO** - Google lo da gratis permanentemente
- ✅ **Ya integrado** - Usa tu Google Sheets existente

---

## 🚀 INSTRUCCIONES - SOLO SE HACE UNA VEZ

### **PASO 1: Copiar el código actualizado**

1. Abre tu Google Sheet de citas
2. Ve a **Extensiones** → **Apps Script**
3. **Borra TODO el código** que esté ahí (presiona Ctrl+A, luego Delete)
4. Copia el código completo del archivo `google-apps-script/citas-api.gs`
5. Pégalo en el editor de Apps Script
6. Guarda con **Ctrl+S** (o clic en el ícono de disquete)

---

### **PASO 2: Editar el email de prueba**

Busca la línea 316 en el código (dentro de testEndpoint):

```javascript
email: 'TU_EMAIL_AQUI@gmail.com', // ⚠️ CAMBIA ESTO POR TU EMAIL
```

**Cámbiala por tu email real**, por ejemplo:
```javascript
email: 'jose@gmail.com',
```

Guarda de nuevo (**Ctrl+S**)

---

### **PASO 3: Ejecutar la función de prueba**

1. En el editor de Apps Script, busca el **menú desplegable de funciones** (arriba, donde dice "Seleccionar función")
2. Selecciona **`testEndpoint`**
3. Haz clic en el botón **▶️ Ejecutar** (al lado del menú)
4. **SE ABRIRÁ UN CUADRO DE AUTORIZACIÓN** → Continúa al siguiente paso

---

### **PASO 4: AUTORIZAR PERMISOS (MUY IMPORTANTE)**

Cuando ejecutes la función, aparecerá un mensaje:

#### **"Autorización necesaria"**

1. Haz clic en **"Revisar permisos"**

---

#### **"Elige una cuenta"**

2. Selecciona tu cuenta de Google (la misma del Sheet)

---

#### **"Google hasn't verified this app"** (Google no ha verificado esta aplicación)

⚠️ **NO TE ASUSTES - ES NORMAL**

Esto aparece porque es tu propio script, no una app de la tienda.

3. Haz clic en **"Avanzado"** (o "Advanced") en la parte inferior izquierda

---

#### **"Ir a [nombre del proyecto] (no seguro)"**

4. Haz clic en **"Ir a API Citas Surtilentes (unsafe)"** (el texto exacto puede variar)

---

#### **"Conceder permisos"**

Google te mostrará los permisos que solicita:

- ✅ Ver, editar, crear y eliminar tus hojas de cálculo
- ✅ Enviar correo electrónico en tu nombre

5. Baja hasta el final y haz clic en **"Permitir"** (o "Allow")

---

### **PASO 5: Verificar que funcionó**

Después de autorizar:

1. Se ejecutará la función automáticamente
2. Ve a **Ver** → **Registros** (o presiona **Ctrl+Enter**)
3. Deberías ver mensajes como:
   ```
   🧪 Iniciando prueba de sistema...
   📥 Probando guardado en Google Sheets...
   ✅ Resultado: {"success":true...}
   ✅ Correo enviado a: tu-email@gmail.com
   ```

4. **REVISA TU EMAIL** (también la carpeta de **SPAM/Correo no deseado**)
5. Deberías tener un email con el asunto: **"✓ Cita Confirmada - SURT-TEST-..."**

---

### **PASO 6: Re-implementar el script**

⚠️ **IMPORTANTE** - Para que los cambios funcionen en tu sitio web:

1. En Apps Script, haz clic en **"Implementar"** (arriba a la derecha, botón azul)
2. Selecciona **"Administrar implementaciones"**
3. Haz clic en el **ícono de lápiz ✏️** (Editar) junto a tu implementación actual
4. En **"Versión"**, selecciona **"Nueva versión"**
5. Haz clic en **"Implementar"**
6. Cierra la ventana

**¡LISTO!** Ahora tu app web usa el código actualizado con emails.

---

## ✅ VERIFICACIÓN FINAL

Para confirmar que todo funciona:

1. Ve a tu sitio web (donde los clientes agendan citas)
2. Completa el formulario de agendar cita
3. **Usa tu propio email** para probar
4. Confirma la cita
5. En unos segundos (máximo 1 minuto) deberías recibir el email de confirmación

**Si no llega:**
- Revisa la carpeta de **SPAM**
- Ve a Apps Script → **Ver** → **Registros** para ver si hay errores
- Verifica que el email en el formulario sea correcto
- Confirma que re-implementaste (Paso 6)

---

## 📊 LÍMITES DEL PLAN GRATUITO DE GOOGLE

- ✅ **100 emails por día** (para cuentas Gmail gratuitas)
- ✅ **1,500 emails por día** (para cuentas Google Workspace)
- ✅ **Sin costo** - Completamente gratis
- ✅ **Permanente** - No caduca

Para una óptica, 100 emails al día es más que suficiente (3,000 citas al mes).

---

## ❓ SOLUCIÓN DE PROBLEMAS

### "No me llega el email"
1. **Revisa SPAM primero** - Es lo más común
2. Ve a Apps Script → Ver → Registros
3. Busca mensajes de error
4. Verifica que el email en el formulario sea correcto

### "Error: No autorizado"
- Necesitas ejecutar `testEndpoint` de nuevo y autorizar
- Asegúrate de hacer clic en "Permitir" al final

### "El botón Ejecutar está deshabilitado"
- Guarda el código primero (Ctrl+S)
- Selecciona la función `testEndpoint` del menú desplegable

### "Cannot read property 'personalInfo'"
- Verifica que copiaste TODO el código correctamente
- Asegúrate de que no haya errores de sintaxis (revisa que no haya líneas rojas)

---

## 🔐 SEGURIDAD

- ✅ Los emails se envían desde TU cuenta de Google
- ✅ Solo TÚ tienes acceso al script
- ✅ Los datos están en TU Google Sheet privado
- ✅ Google protege tu cuenta con sus medidas de seguridad

---

## 📞 ¿NECESITAS MÁS AYUDA?

Si después de seguir estos pasos aún no funciona:

1. **Ve a Apps Script → Ver → Registros**
2. Copia el mensaje de error completo
3. Dime qué mensaje aparece

---

**¡Listo! Ahora tienes un sistema profesional de emails 100% GRATUITO e ILIMITADO (dentro de los 100 emails diarios de Google).** 📧✨
