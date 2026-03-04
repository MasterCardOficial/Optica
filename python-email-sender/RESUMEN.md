# 🐍 SISTEMA DE EMAILS CON PYTHON - RESUMEN EJECUTIVO

## 🎯 ¿Qué es esto?

Un script Python que **automáticamente**:
1. Lee tu Google Sheet de citas
2. Encuentra citas sin email enviado
3. Genera emails HTML profesionales
4. Los envía usando tu Gmail
5. Marca las citas como procesadas

## ✅ VENTAJAS vs OTRAS SOLUCIONES

| Característica | Python + Gmail | Google Apps Script | EmailJS |
|----------------|----------------|-------------------|---------|
| **Costo** | 🟢 $0 Siempre | 🟢 $0 Siempre | 🔴 $0 → $15/mes |
| **Límite Emails** | 🟢 500/día | 🟡 100/día | 🔴 200/mes |
| **Requiere servidor** | 🟡 Opcional | 🟢 No | 🟢 No |
| **Control total** | 🟢 Sí | 🟡 Limitado | 🔴 No |
| **Personalizable** | 🟢 100% | 🟡 Parcial | 🔴 Limitado |
| **Automático** | 🟢 Sí (cron/task) | 🟡 Manual | 🟢 Sí |
| **Sin límites de pago** | 🟢 Sí | 🟢 Sí | 🔴 No |

**Resultado: Python + Gmail es la mejor opción para largo plazo** ✨

---

## 🚀 INICIO RÁPIDO (5 MINUTOS)

### **Opción A: Instalación Automática** (Recomendado)

1. Abre PowerShell en la carpeta `python-email-sender`
2. Ejecuta:
   ```bash
   .\setup.bat
   ```
3. Sigue las instrucciones en pantalla

### **Opción B: Instalación Manual**

```bash
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Probar conexión
python test_connection.py

# 3. Ejecutar script principal
python send_appointment_emails.py
```

---

## 📋 CHECKLIST DE CONFIGURACIÓN

### Antes de empezar:

- [ ] Python 3.11+ instalado
- [ ] Cuenta de Google Cloud (gratis)
- [ ] Gmail con verificación en 2 pasos

### Configuración de Google Cloud:

- [ ] Proyecto creado en Google Cloud Console
- [ ] Google Sheets API habilitada
- [ ] Google Drive API habilitada
- [ ] Cuenta de servicio creada
- [ ] `credentials.json` descargado
- [ ] Google Sheet compartido con cuenta de servicio

### Configuración de Gmail:

- [ ] Verificación en 2 pasos activada
- [ ] Contraseña de aplicación creada (16 caracteres)
- [ ] Email configurado en `send_appointment_emails.py`
- [ ] Contraseña configurada en el script

### Verificación:

- [ ] `python test_connection.py` pasa todas las pruebas
- [ ] Prueba con `DRY_RUN = True` funciona
- [ ] Email de prueba real enviado exitosamente
- [ ] Columna "Email Enviado" aparece en Sheet

---

## 📁 ARCHIVOS IMPORTANTES

```
python-email-sender/
│
├── 📄 send_appointment_emails.py   ← Script principal (ejecuta este)
├── 📄 test_connection.py           ← Test de configuración
├── 📄 setup.bat                    ← Instalador Windows
├── 📄 setup.sh                     ← Instalador Linux/Mac
│
├── 📋 requirements.txt             ← Dependencias Python
├── 📋 INSTRUCCIONES_SETUP.md       ← Guía completa paso a paso
├── 📋 README.md                    ← Documentación técnica
├── 📋 RESUMEN.md                   ← Este archivo
│
├── 🔒 credentials.json             ← (CREAR - Desde Google Cloud)
├── 🔒 .gitignore                   ← Protección de archivos sensibles
└── 📝 config_example.py            ← Ejemplo de configuración
```

---

## ⚙️ CONFIGURACIÓN DEL SCRIPT

Edita `send_appointment_emails.py`, líneas 30-40:

```python
# Tu Google Sheet
SHEET_ID = '1n77pXmQH_OtUhTS-QY2YV3BdEtb6NxLlmR1V1cyyxGE'
SHEET_NAME = 'Citas'

# Tu Gmail
SENDER_EMAIL = 'tu_email@gmail.com'          # ⚠️ CAMBIAR
SENDER_PASSWORD = 'xxxx xxxx xxxx xxxx'      # ⚠️ Contraseña de aplicación

# Configuración
DELAY_BETWEEN_EMAILS = 2  # Segundos entre cada email
DRY_RUN = False           # True = prueba sin enviar
```

---

## 🔄 AUTOMATIZACIÓN

### **Windows - Programador de Tareas:**

1. Busca: "Programador de tareas"
2. Crear tarea básica
3. Desencadenador: Cada 1 hora (o lo que prefieras)
4. Acción: `C:\Python311\python.exe`
5. Argumentos: Ruta completa del script

### **Linux/Mac - Cron Job:**

```bash
crontab -e
```

Agrega:
```bash
# Cada hora
0 * * * * /usr/bin/python3 /ruta/completa/send_appointment_emails.py
```

### **Servidor en la Nube (Opcional):**

- Heroku (gratis, hasta 550 horas/mes)
- PythonAnywhere (gratis, limitado)
- Google Cloud Run (gratis, hasta 2M requests/mes)
- Railway (gratis con limitaciones)

---

## 📊 CÓMO FUNCIONA (DIAGRAMA)

```
┌─────────────────┐
│  Cliente Web    │
│  (Agendar Cita) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Google Sheets  │ ← Cita guardada (columnas A-V)
│   (API Citas)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Script Python  │ ← Lee Sheet cada X tiempo
│   (gspread)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ¿Email enviado? │
│  (Columna W)    │
└────┬────────┬───┘
     │        │
   SI│        │NO
     │        ▼
     │   ┌─────────────┐
     │   │ Generar HTML│
     │   └──────┬──────┘
     │          │
     │          ▼
     │   ┌─────────────┐
     │   │ Enviar Email│ (Gmail SMTP)
     │   └──────┬──────┘
     │          │
     │          ▼
     │   ┌─────────────┐
     │   │Marcar "SI"  │ (Columna W)
     │   │  en Sheet   │
     │   └─────────────┘
     │
     └──► [SKIP - Ya procesada]
```

---

## 🎨 PERSONALIZACIÓN

### **Cambiar diseño del email:**

Edita `send_appointment_emails.py`, función `create_email_html()` (línea ~140)

### **Cambiar datos de contacto:**

Busca en el HTML del email (línea ~285):
- Teléfono
- WhatsApp
- Dirección
- Google Maps link

### **Agregar más campos:**

1. Agrega campo en el HTML del email
2. Pasa el dato en `appointment_data` (línea ~410)
3. Modifica el índice de columna si es necesario

---

## 📈 CAPACIDAD Y LÍMITES

| Cuenta Gmail | Emails/Día | Citas/Mes | Costo |
|--------------|-----------|-----------|-------|
| **Gmail Gratis** | 500 | ~15,000 | $0 |
| **Google Workspace** | 2,000 | ~60,000 | Desde $6/mes |

Para una óptica promedio (10-30 citas diarias), **Gmail gratuito es más que suficiente**.

---

## 🔐 SEGURIDAD - IMPORTANTE

### ⚠️ **NUNCA COMPARTAS:**
- `credentials.json` (tiene acceso a tu Sheet)
- Contraseña de aplicación de Gmail
- `config.py` (si lo creas)

### ✅ **ESTÁ PROTEGIDO:**
- `.gitignore` ya excluye archivos sensibles
- No se subirán a GitHub si usas Git

### 🛡️ **BUENAS PRÁCTICAS:**
- Usa contraseñas de aplicación, no tu contraseña real
- Revoca credenciales si las pierdes
- Solo comparte el Sheet con la cuenta de servicio
- Ejecuta el script en servidor seguro

---

## ❓ PREGUNTAS FRECUENTES

### **¿Cuánto cuesta?**
**$0 totalmente gratis.** Solo usas tu Gmail existente.

### **¿Necesito un servidor?**
No necesariamente. Puedes:
- Ejecutar manualmente cuando quieras
- Programar en tu PC (Programador de Tareas)
- Usar servidor en la nube (opcional)

### **¿Es seguro?**
Sí, siempre que:
- No compartas `credentials.json`
- Uses contraseñas de aplicación
- Mantengas las librerías actualizadas

### **¿Qué pasa si mi PC está apagada?**
Si programaste la tarea local, no se ejecutará. Soluciones:
- Deja la PC encendida
- Usa un servidor en la nube
- Ejecuta manualmente cuando enciendas la PC

### **¿Puedo enviar a múltiples hojas?**
Sí, modifica el script para leer múltiples hojas o sheets.

### **¿Puedo personalizar el email?**
Sí, edita la función `create_email_html()` con tu diseño.

---

## 🆘 SOPORTE

### Si algo no funciona:

1. **Ejecuta el test:**
   ```bash
   python test_connection.py
   ```

2. **Revisa los errores comunes:**
   - "No module named..." → `pip install -r requirements.txt`
   - "FileNotFoundError: credentials.json" → Descarga y coloca el archivo
   - "PERMISSION_DENIED" → Comparte Sheet con cuenta de servicio
   - "SMTP Authentication Error" → Verifica contraseña de aplicación

3. **Lee la documentación:**
   - `INSTRUCCIONES_SETUP.md` - Guía completa
   - `README.md` - Documentación técnica

4. **Revisa los logs:**
   El script imprime mensajes detallados de cada operación

---

## ✅ CONFIRMACIÓN FINAL

Antes de usar en producción, verifica:

```bash
# 1. Test de conexión pasa
python test_connection.py
✅ TODAS LAS PRUEBAS PASARON

# 2. Prueba sin enviar emails
# (DRY_RUN = True en el script)
python send_appointment_emails.py
⚠️ MODO DRY RUN ACTIVADO

# 3. Envía un email de prueba real
# (DRY_RUN = False, con tu email)
python send_appointment_emails.py
✅ Email enviado a: tu_email@gmail.com

# 4. Verifica en Google Sheets
# Columna W debe tener "SI" en la fila procesada
```

---

## 🎉 ¡LISTO PARA PRODUCCIÓN!

Si completaste todos los pasos, tu sistema está listo para:
- 📧 Enviar confirmaciones automáticas
- 📊 Procesar citas nuevas cada vez que se ejecuta
- 🔄 Automatizar con programador de tareas
- 📈 Escalar a miles de emails mensuales

**¡Felicidades! Tienes un sistema profesional de emails 100% gratis e ilimitado.** 🚀

---

## 📞 PRÓXIMOS PASOS RECOMENDADOS

1. **Configura automatización** (Programador de Tareas o cron)
2. **Monitorea los logs** durante los primeros días
3. **Ajusta `DELAY_BETWEEN_EMAILS`** si Gmail te marca spam
4. **Personaliza el diseño** del email con tu branding
5. **Considera servidor en la nube** si quieres 24/7 sin depender de tu PC

---

**Documentación creada:** Marzo 2026  
**Sistema:** Surtilentes Óptica  
**Tecnología:** Python 3.11+ | gspread | Gmail SMTP  
