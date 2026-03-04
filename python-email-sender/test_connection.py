"""
TEST DE CONEXIÓN - Sistema de Emails Surtilentes
==================================================

Script simple para verificar que todo está configurado correctamente
SIN enviar emails reales.

Verifica:
1. ✅ Credenciales de Google Cloud
2. ✅ Conexión a Google Sheets
3. ✅ Lectura de datos
4. ✅ Permisos de escritura
"""

import sys
import os

def test_imports():
    """Verifica que todas las librerías estén instaladas"""
    print("🔍 Verificando librerías...")
    
    try:
        import gspread
        print("  ✅ gspread instalado")
    except ImportError:
        print("  ❌ gspread NO instalado")
        print("     Ejecuta: pip install gspread")
        return False
    
    try:
        from google.oauth2.service_account import Credentials
        print("  ✅ google-auth instalado")
    except ImportError:
        print("  ❌ google-auth NO instalado")
        print("     Ejecuta: pip install google-auth")
        return False
    
    print("  ✅ Todas las librerías están instaladas\n")
    return True

def test_credentials_file():
    """Verifica que exista el archivo credentials.json"""
    print("🔍 Verificando archivo credentials.json...")
    
    if os.path.exists('credentials.json'):
        print("  ✅ credentials.json encontrado")
        
        # Verificar que sea un JSON válido
        try:
            import json
            with open('credentials.json', 'r') as f:
                data = json.load(f)
                if 'client_email' in data:
                    print(f"  ✅ Cuenta de servicio: {data['client_email']}")
                    print("")
                    return True, data['client_email']
                else:
                    print("  ❌ El archivo no tiene el formato correcto")
                    return False, None
        except Exception as e:
            print(f"  ❌ Error al leer credentials.json: {e}")
            return False, None
    else:
        print("  ❌ credentials.json NO encontrado")
        print("     Debes descargarlo desde Google Cloud Console")
        print("     Ver: INSTRUCCIONES_SETUP.md - Paso 3\n")
        return False, None

def test_sheet_connection():
    """Intenta conectar a Google Sheets"""
    print("🔍 Intentando conectar a Google Sheets...")
    
    try:
        import gspread
        from google.oauth2.service_account import Credentials
        
        SHEET_ID = '1n77pXmQH_OtUhTS-QY2YV3BdEtb6NxLlmR1V1cyyxGE'
        SHEET_NAME = 'Citas'
        
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        
        creds = Credentials.from_service_account_file('credentials.json', scopes=scopes)
        client = gspread.authorize(creds)
        sheet = client.open_by_key(SHEET_ID).worksheet(SHEET_NAME)
        
        print("  ✅ Conectado exitosamente a Google Sheets")
        print(f"  ✅ Hoja: {SHEET_NAME}\n")
        return True, sheet
        
    except FileNotFoundError:
        print("  ❌ No se encontró credentials.json")
        return False, None
    except gspread.exceptions.SpreadsheetNotFound:
        print("  ❌ No se encontró el Google Sheet")
        print("     Verifica el SHEET_ID en el script")
        return False, None
    except gspread.exceptions.WorksheetNotFound:
        print(f"  ❌ No se encontró la pestaña '{SHEET_NAME}'")
        print("     Verifica que exista en tu Google Sheet")
        return False, None
    except Exception as e:
        print(f"  ❌ Error al conectar: {e}")
        if "PERMISSION_DENIED" in str(e):
            print("\n  💡 SOLUCIÓN:")
            print("     El Sheet NO está compartido con la cuenta de servicio.")
            print("     Ver: INSTRUCCIONES_SETUP.md - Paso 3.7")
        return False, None

def test_read_data(sheet):
    """Intenta leer datos de la hoja"""
    print("🔍 Leyendo datos de la hoja...")
    
    try:
        all_rows = sheet.get_all_values()
        headers = all_rows[0]
        data_rows = all_rows[1:]
        
        print(f"  ✅ Encabezados encontrados: {len(headers)} columnas")
        print(f"  ✅ Datos encontrados: {len(data_rows)} filas")
        
        # Mostrar primeras columnas
        print(f"\n  📋 Primeras columnas: {', '.join(headers[:5])}...")
        
        # Buscar columna de emails
        email_col = -1
        for i, header in enumerate(headers):
            if 'email' in header.lower() or 'correo' in header.lower():
                email_col = i
                break
        
        if email_col >= 0:
            print(f"  ✅ Columna de Email encontrada: '{headers[email_col]}' (columna {email_col + 1})")
            
            # Contar emails válidos
            valid_emails = 0
            for row in data_rows:
                if len(row) > email_col and '@' in row[email_col]:
                    valid_emails += 1
            
            print(f"  ✅ Emails válidos encontrados: {valid_emails}")
        else:
            print("  ⚠️ No se encontró columna de Email")
        
        print("")
        return True
        
    except Exception as e:
        print(f"  ❌ Error al leer datos: {e}")
        return False

def test_write_permission(sheet):
    """Verifica permisos de escritura"""
    print("🔍 Verificando permisos de escritura...")
    
    try:
        # Intentar actualizar una celda de prueba (última columna, última fila)
        last_row = sheet.row_count
        last_col = sheet.col_count
        
        test_value = f"Test-{int(time.time())}"
        sheet.update_cell(last_row, last_col, test_value)
        
        # Verificar que se escribió
        read_value = sheet.cell(last_row, last_col).value
        
        if read_value == test_value:
            print("  ✅ Permisos de escritura verificados")
            
            # Limpiar celda de prueba
            sheet.update_cell(last_row, last_col, '')
            print("  ✅ Limpieza completada\n")
            return True
        else:
            print("  ❌ No se pudo verificar la escritura")
            return False
        
    except Exception as e:
        print(f"  ❌ Error al escribir: {e}")
        if "PERMISSION_DENIED" in str(e):
            print("\n  💡 SOLUCIÓN:")
            print("     La cuenta de servicio necesita permisos de 'Editor'")
            print("     Comparte el Sheet con permisos de edición")
        return False

def main():
    """Ejecuta todas las pruebas"""
    print("")
    print("=" * 70)
    print("TEST DE CONFIGURACIÓN - Sistema de Emails Surtilentes")
    print("=" * 70)
    print("")
    
    import time
    
    # Test 1: Librerías
    if not test_imports():
        print("\n❌ FALLO: Instala las librerías necesarias")
        print("   Ejecuta: pip install -r requirements.txt")
        return
    
    # Test 2: Archivo de credenciales
    creds_ok, service_account = test_credentials_file()
    if not creds_ok:
        print("\n❌ FALLO: Configura credentials.json")
        print("   Ver: INSTRUCCIONES_SETUP.md - Paso 3")
        return
    
    # Test 3: Conexión a Sheets
    sheet_ok, sheet = test_sheet_connection()
    if not sheet_ok:
        if service_account:
            print(f"\n💡 RECUERDA: Debes compartir el Google Sheet con:")
            print(f"   {service_account}")
            print(f"   Permisos: Editor")
        return
    
    # Test 4: Leer datos
    if not test_read_data(sheet):
        print("\n❌ FALLO: No se pudieron leer los datos")
        return
    
    # Test 5: Permisos de escritura
    if not test_write_permission(sheet):
        print("\n❌ FALLO: No se pueden escribir datos")
        return
    
    # Éxito total
    print("")
    print("=" * 70)
    print("✅ ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!")
    print("=" * 70)
    print("")
    print("Tu configuración está correcta. Ahora puedes:")
    print("")
    print("1. Configurar tu email en send_appointment_emails.py:")
    print("   - SENDER_EMAIL = 'tu_email@gmail.com'")
    print("   - SENDER_PASSWORD = 'tu_contraseña_aplicacion'")
    print("")
    print("2. Ejecutar el script principal:")
    print("   python send_appointment_emails.py")
    print("")

if __name__ == "__main__":
    main()
