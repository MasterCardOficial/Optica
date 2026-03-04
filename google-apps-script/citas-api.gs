/**
 * GOOGLE APPS SCRIPT - API DE CITAS SURTILENTES
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 1. Crear una nueva Google Sheet con las siguientes columnas en la fila 1:
 *    A: Timestamp | B: ID | C: Número Cita | D: Nombre Completo | E: Tipo Documento
 *    F: Número Documento (Cédula) | G: Email | H: Teléfono | I: Servicio
 *    J: Fecha | K: Hora | L: Estado | M: Info Médica | N: Fecha Creación
 * 
 * 2. Copiar esta URL de la hoja: https://docs.google.com/spreadsheets/d/XXXX/edit
 * 3. Extraer el ID (XXXX) y colocarlo en la variable SHEET_ID abajo
 * 
 * 4. En el editor de Apps Script:
 *    - Clic en "Implementar" > "Nueva implementación"
 *    - Tipo: "Aplicación web"
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquier persona"
 *    - Clic en "Implementar"
 *    - Copiar la URL de implementación
 * 
 * 5. Usar esa URL en el código JavaScript del sitio web
 */

// ========================================
// CONFIGURACIÓN
// ========================================

// IMPORTANTE: Reemplazar con tu ID de Google Sheet
const SHEET_ID = '1n77pXmQH_OtUhTS-QY2YV3BdEtb6NxLlmR1V1cyyxGE';
const SHEET_NAME = 'Citas'; // Nombre de la pestaña

// ========================================
// ENDPOINT POST - GUARDAR CITA
// ========================================

function doPost(e) {
  try {
    // Habilitar CORS
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Parsear datos recibidos
    const data = JSON.parse(e.postData.contents);
    
    // Abrir la hoja de cálculo
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Si no existe la hoja, crearla con encabezados
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp',
        'Tipo Documento',
        'Cédula',
        'Número Cita',
        'Nombre Completo',
        'Fecha Nacimiento',
        'Teléfono',
        'Email',
        'Dirección',
        'Ciudad',
        'Servicio',
        'Precio',
        'Duración',
        'Fecha Cita',
        'Hora',
        'Primera Vez',
        'Usa Lentes/Gafas',
        'Tiene Fórmula Anterior',
        'Motivo Principal',
        'Notas Adicionales',
        'Estado',
        'Fecha Creación'
      ]);
    }
    
    // Preparar datos para insertar (22 columnas)
    const timestamp = new Date();
    const appointmentData = [
      timestamp.toLocaleString('es-CO'),                                           // A: Timestamp
      data.personalInfo.documentType,                                              // B: Tipo Documento
      data.personalInfo.documentNumber,                                            // C: Cédula
      data.appointmentNumber,                                                      // D: Número Cita
      data.personalInfo.fullName,                                                  // E: Nombre Completo
      data.personalInfo.birthDate || 'N/A',                                       // F: Fecha Nacimiento
      data.personalInfo.phone,                                                     // G: Teléfono
      data.personalInfo.email,                                                     // H: Email
      data.personalInfo.address || 'N/A',                                         // I: Dirección
      data.personalInfo.city || 'N/A',                                            // J: Ciudad
      data.service.name,                                                           // K: Servicio
      data.service.price || 'N/A',                                                // L: Precio
      data.service.duration || 'N/A',                                             // M: Duración
      `${data.date.day}/${data.date.month + 1}/${data.date.year}`,               // N: Fecha Cita
      data.time,                                                                   // O: Hora
      data.medicalInfo.firstTime || 'N/A',                                        // P: Primera Vez
      data.medicalInfo.usesGlasses || 'N/A',                                      // Q: Usa Lentes/Gafas
      data.medicalInfo.hasOldPrescription || 'N/A',                               // R: Tiene Fórmula Anterior
      data.medicalInfo.mainReason || 'N/A',                                       // S: Motivo Principal
      data.medicalInfo.notes || '',                                               // T: Notas Adicionales
      data.status,                                                                 // U: Estado
      data.createdAt                                                               // V: Fecha Creación
    ];
    
    // Insertar fila
    sheet.appendRow(appointmentData);
    
    // Enviar correo de confirmación
    try {
      sendAppointmentConfirmationEmail(data);
      Logger.log('✅ Correo enviado exitosamente');
    } catch (emailError) {
      Logger.log('⚠️ Error al enviar correo: ' + emailError.toString());
      // No fallar la operación si el correo falla
    }
    
    // Respuesta exitosa
    output.setContent(JSON.stringify({
      success: true,
      message: 'Cita guardada exitosamente',
      appointmentNumber: data.appointmentNumber
    }));
    
    return output;
    
  } catch (error) {
    // Respuesta de error
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({
      success: false,
      message: 'Error al guardar la cita',
      error: error.toString()
    }));
    
    return output;
  }
}

// ========================================
// ENDPOINT GET - CONSULTAR CITAS POR CÉDULA
// ========================================

function doGet(e) {
  try {
    // Habilitar CORS
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Obtener parámetros
    const cedula = e.parameter.cedula;
    
    if (!cedula) {
      output.setContent(JSON.stringify({
        success: false,
        message: 'Parámetro cédula requerido'
      }));
      return output;
    }
    
    // Abrir la hoja de cálculo
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      output.setContent(JSON.stringify({
        success: false,
        message: 'Hoja de cálculo no encontrada'
      }));
      return output;
    }
    
    // Obtener todos los datos (solo hasta la última fila con contenido)
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      // Solo hay encabezados, no hay citas
      output.setContent(JSON.stringify({
        success: true,
        count: 0,
        appointments: []
      }));
      return output;
    }
    
    const data = sheet.getRange(1, 1, lastRow, 22).getValues();
    const rows = data.slice(1); // Excluir encabezados
    
    // Filtrar citas por cédula (Cédula está en columna C, índice 2)
    const appointments = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      // Estructura de 22 columnas:
      // A=Timestamp, B=Tipo Doc, C=Cédula, D=Núm Cita, E=Nombre, F=Fecha Nac,
      // G=Teléfono, H=Email, I=Dirección, J=Ciudad, K=Servicio, L=Precio,
      // M=Duración, N=Fecha Cita, O=Hora, P=Primera Vez, Q=Usa Lentes,
      // R=Fórmula Anterior, S=Motivo, T=Notas, U=Estado, V=Fecha Creación
      
      const rowCedula = row[2] ? row[2].toString().trim() : '';
      const searchCedula = cedula.toString().trim();
      
      if (rowCedula === searchCedula) {
        // Parsear fecha para ordenar (Fecha Cita está en columna N, índice 13)
        const fechaStr = row[13] ? row[13].toString() : '';
        let fechaObj = new Date();
        
        if (fechaStr.includes('/')) {
          const fechaParts = fechaStr.split('/');
          fechaObj = new Date(fechaParts[2], fechaParts[1] - 1, fechaParts[0]);
        }
        
        const appointment = {
          id: Date.now() + i,
          appointmentNumber: row[3] || 'N/A',
          personalInfo: {
            fullName: row[4] || 'N/A',
            documentType: row[1] || 'CC',
            documentNumber: row[2] || 'N/A',
            birthDate: row[5] || null,
            phone: row[6] || 'N/A',
            email: row[7] || 'N/A',
            address: row[8] || null,
            city: row[9] || null
          },
          service: {
            id: 'examen-visual',
            name: row[10] || 'N/A',
            price: row[11] || 'N/A',
            duration: row[12] || 'N/A'
          },
          date: {
            day: fechaObj.getDate(),
            month: fechaObj.getMonth(),
            year: fechaObj.getFullYear()
          },
          time: row[14] || 'N/A',
          status: row[20] || 'confirmada',
          medicalInfo: {
            firstTime: row[15] || 'N/A',
            usesGlasses: row[16] || 'N/A',
            hasOldPrescription: row[17] || 'N/A',
            mainReason: row[18] || 'N/A',
            notes: row[19] || ''
          },
          createdAt: row[21] || row[0] || new Date().toISOString(),
          dateObject: fechaObj
        };
        
        appointments.push(appointment);
      }
    }
    
    // Ordenar por fecha (más reciente primero)
    appointments.sort((a, b) => b.dateObject - a.dateObject);
    
    // Remover dateObject antes de enviar
    appointments.forEach(apt => delete apt.dateObject);
    
    // Respuesta exitosa
    output.setContent(JSON.stringify({
      success: true,
      count: appointments.length,
      appointments: appointments
    }));
    
    return output;
    
  } catch (error) {
    // Respuesta de error
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({
      success: false,
      message: 'Error al consultar citas',
      error: error.toString()
    }));
    
    return output;
  }
}

// ========================================
// ENVÍO DE CORREOS DE CONFIRMACIÓN
// ========================================

/**
 * Envía email de confirmación usando MailApp de Google
 * 100% GRATUITO - Sin límites de pago
 * Hasta 100 emails por día (más que suficiente)
 */
function sendAppointmentConfirmationEmail(data) {
  const emailAddress = data.personalInfo.email;
  const customerName = data.personalInfo.fullName;
  const appointmentNumber = data.appointmentNumber;
  
  // Formatear fecha
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const fechaCita = `${data.date.day} de ${months[data.date.month]} de ${data.date.year}`;
  
  // Link de Google Maps
  const mapsLink = 'https://www.google.com/maps/dir/?api=1&destination=Optica+Surtilentes+Cartagena';
  
  // Asunto del correo
  const subject = `✓ Cita Confirmada - ${appointmentNumber} | Surtilentes Óptica`;
  
  // Cuerpo del correo en HTML
  const htmlBody = `
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
                ¡Hola, ${customerName}!
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
                          ${appointmentNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          📅 Fecha:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          ${fechaCita}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          🕐 Hora:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          ${data.time}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #0c4a6e; font-weight: 700; font-size: 14px;">
                          🔬 Servicio:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          ${data.service.name}
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
                <a href="${mapsLink}" style="display: inline-block; margin-top: 15px; padding: 12px 30px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 14px;">
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
  `;
  
  // Texto plano como fallback
  const plainBody = `
SURTILENTES ÓPTICA - CONFIRMACIÓN DE CITA

¡Hola, ${customerName}!

Tu cita ha sido agendada exitosamente.

DETALLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Número de Cita: ${appointmentNumber}
Fecha: ${fechaCita}
Hora: ${data.time}
Servicio: ${data.service.name}

RECORDATORIOS:
• Llegue 10 minutos antes
• Traiga documento de identidad
• Si usa gafas, tráigalas
• Si tiene fórmula anterior, preséntela

UBICACIÓN:
SURTILENTES ÓPTICA
Carrera 9 #25-48
Centro Histórico, Cartagena

CONTACTO:
📞 +57 (5) 664-2580
💬 WhatsApp: +57 310 555 1234

¡Gracias por confiar en nosotros!
━━━━━━━━━━━━━━━━━━━━━━━━━━
© 2026 Surtilentes Óptica
  `;
  
  // Enviar correo usando MailApp (100% GRATUITO - sin límites de pago)
  MailApp.sendEmail({
    to: emailAddress,
    subject: subject,
    htmlBody: htmlBody,
    body: plainBody,
    name: 'Surtilentes Óptica'
  });
  
  Logger.log(`✅ Correo enviado a: ${emailAddress}`);
}

// ========================================
// FUNCIÓN DE PRUEBA Y AUTORIZACIÓN
// ========================================

// ========================================
// FUNCIÓN DE PRUEBA Y AUTORIZACIÓN
// ========================================

/**
 * Ejecuta esta función PRIMERO para autorizar permisos de email
 * Esto solo se hace UNA VEZ
 */
function testEndpoint() {
  // Datos de prueba
  const testData = {
    id: Date.now(),
    appointmentNumber: 'SURT-TEST-' + Date.now(),
    personalInfo: {
      fullName: 'Juan Pérez (PRUEBA)',
      documentType: 'CC',
      documentNumber: '1234567890',
      email: 'TU_EMAIL_AQUI@gmail.com', // ⚠️ CAMBIA ESTO POR TU EMAIL
      phone: '3001234567'
    },
    service: {
      name: 'Examen Visual Completo',
      price: '$80.000',
      duration: '45 minutos'
    },
    date: {
      day: 15,
      month: 2, // Marzo (0-indexed)
      year: 2026
    },
    time: '10:00 AM',
    status: 'confirmada',
    medicalInfo: {
      firstTime: 'Sí',
      usesGlasses: 'Sí',
      hasOldPrescription: 'Sí',
      mainReason: 'Revisión rutinaria',
      notes: 'Ninguna'
    },
    createdAt: new Date().toISOString()
  };
  
  Logger.log('🧪 Iniciando prueba de sistema...');
  
  // Probar guardado en sheet
  const postEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  Logger.log('📥 Probando guardado en Google Sheets...');
  const result = doPost(postEvent);
  Logger.log('✅ Resultado: ' + result.getContent());
  
  // Probar consulta
  Logger.log('🔍 Probando consulta de citas...');
  const getEvent = {
    parameter: {
      cedula: '1234567890'
    }
  };
  
  const getResult = doGet(getEvent);
  Logger.log('✅ Consulta: ' + getResult.getContent());
  
  Logger.log('');
  Logger.log('═══════════════════════════════════════');
  Logger.log('✅ PRUEBA COMPLETADA');
  Logger.log('═══════════════════════════════════════');
  Logger.log('Si llegó este mensaje, el sistema funciona correctamente.');
  Logger.log('Revisa tu email (también SPAM) para ver la confirmación.');
  Logger.log('');
}

// ========================================
// SISTEMA DE RECORDATORIOS DE CITAS
// ========================================

/**
 * Función que envía recordatorios de citas para MAÑANA
 * Esta función debe ejecutarse DIARIAMENTE (configurar trigger)
 * 
 * Para automatizar:
 * 1. En el editor de Apps Script, ve a: Activadores (reloj ⏰)
 * 2. Click en "+ Agregar activador"
 * 3. Función: sendAppointmentReminders
 * 4. Evento: Activador de tiempo
 * 5. Tipo: Diariamente
 * 6. Hora: 7:00 p.m. a 8:00 p.m. (enviar recordatorio en la tarde)
 * 7. Guardar
 */
function sendAppointmentReminders() {
  Logger.log('🔔 Iniciando envío de recordatorios de citas...');
  
  try {
    // Abrir hoja de cálculo
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      Logger.log('❌ Hoja no encontrada');
      return;
    }
    
    // Obtener todas las citas
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      Logger.log('ℹ️ No hay citas registradas');
      return;
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 22).getValues();
    
    // Calcular fecha de mañana (sin hora)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const tomorrowStr = `${tomorrow.getDate()}/${tomorrow.getMonth() + 1}/${tomorrow.getFullYear()}`;
    
    Logger.log(`📅 Buscando citas para mañana: ${tomorrowStr}`);
    
    let remindersSent = 0;
    let remindersSkipped = 0;
    
    // Recorrer todas las filas
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Columna N (índice 13) = Fecha Cita
      const fechaCitaStr = row[13] ? row[13].toString() : '';
      
      // Verificar si la fecha de la cita es mañana
      if (fechaCitaStr === tomorrowStr) {
        // Extraer datos del paciente
        const email = row[7]; // Columna H
        const nombreCompleto = row[4]; // Columna E
        const numeroCita = row[3]; // Columna D
        const hora = row[14]; // Columna O
        const servicio = row[10]; // Columna K
        const estado = row[20]; // Columna U
        
        // Solo enviar si tiene email y la cita está confirmada
        if (email && email.includes('@') && estado === 'confirmada') {
          try {
            sendReminderEmail({
              email: email,
              nombreCompleto: nombreCompleto,
              numeroCita: numeroCita,
              fecha: fechaCitaStr,
              hora: hora,
              servicio: servicio
            });
            
            remindersSent++;
            Logger.log(`✅ Recordatorio enviado a: ${email} (${nombreCompleto})`);
            
          } catch (emailError) {
            Logger.log(`⚠️ Error al enviar recordatorio a ${email}: ${emailError.toString()}`);
            remindersSkipped++;
          }
        } else {
          remindersSkipped++;
          Logger.log(`⏭️ Cita omitida: ${nombreCompleto} (sin email o no confirmada)`);
        }
      }
    }
    
    Logger.log('');
    Logger.log('═══════════════════════════════════════');
    Logger.log(`✅ Recordatorios enviados: ${remindersSent}`);
    Logger.log(`⏭️ Recordatorios omitidos: ${remindersSkipped}`);
    Logger.log('═══════════════════════════════════════');
    
  } catch (error) {
    Logger.log('❌ Error en sendAppointmentReminders: ' + error.toString());
  }
}

/**
 * Envía email de recordatorio (1 día antes de la cita)
 */
function sendReminderEmail(data) {
  const emailAddress = data.email;
  const customerName = data.nombreCompleto;
  const appointmentNumber = data.numeroCita;
  const fecha = data.fecha;
  const hora = data.hora;
  const servicio = data.servicio;
  
  // Link de Google Maps
  const mapsLink = 'https://www.google.com/maps/dir/?api=1&destination=Optica+Surtilentes+Cartagena';
  
  // Asunto del correo
  const subject = `🔔 Recordatorio: Tu cita es MAÑANA - ${appointmentNumber} | Surtilentes`;
  
  // Cuerpo del correo en HTML
  const htmlBody = `
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
          
          <!-- Header con gradiente -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🔔 ¡Recordatorio de Cita!
              </h1>
              <p style="margin: 10px 0 0; color: #fff7ed; font-size: 14px;">
                Surtilentes Óptica
              </p>
            </td>
          </tr>
          
          <!-- Mensaje principal -->
          <tr>
            <td style="padding: 30px 30px 20px; text-align: center;">
              <h2 style="margin: 0; color: #d97706; font-size: 24px;">
                ¡Hola, ${customerName}!
              </h2>
              <p style="margin: 15px 0 0; color: #64748b; font-size: 18px; font-weight: 600;">
                Tu cita es <span style="color: #f59e0b;">MAÑANA</span>
              </p>
            </td>
          </tr>
          
          <!-- Detalles de la cita -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%); border-radius: 12px; padding: 25px; border: 2px solid #f59e0b;">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td width="40%" style="color: #92400e; font-weight: 700; font-size: 14px;">
                          📋 Número de Cita:
                        </td>
                        <td style="color: #1e3a8a; font-weight: 700; font-size: 16px;">
                          ${appointmentNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #92400e; font-weight: 700; font-size: 14px;">
                          📅 Fecha:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          MAÑANA (${fecha})
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #92400e; font-weight: 700; font-size: 14px;">
                          🕐 Hora:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          ${hora}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #92400e; font-weight: 700; font-size: 14px;">
                          🔬 Servicio:
                        </td>
                        <td style="color: #334155; font-size: 15px;">
                          ${servicio}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Recordatorios importantes -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 12px; color: #991b1b; font-size: 16px;">
                  ⏰ Por favor recuerda:
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 14px; line-height: 1.8;">
                  <li>Llega <strong>10 minutos antes</strong> de tu cita</li>
                  <li>Trae tu <strong>documento de identidad</strong></li>
                  <li>Si usas gafas o lentes, <strong>tráelos</strong></li>
                  <li>Si tienes fórmula médica anterior, <strong>preséntala</strong></li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Ubicación -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: #f1f5f9; border: 2px solid #cbd5e1; border-radius: 12px; padding: 20px; text-align: center;">
                <h3 style="margin: 0 0 15px; color: #1e3a8a; font-size: 18px;">
                  📍 Nuestra Ubicación
                </h3>
                <p style="margin: 0 0 10px; color: #334155; font-size: 15px;">
                  <strong>SURTILENTES ÓPTICA</strong><br>
                  Carrera 9 #25-48<br>
                  Centro Histórico, Cartagena
                </p>
                <a href="${mapsLink}" style="display: inline-block; margin-top: 15px; padding: 12px 30px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 14px;">
                  🗺️ Ver en Google Maps
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Contacto -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <p style="text-align: center; color: #64748b; font-size: 14px; margin: 0;">
                ¿Necesitas reprogramar o cancelar?<br>
                Llámanos: <a href="tel:+5756642580" style="color: #1e3a8a; font-weight: 700; text-decoration: none;">+57 (5) 664-2580</a><br>
                WhatsApp: <a href="https://wa.me/573105551234" style="color: #059669; font-weight: 700; text-decoration: none;">+57 310 555 1234</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 25px 30px; text-align: center;">
              <p style="margin: 0 0 10px; color: #e0e7ff; font-size: 14px;">
                ¡Nos vemos mañana! 👋
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
  `;
  
  // Texto plano como fallback
  const plainBody = `
🔔 RECORDATORIO DE CITA - SURTILENTES ÓPTICA

¡Hola, ${customerName}!

Tu cita es MAÑANA:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETALLES DE TU CITA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Número de Cita: ${appointmentNumber}
📅 Fecha: MAÑANA (${fecha})
🕐 Hora: ${hora}
🔬 Servicio: ${servicio}

⏰ POR FAVOR RECUERDA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Llega 10 minutos antes de tu cita
• Trae tu documento de identidad
• Si usas gafas o lentes, tráelos
• Si tienes fórmula médica anterior, preséntala

📍 NUESTRA UBICACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SURTILENTES ÓPTICA
Carrera 9 #25-48
Centro Histórico, Cartagena

Ver en Google Maps: ${mapsLink}

CONTACTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 Teléfono: +57 (5) 664-2580
💬 WhatsApp: +57 310 555 1234

¿Necesitas reprogramar o cancelar?
Contáctanos con anticipación.

¡Nos vemos mañana! 👋

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© 2026 Surtilentes Óptica - Cartagena, Colombia
  `;
  
  // Enviar correo
  MailApp.sendEmail({
    to: emailAddress,
    subject: subject,
    htmlBody: htmlBody,
    body: plainBody,
    name: 'Surtilentes Óptica - Recordatorios'
  });
  
  Logger.log(`📧 Recordatorio enviado a: ${emailAddress}`);
}

/**
 * Función de prueba para el sistema de recordatorios
 * Ejecuta esta función para probar que todo funciona
 */
function testReminders() {
  Logger.log('🧪 Probando sistema de recordatorios...');
  sendAppointmentReminders();
  Logger.log('✅ Prueba completada. Revisa los logs arriba.');
}

