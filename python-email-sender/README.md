# Sistema de Envío Automático de Emails - Surtilentes

Sistema profesional en Python para enviar confirmaciones de citas por email.

## 📁 Estructura

```
python-email-sender/
├── send_appointment_emails.py  # Script principal
├── requirements.txt            # Dependencias Python
├── config_example.py          # Ejemplo de configuración
├── INSTRUCCIONES_SETUP.md     # Guía completa de instalación
├── .gitignore                 # Protección archivos sensibles
└── credentials.json           # (Crear - credenciales Google Cloud)
```

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
cd python-email-sender
pip install -r requirements.txt
```

### 2. Configurar credenciales
- Sigue la guía completa en: **INSTRUCCIONES_SETUP.md**
- Crea `credentials.json` desde Google Cloud Console
- Configura email y contraseña en el script

### 3. Ejecutar
```bash
# Modo prueba (no envía emails reales)
python send_appointment_emails.py  # Con DRY_RUN = True

# Modo producción (envía emails reales)
# Cambia DRY_RUN = False en el script
python send_appointment_emails.py
```

## ✨ Características

- ✅ Lee Google Sheets automáticamente con `gspread`
- ✅ Envía emails HTML profesionales
- ✅ Marca filas procesadas (columna "Email Enviado")
- ✅ 100% gratuito e ilimitado (usa tu Gmail)
- ✅ Logs detallados de todas las operaciones
- ✅ Modo dry-run para pruebas seguras

## 📧 ¿Cómo funciona?

1. Script lee Google Sheet de citas
2. Busca filas sin email enviado
3. Genera email HTML con datos de la cita
4. Envía email usando Gmail SMTP
5. Marca fila como procesada
6. Siguiente ejecución solo procesa nuevas citas

## 🔧 Requisitos

- Python 3.11+
- Cuenta de Google Cloud (gratuita)
- Gmail con verificación en 2 pasos
- Contraseña de aplicación de Gmail

## 📖 Documentación Completa

**👉 Lee INSTRUCCIONES_SETUP.md para configuración paso a paso**

## 🔐 Seguridad

- `credentials.json` y `config.py` están en `.gitignore`
- Nunca compartas estos archivos
- Usa contraseñas de aplicación, no tu contraseña real

## 💡 Soporte

Si encuentras errores:
1. Revisa los logs en la terminal
2. Verifica credenciales en Google Cloud Console
3. Confirma que el Sheet esté compartido con la cuenta de servicio
4. Lee la sección "Solución de Problemas" en INSTRUCCIONES_SETUP.md
