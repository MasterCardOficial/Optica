"""
SISTEMA DE ENVÍO AUTOMÁTICO DE EMAILS - SURTILENTES ÓPTICA
============================================================

Este script lee las citas desde Google Sheets y envía emails de confirmación
automáticamente. Marca en la hoja las filas ya procesadas.

CARACTERÍSTICAS:
- 100% GRATUITO usando Gmail SMTP
- Ilimitado (según tu cuenta de Gmail)
- Lee automáticamente desde Google Sheets
- Envía emails HTML profesionales
- Marca citas como "Email Enviado"
- Registra logs de todas las operaciones

AUTOR: Sistema Surtilentes
FECHA: Marzo 2026
"""

import gspread
from google.oauth2.service_account import Credentials
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import time
import sys

# ========================================
# CONFIGURACIÓN
# ========================================

# Google Sheets
SHEET_ID = '1n77pXmQH_OtUhTS-QY2YV3BdEtb6NxLlmR1V1cyyxGE'
SHEET_NAME = 'Citas'

# Email (Gmail SMTP)
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SENDER_EMAIL = 'tu_email@gmail.com'  # ⚠️ CAMBIAR
SENDER_PASSWORD = 'tu_contraseña_app'  # ⚠️ CAMBIAR (contraseña de aplicación)
SENDER_NAME = 'Surtilentes Óptica'

# Configuración de envío
DELAY_BETWEEN_EMAILS = 2  # segundos entre cada email (para evitar spam)
DRY_RUN = False  # True = no envía emails, solo simula

# Ruta al archivo de credenciales de Google
CREDENTIALS_FILE = 'credentials.json'

# ========================================
# ÍNDICES DE COLUMNAS (basado en tu estructura)
# ========================================
COL_TIMESTAMP = 0      # A
COL_TIPO_DOC = 1       # B
COL_CEDULA = 2         # C
COL_NUM_CITA = 3       # D
COL_NOMBRE = 4         # E
COL_FECHA_NAC = 5      # F
COL_TELEFONO = 6       # G
COL_EMAIL = 7          # H
COL_DIRECCION = 8      # I
COL_CIUDAD = 9         # J
COL_SERVICIO = 10      # K
COL_PRECIO = 11        # L
COL_DURACION = 12      # M
COL_FECHA_CITA = 13    # N
COL_HORA = 14          # O
COL_PRIMERA_VEZ = 15   # P
COL_USA_LENTES = 16    # Q
COL_FORMULA = 17       # R
COL_MOTIVO = 18        # S
COL_NOTAS = 19         # T
COL_ESTADO = 20        # U
COL_FECHA_CREACION = 21  # V
COL_EMAIL_ENVIADO = 22  # W (nueva columna para marcar)

MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

# ========================================
# FUNCIONES AUXILIARES
# ========================================

def log(message, level='INFO'):
    """Imprime mensaje con timestamp"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{timestamp}] [{level}] {message}")
    
def format_date(date_string):
    """Convierte fecha DD/MM/YYYY a formato legible"""
    try:
        if '/' in date_string:
            parts = date_string.split('/')
            day = int(parts[0])
            month = int(parts[1]) - 1  # 0-indexed
            year = parts[2]
            return f"{day} de {MONTHS[month]} de {year}"
    except:
        return date_string
    return date_string

# ========================================
# CONEXIÓN A GOOGLE SHEETS
# ========================================

def connect_to_sheets():
    """Conecta a Google Sheets usando credenciales de servicio"""
    try:
        log("Conectando a Google Sheets...")
        
        # Definir alcances (scopes)
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        
        # Cargar credenciales
        creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
        
        # Autorizar cliente
        client = gspread.authorize(creds)
        
        # Abrir hoja
        sheet = client.open_by_key(SHEET_ID).worksheet(SHEET_NAME)
        
        log("✅ Conectado exitosamente a Google Sheets")
        return sheet
        
    except FileNotFoundError:
        log(f"❌ ERROR: No se encontró el archivo '{CREDENTIALS_FILE}'", 'ERROR')
        log("Debes descargar las credenciales desde Google Cloud Console", 'ERROR')
        sys.exit(1)
    except Exception as e:
        log(f"❌ ERROR al conectar a Google Sheets: {str(e)}", 'ERROR')
        sys.exit(1)

# ========================================
# ENVÍO DE EMAILS
# ========================================

def create_email_html(appointment_data):
    """Genera el HTML del email de confirmación"""
    
    html = f"""
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
                ¡Hola, {appointment_data['nombre']}!
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
                  <td>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td width="40%" style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          📋 Número de Cita:
                        </td>
                        <td style="color: #1e3a8a; font-weight: 700; font-size: 16px;">
                          {appointment_data['numero_cita']}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          📅 Fecha:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          {appointment_data['fecha_formateada']}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          🕐 Hora:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          {appointment_data['hora']}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          🔬 Servicio:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          {appointment_data['servicio']}
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
                  <li>Llegue <strong>10 minutos antes</strong></li>
                  <li>Traiga documento de identidad</li>
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
                  <strong>SURTILENTES ÓPTICA</strong><br>
                  Carrera 9 #25-48<br>
                  Centro Histórico, Cartagena
                </p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=Optica+Surtilentes+Cartagena" style="display: inline-block; margin-top: 15px; padding: 12px 30px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 14px;">
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
                    <div style="color: #1e3a8a; font-weight: 700; font-size: 14px;">
                      +57 (5) 664-2580
                    </div>
                  </td>
                  <td width="50%" style="text-align: center; padding: 15px; background: #ecfdf5; border-radius: 8px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">💬</div>
                    <div style="color: #64748b; font-size: 12px; margin-bottom: 5px;">WhatsApp</div>
                    <div style="color: #059669; font-weight: 700; font-size: 14px;">
                      +57 310 555 1234
                    </div>
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
                © 2026 Surtilentes Óptica - Cartagena, Colombia
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    """
    
    return html

def send_email(to_email, subject, html_body):
    """Envía un email usando Gmail SMTP"""
    
    if DRY_RUN:
        log(f"[DRY RUN] Simularía envío a: {to_email}", 'INFO')
        return True
    
    try:
        # Crear mensaje
        msg = MIMEMultipart('alternative')
        msg['From'] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Adjuntar HTML
        html_part = MIMEText(html_body, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Conectar a servidor SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
        
        log(f"✅ Email enviado a: {to_email}", 'SUCCESS')
        return True
        
    except smtplib.SMTPAuthenticationError:
        log(f"❌ ERROR de autenticación. Verifica email y contraseña de aplicación", 'ERROR')
        return False
    except Exception as e:
        log(f"❌ ERROR al enviar email a {to_email}: {str(e)}", 'ERROR')
        return False

# ========================================
# PROCESAMIENTO PRINCIPAL
# ========================================

def process_appointments(sheet):
    """Procesa todas las citas y envía emails pendientes"""
    
    log("Obteniendo todas las filas de la hoja...")
    all_rows = sheet.get_all_values()
    
    # Primera fila es encabezados
    headers = all_rows[0]
    appointments = all_rows[1:]  # Datos desde fila 2
    
    log(f"📊 Total de citas encontradas: {len(appointments)}")
    
    # Verificar si existe columna "Email Enviado"
    if len(headers) <= COL_EMAIL_ENVIADO:
        log("⚠️ Agregando columna 'Email Enviado' a la hoja...")
        sheet.update_cell(1, COL_EMAIL_ENVIADO + 1, 'Email Enviado')
    
    emails_sent = 0
    emails_skipped = 0
    emails_failed = 0
    
    for idx, row in enumerate(appointments, start=2):  # start=2 porque fila 1 es headers
        
        # Verificar que la fila tenga datos suficientes
        if len(row) < COL_EMAIL + 1:
            continue
        
        email = row[COL_EMAIL].strip() if len(row) > COL_EMAIL else ''
        
        # Saltar si no hay email
        if not email or '@' not in email:
            continue
        
        # Verificar si ya se envió email
        email_status = row[COL_EMAIL_ENVIADO] if len(row) > COL_EMAIL_ENVIADO else ''
        if email_status == 'SI' or email_status == 'Enviado':
            emails_skipped += 1
            continue
        
        # Extraer datos de la cita
        appointment_data = {
            'nombre': row[COL_NOMBRE] if len(row) > COL_NOMBRE else 'Cliente',
            'numero_cita': row[COL_NUM_CITA] if len(row) > COL_NUM_CITA else 'N/A',
            'fecha_cita': row[COL_FECHA_CITA] if len(row) > COL_FECHA_CITA else '',
            'fecha_formateada': format_date(row[COL_FECHA_CITA] if len(row) > COL_FECHA_CITA else ''),
            'hora': row[COL_HORA] if len(row) > COL_HORA else 'N/A',
            'servicio': row[COL_SERVICIO] if len(row) > COL_SERVICIO else 'N/A',
            'email': email
        }
        
        log(f"📧 Procesando fila {idx}: {appointment_data['nombre']} ({email})")
        
        # Generar HTML
        html_body = create_email_html(appointment_data)
        subject = f"✓ Cita Confirmada - {appointment_data['numero_cita']} | Surtilentes Óptica"
        
        # Enviar email
        success = send_email(email, subject, html_body)
        
        if success:
            # Marcar como enviado en la hoja
            try:
                sheet.update_cell(idx, COL_EMAIL_ENVIADO + 1, 'SI')
                emails_sent += 1
            except Exception as e:
                log(f"⚠️ Error al marcar fila {idx}: {str(e)}", 'WARN')
        else:
            emails_failed += 1
        
        # Esperar entre emails para evitar ser detectado como spam
        time.sleep(DELAY_BETWEEN_EMAILS)
    
    # Resumen
    log("")
    log("=" * 60)
    log("RESUMEN DE ENVÍO")
    log("=" * 60)
    log(f"✅ Emails enviados exitosamente: {emails_sent}")
    log(f"⏭️  Emails omitidos (ya enviados): {emails_skipped}")
    log(f"❌ Emails fallidos: {emails_failed}")
    log(f"📊 Total procesado: {len(appointments)} filas")
    log("=" * 60)

# ========================================
# MAIN
# ========================================

def main():
    """Función principal"""
    
    log("=" * 60)
    log("SISTEMA DE ENVÍO AUTOMÁTICO DE EMAILS")
    log("Surtilentes Óptica - Sistema de Confirmación de Citas")
    log("=" * 60)
    log("")
    
    if DRY_RUN:
        log("⚠️ MODO DRY RUN ACTIVADO - No se enviarán emails reales", 'WARN')
        log("")
    
    # Conectar a Google Sheets
    sheet = connect_to_sheets()
    
    # Procesar citas y enviar emails
    process_appointments(sheet)
    
    log("")
    log("✅ Proceso completado")

if __name__ == "__main__":
    main()
