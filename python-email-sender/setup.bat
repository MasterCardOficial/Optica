@echo off
REM Script de instalación rápida - Sistema de Emails Surtilentes
REM Ejecuta este archivo para instalar todo automáticamente

echo ============================================================
echo INSTALACION RAPIDA - Sistema de Emails Surtilentes
echo ============================================================
echo.

REM Verificar Python
echo [1/3] Verificando Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no esta instalado o no esta en PATH
    echo.
    echo Descarga Python desde: https://www.python.org/downloads/
    echo Durante la instalacion marca: "Add Python to PATH"
    echo.
    pause
    exit /b 1
)

python --version
echo [OK] Python instalado correctamente
echo.

REM Instalar dependencias
echo [2/3] Instalando dependencias de Python...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la instalacion de dependencias
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas
echo.

REM Verificar configuración
echo [3/3] Verificando configuracion...
if not exist credentials.json (
    echo [ADVERTENCIA] credentials.json no encontrado
    echo.
    echo Debes crear este archivo siguiendo estos pasos:
    echo 1. Ve a: https://console.cloud.google.com/
    echo 2. Crea un proyecto nuevo
    echo 3. Habilita Google Sheets API y Google Drive API
    echo 4. Crea una cuenta de servicio
    echo 5. Descarga el archivo JSON y renombralo a credentials.json
    echo.
    echo Ver INSTRUCCIONES_SETUP.md para detalles completos
    echo.
    pause
    exit /b 1
)

echo [OK] credentials.json encontrado
echo.

REM Ejecutar test
echo ============================================================
echo Ejecutando test de conexion...
echo ============================================================
echo.

python test_connection.py

echo.
echo ============================================================
echo INSTALACION COMPLETADA
echo ============================================================
echo.
echo Proximos pasos:
echo 1. Configura tu email en send_appointment_emails.py
echo 2. Ejecuta: python send_appointment_emails.py
echo.
pause
