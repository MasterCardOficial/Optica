#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Configuración Interactiva
Sistema de Emails Automáticos - Surtilentes Óptica
"""

import os
import sys
import json
import getpass
from pathlib import Path

def print_header(text):
    """Imprime un encabezado destacado"""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def print_step(number, text):
    """Imprime un paso numerado"""
    print(f"\n🔹 PASO {number}: {text}")
    print("-" * 60)

def print_success(text):
    """Imprime un mensaje de éxito"""
    print(f"✅ {text}")

def print_error(text):
    """Imprime un mensaje de error"""
    print(f"❌ {text}")

def print_warning(text):
    """Imprime una advertencia"""
    print(f"⚠️  {text}")

def check_credentials_file():
    """Verifica si existe el archivo credentials.json"""
    cred_path = Path(__file__).parent / 'credentials.json'
    if cred_path.exists():
        try:
            with open(cred_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                client_email = data.get('client_email', 'No encontrado')
                print_success(f"Archivo credentials.json encontrado")
                print(f"   📧 Email de servicio: {client_email}")
                return True, client_email
        except Exception as e:
            print_error(f"Error al leer credentials.json: {e}")
            return False, None
    return False, None

def configure_gmail():
    """Configura las credenciales de Gmail"""
    print("\n📨 CONFIGURACIÓN DE GMAIL SMTP")
    print("\nPara enviar emails, necesitas:")
    print("  1. Una cuenta de Gmail")
    print("  2. Activar verificación en 2 pasos")
    print("  3. Crear una contraseña de aplicación\n")
    
    has_gmail = input("¿Ya tienes una cuenta de Gmail activa? (s/n): ").strip().lower()
    if has_gmail != 's':
        print_warning("Necesitas una cuenta de Gmail. Créala en gmail.com")
        return None, None
    
    email = input("\n✉️  Ingresa tu email de Gmail: ").strip()
    
    print("\n🔐 CONTRASEÑA DE APLICACIÓN (NO tu contraseña normal)")
    print("\nSigue estos pasos:")
    print("  1. Ve a: https://myaccount.google.com/security")
    print("  2. Activa 'Verificación en 2 pasos' si no está activada")
    print("  3. Ve a: https://myaccount.google.com/apppasswords")
    print("  4. Crear contraseña de aplicación → Nombre: 'Surtilentes'")
    print("  5. Copia la contraseña de 16 caracteres (ejemplo: abcd efgh ijkl mnop)")
    
    input("\n⏸️  Presiona ENTER cuando hayas creado la contraseña de aplicación...")
    
    app_password = getpass.getpass("\n🔑 Pega aquí la contraseña de aplicación (16 caracteres): ").strip()
    
    if len(app_password.replace(' ', '')) < 16:
        print_error("La contraseña parece incorrecta. Debe tener 16 caracteres.")
        return None, None
    
    return email, app_password

def update_script_config(email, password):
    """Actualiza el archivo send_appointment_emails.py con las credenciales"""
    script_path = Path(__file__).parent / 'send_appointment_emails.py'
    
    try:
        with open(script_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Reemplazar email
        content = content.replace(
            "SENDER_EMAIL = 'tu_email@gmail.com'",
            f"SENDER_EMAIL = '{email}'"
        )
        
        # Reemplazar contraseña
        content = content.replace(
            "SENDER_PASSWORD = 'tu_contraseña_app'",
            f"SENDER_PASSWORD = '{password}'"
        )
        
        # Cambiar DRY_RUN a True por defecto para pruebas
        if "DRY_RUN = False" in content:
            content = content.replace("DRY_RUN = False", "DRY_RUN = True")
        
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print_success("Configuración guardada en send_appointment_emails.py")
        return True
    except Exception as e:
        print_error(f"Error al actualizar configuración: {e}")
        return False

def main():
    """Función principal del setup interactivo"""
    os.system('cls' if os.name == 'nt' else 'clear')
    
    print_header("🚀 CONFIGURACIÓN AUTOMÁTICA - SISTEMA DE EMAILS")
    print("Sistema de envío automático de confirmaciones de citas")
    print("Surtilentes Óptica - Cartagena\n")
    
    # PASO 1: Verificar dependencias
    print_step(1, "Verificar dependencias de Python")
    try:
        import gspread
        from google.oauth2.service_account import Credentials
        print_success("Librerías instaladas correctamente (gspread, google-auth)")
    except ImportError as e:
        print_error(f"Falta instalar librerías: {e}")
        print("\n💡 Ejecuta: pip install gspread google-auth google-auth-oauthlib google-auth-httplib2")
        return
    
    # PASO 2: Verificar credentials.json
    print_step(2, "Verificar credenciales de Google Cloud")
    has_credentials, service_email = check_credentials_file()
    
    if not has_credentials:
        print_warning("No se encontró credentials.json")
        print("\n📋 NECESITAS CREAR UNA CUENTA DE SERVICIO:")
        print("\n  1. Ve a: https://console.cloud.google.com")
        print("  2. Crea un proyecto nuevo: 'Surtilentes Email System'")
        print("  3. Habilita estas APIs:")
        print("     - Google Sheets API")
        print("     - Google Drive API")
        print("  4. Ve a 'Credenciales' → 'Crear credenciales'")
        print("  5. Selecciona 'Cuenta de servicio'")
        print("  6. Nombre: 'surtilentes-email-bot'")
        print("  7. Rol: 'Editor'")
        print("  8. Descarga el archivo JSON")
        print("  9. Renómbralo a 'credentials.json'")
        print(" 10. Colócalo en esta carpeta: python-email-sender/\n")
        
        input("⏸️  Presiona ENTER cuando hayas descargado credentials.json...")
        
        # Verificar de nuevo
        has_credentials, service_email = check_credentials_file()
        if not has_credentials:
            print_error("Aún no se encuentra credentials.json")
            print("Colócalo en la carpeta python-email-sender/ y vuelve a ejecutar este script")
            return
    
    # PASO 3: Verificar que la hoja esté compartida
    print_step(3, "Verificar acceso a Google Sheets")
    print(f"\n🔑 Email de la cuenta de servicio:")
    print(f"   {service_email}\n")
    print("⚠️  IMPORTANTE: Debes compartir tu hoja de Google Sheets con este email")
    print("\n📝 PASOS PARA COMPARTIR:")
    print("  1. Abre tu Google Sheet de citas")
    print("  2. Click en 'Compartir' (botón arriba a la derecha)")
    print("  3. Pega este email: " + service_email)
    print("  4. Cambia permisos a 'Editor'")
    print("  5. DESMARCA 'Notificar a las personas'")
    print("  6. Click en 'Compartir'\n")
    
    shared = input("¿Ya compartiste la hoja con este email? (s/n): ").strip().lower()
    if shared != 's':
        print_warning("Necesitas compartir la hoja primero")
        print("Compártela y vuelve a ejecutar este script")
        return
    
    # PASO 4: Configurar Gmail
    print_step(4, "Configurar Gmail SMTP")
    email, password = configure_gmail()
    
    if not email or not password:
        print_error("Configuración de Gmail incompleta")
        return
    
    # Actualizar script
    if not update_script_config(email, password):
        return
    
    # PASO 5: Ejecutar pruebas
    print_step(5, "Ejecutar pruebas de conexión")
    print("\nVamos a probar la conexión a Google Sheets...")
    
    run_tests = input("\n¿Deseas ejecutar las pruebas ahora? (s/n): ").strip().lower()
    if run_tests == 's':
        print("\n🧪 Ejecutando test_connection.py...\n")
        os.system('python test_connection.py')
    
    # PASO 6: Instrucciones finales
    print_step(6, "¡Configuración completada!")
    print_success("Sistema configurado correctamente\n")
    print("📋 PRÓXIMOS PASOS:")
    print("\n  1. MODO PRUEBA (recomendado primero):")
    print("     python send_appointment_emails.py")
    print("     (Está en modo DRY_RUN=True, no enviará emails reales)")
    print("\n  2. Ver qué emails SE ENVIARÍAN sin enviar realmente")
    print("     Revisa los logs en la consola")
    print("\n  3. Cuando estés listo para enviar REALMENTE:")
    print("     Edita send_appointment_emails.py")
    print("     Cambia: DRY_RUN = True → DRY_RUN = False")
    print("     Luego ejecuta: python send_appointment_emails.py")
    print("\n  4. AUTOMATIZACIÓN (opcional):")
    print("     - Windows: Task Scheduler (cada hora)")
    print("     - Linux/Mac: cron job")
    print("     Ver INSTRUCCIONES_SETUP.md para detalles\n")
    
    print("="*60)
    print("✨ ¡Todo listo! Sistema preparado para enviar emails ✨")
    print("="*60)
    print("\n💡 Consejo: Ejecuta primero en modo DRY_RUN para verificar\n")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Configuración cancelada por el usuario")
        sys.exit(1)
    except Exception as e:
        print_error(f"Error inesperado: {e}")
        sys.exit(1)
