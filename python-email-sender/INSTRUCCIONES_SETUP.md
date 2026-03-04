# 🐍 SISTEMA DE EMAILS CON PYTHON - CONFIGURACIÓN COMPLETA

## 📋 VENTAJAS DE ESTA SOLUCIÓN

✅ **100% GRATUITO** - Sin costos de servicios externos  
✅ **ILIMITADO** - Sin límites artificiales de servicios de pago  
✅ **AUTOMÁTICO** - Envía emails a todas las citas pendientes  
✅ **PERSISTENTE** - Marca las citas ya procesadas  
✅ **PROFESIONAL** - Emails HTML con diseño responsive  
✅ **CONTROL TOTAL** - Todo el código es tuyo  

---

## 🚀 PASO 1: INSTALAR PYTHON

### **Si NO tienes Python:**

1. Ve a: https://www.python.org/downloads/
2. Descarga **Python 3.11** o superior
3. Durante la instalación: ✅ **"Add Python to PATH"**
4. Verifica la instalación:
   ```bash
   python --version
   ```
   Debería mostrar: `Python 3.11.x` o superior

---

## 📦 PASO 2: INSTALAR DEPENDENCIAS

Abre una terminal (PowerShell o CMD) en la carpeta `python-email-sender`:

```bash
cd "C:\Users\jose\Downloads\optica-pagina-master\python-email-sender"
```

Instala las librerías necesarias:

```bash
pip install -r requirements.txt
```

Esto instalará:
- `gspread` - Para conectar con Google Sheets
- `google-auth` - Para autenticación con Google
- Otros paquetes necesarios

---

## 🔑 PASO 3: CREAR CREDENCIALES DE GOOGLE CLOUD

Para que Python pueda leer tu Google Sheet, necesitas crear una **cuenta de servicio**:

### **3.1 Ir a Google Cloud Console**

1. Ve a: https://console.cloud.google.com/
2. Inicia sesión con tu cuenta de Google

### **3.2 Crear un Proyecto Nuevo**

1. Haz clic en el selector de proyectos (arriba a la izquierda)
2. Clic en **"Nuevo Proyecto"**
3. Nombre: `Surtilentes Email System`
4. Clic en **"Crear"**
5. Espera unos segundos y selecciona el proyecto creado

### **3.3 Habilitar Google Sheets API**

1. En el menú lateral → **"APIs y servicios"** → **"Biblioteca"**
2. Busca: `Google Sheets API`
3. Clic en **"Google Sheets API"**
4. Clic en **"Habilitar"**
5. Repite para: `Google Drive API` (también habilítala)

### **3.4 Crear Cuenta de Servicio**

1. En el menú lateral → **"APIs y servicios"** → **"Credenciales"**
2. Clic en **"+ CREAR CREDENCIALES"** → **"Cuenta de servicio"**
3. Nombre: `surtilentes-email-bot`
4. ID: (se genera automáticamente)
5. Clic en **"Crear y continuar"**
6. Rol: Selecciona **"Editor"**
7. Clic en **"Continuar"** → **"Listo"**

### **3.5 Descargar Archivo JSON de Credenciales**

1. En la lista de cuentas de servicio, haz clic en la que acabas de crear
2. Ve a la pestaña **"Claves"**
3. Clic en **"Agregar clave"** → **"Crear clave nueva"**
4. Tipo: **JSON**
5. Clic en **"Crear"**
6. Se descargará un archivo `.json`

### **3.6 Mover el Archivo JSON**

1. Renombra el archivo descargado a: `credentials.json`
2. Muévelo a la carpeta: `python-email-sender/`
3. Debe quedar en: `python-email-sender/credentials.json`

### **3.7 Compartir Google Sheet con la Cuenta de Servicio**

1. Abre el archivo `credentials.json` con Notepad
2. Busca el campo `"client_email"`, se verá algo así:
   ```json
   "client_email": "surtilentes-email-bot@project-123456.iam.gserviceaccount.com"
   ```
3. **Copia ese email completo**
4. Abre tu Google Sheet de citas
5. Clic en **"Compartir"** (arriba a la derecha)
6. Pega el email de la cuenta de servicio
7. Permisos: **"Editor"**
8. Desmarca: ❌ "Notificar a las personas"
9. Clic en **"Compartir"**

**¡Listo!** Python ahora puede leer y escribir en tu Google Sheet.

---

## 📧 PASO 4: CONFIGURAR GMAIL PARA ENVIAR EMAILS

### **4.1 Habilitar Verificación en 2 Pasos**

1. Ve a: https://myaccount.google.com/security
2. En "Acceso a Google" → **"Verificación en 2 pasos"**
3. Si no está activada, actívala (sigue los pasos)

### **4.2 Crear Contraseña de Aplicación**

1. Ve a: https://myaccount.google.com/apppasswords
2. Nombre: `Surtilentes Email System`
3. Clic en **"Crear"**
4. Google generará una contraseña de 16 caracteres: `xxxx xxxx xxxx xxxx`
5. **Cópiala** (solo se muestra una vez)

### **4.3 Configurar el Script**

Abre el archivo: `send_appointment_emails.py`

Busca estas líneas (líneas 33-36):

```python
SENDER_EMAIL = 'tu_email@gmail.com'  # ⚠️ CAMBIAR
SENDER_PASSWORD = 'tu_contraseña_app'  # ⚠️ CAMBIAR
```

Cámbialas por:

```python
SENDER_EMAIL = 'jose@gmail.com'  # Tu email real
SENDER_PASSWORD = 'xxxx xxxx xxxx xxxx'  # La contraseña de 16 caracteres
```

**Guarda el archivo** (Ctrl+S)

---

## ✅ PASO 5: PROBAR EL SISTEMA

### **5.1 Modo Prueba (Dry Run)**

Primero, prueba sin enviar emails reales:

En `send_appointment_emails.py`, línea 38, verifica que diga:

```python
DRY_RUN = True  # True = no envía emails, solo simula
```

Ejecuta el script:

```bash
python send_appointment_emails.py
```

Deberías ver:

```
============================================================
SISTEMA DE ENVÍO AUTOMÁTICO DE EMAILS
Surtilentes Óptica - Sistema de Confirmación de Citas
============================================================

⚠️ MODO DRY RUN ACTIVADO - No se enviarán emails reales

[2026-03-03 10:30:45] [INFO] Conectando a Google Sheets...
[2026-03-03 10:30:46] [INFO] ✅ Conectado exitosamente a Google Sheets
[2026-03-03 10:30:46] [INFO] Obteniendo todas las filas de la hoja...
[2026-03-03 10:30:47] [INFO] 📊 Total de citas encontradas: 5
[2026-03-03 10:30:47] [INFO] 📧 Procesando fila 2: Juan Pérez (juan@gmail.com)
[2026-03-03 10:30:47] [INFO] [DRY RUN] Simularía envío a: juan@gmail.com
...
```

Si ves esto, **¡funcionó correctamente!**

### **5.2 Enviar Emails Reales**

Cambia la línea 38 a:

```python
DRY_RUN = False  # Ahora SÍ enviará emails
```

Ejecuta de nuevo:

```bash
python send_appointment_emails.py
```

Los emails se enviarán automáticamente. Verás:

```
[2026-03-03 10:35:10] [SUCCESS] ✅ Email enviado a: juan@gmail.com
```

### **5.3 Verificar en Google Sheets**

Abre tu Google Sheet. Verás que se agregó una columna **"Email Enviado"** (columna W) con "SI" en las filas procesadas.

---

## 🔄 PASO 6: AUTOMATIZAR EL ENVÍO

### **Opción A: Ejecutar Manualmente**

Cada vez que quieras enviar emails a las citas nuevas:

```bash
python send_appointment_emails.py
```

El script solo envía a las que NO tienen "SI" en la columna "Email Enviado".

### **Opción B: Automatizar con Programador de Tareas (Windows)**

1. Busca: **"Programador de tareas"** en Windows
2. Clic derecho → **"Crear tarea básica"**
3. Nombre: `Enviar Emails Citas Surtilentes`
4. Desencadenador: **"Diariamente"** o **"Cada X horas"**
5. Acción: **"Iniciar un programa"**
6. Programa: Ruta de Python (ejemplo: `C:\Python311\python.exe`)
7. Argumentos: Ruta completa del script:
   ```
   "C:\Users\jose\Downloads\optica-pagina-master\python-email-sender\send_appointment_emails.py"
   ```
8. **Finalizar**

Ahora el script se ejecutará automáticamente cada X tiempo.

### **Opción C: Servidor Linux/VPS (Avanzado)**

Si tienes un servidor, crea un cron job:

```bash
crontab -e
```

Agrega:

```bash
# Ejecutar cada hora
0 * * * * /usr/bin/python3 /ruta/al/script/send_appointment_emails.py >> /var/log/surtilentes_emails.log 2>&1
```

---

## 📊 CÓMO FUNCIONA

1. **Cliente agenda cita** en tu sitio web
2. **Datos se guardan** en Google Sheets (columnas A-V)
3. **Script Python lee** la hoja cada vez que se ejecuta
4. **Busca citas sin email enviado** (columna W vacía o sin "SI")
5. **Genera email HTML profesional** con los datos de la cita
6. **Envía el email** usando tu Gmail
7. **Marca la fila como procesada** (escribe "SI" en columna W)
8. **Siguiente ejecución** solo procesa filas nuevas

---

## 🔧 PERSONALIZACIÓN

### **Cambiar diseño del email:**

Edita la función `create_email_html()` en línea 141 del script.

### **Cambiar tiempo entre emails:**

Línea 37:
```python
DELAY_BETWEEN_EMAILS = 2  # segundos entre cada email
```

### **Cambiar información de contacto:**

Busca en el HTML del email (línea 240-260) y modifica teléfonos, dirección, etc.

---

## ❓ SOLUCIÓN DE PROBLEMAS

### **"No module named 'gspread'"**
```bash
pip install -r requirements.txt
```

### **"FileNotFoundError: credentials.json"**
- Verifica que `credentials.json` esté en la carpeta `python-email-sender/`
- Asegúrate de ejecutar el script desde la carpeta correcta

### **"SMTP Authentication Error"**
- Verifica que `SENDER_EMAIL` sea correcto
- Verifica que `SENDER_PASSWORD` sea la contraseña de aplicación (16 caracteres)
- Confirma que la verificación en 2 pasos esté activada

### **"Permission denied" al escribir en Sheet**
- Compartiste el Sheet con el email de la cuenta de servicio?
- Tiene permisos de "Editor"?

### **"No se encontraron citas"**
- Verifica que el nombre de la pestaña sea correcto: `SHEET_NAME = 'Citas'`
- Verifica que el SHEET_ID sea correcto

---

## 📈 LÍMITES Y CAPACIDAD

- **Gmail gratuito**: ~500 emails por día
- **Google Workspace**: ~2,000 emails por día
- **Sin límites artificiales** de servicios de terceros
- **100% gratis** - solo usa tu cuenta de Gmail existente

---

## 🔐 SEGURIDAD

⚠️ **IMPORTANTE**:
- NO compartas `credentials.json` con nadie
- NO subas `credentials.json` a Git/GitHub
- NO compartas tu contraseña de aplicación
- El archivo `.gitignore` ya protege estos archivos

---

## ✅ CHECKLIST FINAL

- [ ] Python 3.11+ instalado
- [ ] Dependencias instaladas (`pip install -r requirements.txt`)
- [ ] Proyecto de Google Cloud creado
- [ ] Google Sheets API habilitada
- [ ] Google Drive API habilitada
- [ ] Cuenta de servicio creada
- [ ] `credentials.json` descargado y en la carpeta correcta
- [ ] Google Sheet compartido con email de cuenta de servicio
- [ ] Verificación en 2 pasos activada en Gmail
- [ ] Contraseña de aplicación creada
- [ ] `SENDER_EMAIL` y `SENDER_PASSWORD` configurados en el script
- [ ] Prueba con `DRY_RUN = True` exitosa
- [ ] Prueba con `DRY_RUN = False` exitosa
- [ ] Columna "Email Enviado" aparece en Google Sheet

---

**¡LISTO! Ahora tienes un sistema profesional, gratuito e ilimitado de envío de emails.** 🎉
