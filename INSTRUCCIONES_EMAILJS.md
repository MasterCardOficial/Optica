# 📧 CONFIGURACIÓN DE EMAILJS PARA EMAILS AUTOMÁTICOS

## ¿Qué es EmailJS?
EmailJS permite enviar emails directamente desde JavaScript sin necesidad de un servidor backend. Es **gratuito** hasta 200 emails por mes.

---

## 🚀 PASO 1: Crear Cuenta en EmailJS

1. Ve a: **https://www.emailjs.com/**
2. Haz clic en **"Sign Up"** (Registrarse)
3. Puedes registrarte con:
   - Correo electrónico
   - Google
   - GitHub
4. Verifica tu email si te piden confirmación

---

## 📬 PASO 2: Conectar tu Servicio de Email

1. Una vez dentro del dashboard, ve a **"Email Services"** en el menú izquierdo
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor de email:
   - **Gmail** (recomendado - más fácil)
   - Outlook
   - Yahoo
   - Otros
4. Sigue las instrucciones para conectar tu cuenta:
   - Para Gmail: te pedirá autorizar con tu cuenta de Google
   - Elige el email desde el cual se enviarán las confirmaciones
5. Guarda el **Service ID** que aparece (ejemplo: `service_xxxxxxx`)

---

## 📝 PASO 3: Crear Template de Email

1. En el menú izquierdo, ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Configura el template con estos campos:

### **Asunto del email:**
```
Confirmación de Cita - {{appointment_number}} | Surtilentes Óptica
```

### **Contenido del email (HTML):**

Copia y pega este código completo:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4f8; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                👓 Surtilentes Óptica
              </h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 14px;">
                Tu visión es nuestro compromiso
              </p>
            </td>
          </tr>
          
          <!-- Badge -->
          <tr>
            <td style="padding: 30px 30px 20px; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 30px; border-radius: 50px; font-weight: 700; font-size: 16px;">
                ✓ CITA CONFIRMADA
              </div>
            </td>
          </tr>
          
          <!-- Saludo -->
          <tr>
            <td style="padding: 0 30px 20px; text-align: center;">
              <h2 style="margin: 0; color: #1e3a8a; font-size: 24px;">
                ¡Hola, {{to_name}}!
              </h2>
              <p style="margin: 10px 0 0; color: #64748b; font-size: 16px;">
                Tu cita ha sido agendada exitosamente
              </p>
            </td>
          </tr>
          
          <!-- Detalles -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 25px; border: 2px solid #0ea5e9;">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td width="40%" style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          📋 Número de Cita:
                        </td>
                        <td style="color: #1e3a8a; font-weight: 700; font-size: 16px;">
                          {{appointment_number}}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          📅 Fecha:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          {{appointment_date}}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          🕐 Hora:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          {{appointment_time}}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          🔬 Servicio:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          {{service_name}}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          💰 Precio:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          {{service_price}}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Recordatorios -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 12px; color: #92400e; font-size: 16px;">
                  ⚠️ Recordatorios Importantes
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                  <li>Llegue <strong>10 minutos antes</strong> de su cita</li>
                  <li>Traiga su documento de identidad</li>
                  <li>Si usa gafas o lentes, tráigalos</li>
                  <li>Si tiene fórmula anterior, preséntela</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Ubicación -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                <h3 style="margin: 0 0 15px; color: #1e3a8a; font-size: 18px;">
                  📍 Nuestra Ubicación
                </h3>
                <p style="margin: 0 0 10px; color: #334155; font-size: 15px;">
                  <strong>{{location_name}}</strong><br>
                  {{location_address}}
                </p>
                <a href="{{maps_link}}" style="display: inline-block; margin-top: 15px; padding: 12px 30px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 14px;">
                  🗺️ Ver en Google Maps
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Contacto -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="text-align: center; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">📞</div>
                    <div style="color: #64748b; font-size: 12px; margin-bottom: 5px;">Teléfono</div>
                    <a href="tel:{{location_phone}}" style="color: #1e3a8a; font-weight: 700; text-decoration: none; font-size: 14px;">
                      {{location_phone}}
                    </a>
                  </td>
                  <td width="50%" style="text-align: center; padding: 15px; background: #ecfdf5; border-radius: 8px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">💬</div>
                    <div style="color: #64748b; font-size: 12px; margin-bottom: 5px;">WhatsApp</div>
                    <a href="https://wa.me/{{location_whatsapp}}" style="color: #059669; font-weight: 700; text-decoration: none; font-size: 14px;">
                      {{location_whatsapp}}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 25px 30px; text-align: center;">
              <p style="margin: 0 0 10px; color: #e0e7ff; font-size: 14px;">
                ¡Gracias por confiar en Surtilentes Óptica!
              </p>
              <p style="margin: 0; color: #bfdbfe; font-size: 12px;">
                © {{current_year}} Surtilentes Óptica - Cartagena, Colombia
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### **Configuración adicional:**
- **From Email:** Deja el predeterminado (tu email conectado)
- **From Name:** `Surtilentes Óptica`
- **Reply To:** Tu email de contacto
- **BCC:** (opcional) si quieres recibir copia de cada email

4. Haz clic en **"Save"**
5. Guarda el **Template ID** que aparece (ejemplo: `template_xxxxxxx`)

---

## 🔑 PASO 4: Obtener tu Public Key

1. En el menú izquierdo, ve a **"Account"**
2. Busca la sección **"API Keys"**
3. Copia tu **Public Key** (ejemplo: `xxxxxxxxxxxxxx`)

---

## ⚙️ PASO 5: Configurar el Código

Abre el archivo: `assets/js/services/email-service.js`

Busca esta sección al inicio del archivo:

```javascript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'TU_PUBLIC_KEY_AQUI',
  SERVICE_ID: 'TU_SERVICE_ID_AQUI',
  TEMPLATE_ID: 'TU_TEMPLATE_ID_AQUI'
};
```

Reemplaza con tus credenciales:

```javascript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'tu_public_key_de_emailjs',
  SERVICE_ID: 'service_xxxxxxx',
  TEMPLATE_ID: 'template_xxxxxxx'
};
```

**Guarda el archivo.**

---

## 🧪 PASO 6: Probar el Sistema

1. Abre tu sitio web en el navegador
2. Ve a la página de **Agendar Cita**
3. Abre la **Consola del navegador** (F12 → Console)
4. Escribe y ejecuta:
   ```javascript
   testEmailService()
   ```
5. **ANTES de ejecutar**, edita en `email-service.js` la línea 188 con tu email real:
   ```javascript
   email: 'tu-email@gmail.com', // CAMBIA ESTO
   ```

6. Si todo está bien configurado, recibirás un email de prueba en unos segundos
7. Revisa tu **bandeja de entrada** y también **Spam/Correo no deseado**

---

## ✅ Verificación Final

Para confirmar que funciona correctamente:

1. Ve a tu sitio web
2. Navega a **Agendar Cita**
3. Completa el formulario con tus datos reales
4. Usa tu propio email
5. Confirma la cita
6. En unos segundos deberías recibir el email de confirmación

---

## ❓ Solución de Problemas

### "EmailJS no configurado"
- Verifica que copiaste bien el PUBLIC_KEY, SERVICE_ID y TEMPLATE_ID
- No debe haber espacios ni comillas extra

### "Error al enviar email"
- Revisa la consola del navegador para ver el error específico
- Verifica que el servicio de email esté activo en el dashboard de EmailJS
- Confirma que el template existe y está guardado

### "Email no llega"
1. Revisa la carpeta de **Spam/Correo no deseado**
2. Ve al dashboard de EmailJS → "Email History" para ver si se envió
3. Verifica que el email del destinatario esté correcto

### "Cuota excedida"
- El plan gratuito permite 200 emails/mes
- Puedes ver el uso en el dashboard de EmailJS
- Si necesitas más, considera el plan de pago ($15/mes para 1000 emails)

---

## 📊 Límites del Plan Gratuito

- ✅ **200 emails por mes**
- ✅ Sin tarjeta de crédito requerida
- ✅ Soporte para plantillas HTML
- ✅ EmailJS branding en los emails (removible en plan pago)

---

## 🔐 Seguridad

- ✅ Las credenciales se usan solo en el navegador
- ✅ EmailJS protege contra spam
- ✅ Puedes limitar dominios permitidos en el dashboard
- ✅ Los datos no se almacenan en EmailJS

---

## 📞 Soporte

- **Documentación oficial:** https://www.emailjs.com/docs/
- **FAQ:** https://www.emailjs.com/docs/faq/
- **Soporte:** support@emailjs.com

---

**¡Listo! Ahora tu sistema enviará emails automáticos de confirmación cuando alguien agende una cita.** 📧✨
