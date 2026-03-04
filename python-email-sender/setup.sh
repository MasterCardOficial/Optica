#!/bin/bash
# Script de instalación rápida - Sistema de Emails Surtilentes
# Ejecuta este archivo para instalar todo automáticamente (Linux/Mac)

echo "============================================================"
echo "INSTALACION RAPIDA - Sistema de Emails Surtilentes"
echo "============================================================"
echo ""

# Verificar Python
echo "[1/3] Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python no está instalado"
    echo ""
    echo "Instala Python 3.11+ desde: https://www.python.org/downloads/"
    exit 1
fi

python3 --version
echo "[OK] Python instalado correctamente"
echo ""

# Instalar dependencias
echo "[2/3] Instalando dependencias de Python..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Falló la instalación de dependencias"
    exit 1
fi
echo "[OK] Dependencias instaladas"
echo ""

# Verificar configuración
echo "[3/3] Verificando configuración..."
if [ ! -f "credentials.json" ]; then
    echo "[ADVERTENCIA] credentials.json no encontrado"
    echo ""
    echo "Debes crear este archivo siguiendo estos pasos:"
    echo "1. Ve a: https://console.cloud.google.com/"
    echo "2. Crea un proyecto nuevo"
    echo "3. Habilita Google Sheets API y Google Drive API"
    echo "4. Crea una cuenta de servicio"
    echo "5. Descarga el archivo JSON y renómbralo a credentials.json"
    echo ""
    echo "Ver INSTRUCCIONES_SETUP.md para detalles completos"
    echo ""
    exit 1
fi

echo "[OK] credentials.json encontrado"
echo ""

# Ejecutar test
echo "============================================================"
echo "Ejecutando test de conexión..."
echo "============================================================"
echo ""

python3 test_connection.py

echo ""
echo "============================================================"
echo "INSTALACION COMPLETADA"
echo "============================================================"
echo ""
echo "Próximos pasos:"
echo "1. Configura tu email en send_appointment_emails.py"
echo "2. Ejecuta: python3 send_appointment_emails.py"
echo ""
