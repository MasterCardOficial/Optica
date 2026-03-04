"""
EJEMPLO DE CONFIGURACIÓN
=========================

Copia este archivo como 'config.py' y completa con tus datos reales.
NO COMPARTAS config.py con nadie - contiene credenciales sensibles.
"""

# Google Sheets
SHEET_ID = '1n77pXmQH_OtUhTS-QY2YV3BdEtb6NxLlmR1V1cyyxGE'  # Tu ID de Google Sheet
SHEET_NAME = 'Citas'  # Nombre de la pestaña

# Email (Gmail SMTP)
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SENDER_EMAIL = 'tu_email@gmail.com'  # ⚠️ CAMBIAR por tu email
SENDER_PASSWORD = 'xxxx xxxx xxxx xxxx'  # ⚠️ CAMBIAR por contraseña de aplicación de Gmail
SENDER_NAME = 'Surtilentes Óptica'

# Configuración de envío
DELAY_BETWEEN_EMAILS = 2  # segundos entre cada email
DRY_RUN = False  # True = simula, no envía emails reales

# Ruta al archivo de credenciales de Google Cloud
CREDENTIALS_FILE = 'credentials.json'
