/**
 * SERVICIO DE ENVÍO DE EMAILS CON EMAILJS
 * 
 * CONFIGURACIÓN REQUERIDA:
 * 1. Crear cuenta gratuita en https://www.emailjs.com/
 * 2. Agregar un servicio de email (Gmail, Outlook, etc.)
 * 3. Crear una plantilla de email
 * 4. Obtener tus credenciales y configurarlas abajo
 * 
 * INSTRUCCIONES DETALLADAS:
 * - Ir a https://www.emailjs.com/ y crear cuenta
 * - Email Services → Add New Service → Seleccionar Gmail (u otro)
 * - Email Templates → Create New Template
 * - Account → API Keys → Copiar tu Public Key
 */

// ========================================
// CONFIGURACIÓN DE EMAILJS
// ========================================

const EMAILJS_CONFIG = {
  // Obtén esto en: https://dashboard.emailjs.com/admin/account
  PUBLIC_KEY: 'TU_PUBLIC_KEY_AQUI',
  
  // Obtén esto en: https://dashboard.emailjs.com/admin
  SERVICE_ID: 'TU_SERVICE_ID_AQUI',
  
  // Obtén esto en: https://dashboard.emailjs.com/admin/templates
  TEMPLATE_ID: 'TU_TEMPLATE_ID_AQUI'
};

// ========================================
// INICIALIZACIÓN
// ========================================

let emailJSInitialized = false;

function initializeEmailJS() {
  if (typeof emailjs === 'undefined') {
    console.warn('⚠️ EmailJS no está cargado. Incluye el script en tu HTML.');
    return false;
  }
  
  if (EMAILJS_CONFIG.PUBLIC_KEY === 'TU_PUBLIC_KEY_AQUI') {
    console.warn('⚠️ EmailJS no configurado. Actualiza las credenciales en email-service.js');
    return false;
  }
  
  try {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    emailJSInitialized = true;
    console.log('✅ EmailJS inicializado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar EmailJS:', error);
    return false;
  }
}

// ========================================
// FUNCIÓN PRINCIPAL DE ENVÍO
// ========================================

/**
 * Envía un email de confirmación de cita
 * @param {Object} appointmentData - Datos de la cita
 * @returns {Promise<Object>} Resultado del envío
 */
async function sendAppointmentConfirmationEmail(appointmentData) {
  // Inicializar EmailJS si no está inicializado
  if (!emailJSInitialized) {
    const initialized = initializeEmailJS();
    if (!initialized) {
      return {
        success: false,
        message: 'EmailJS no está configurado correctamente',
        mode: 'simulation'
      };
    }
  }
  
  try {
    // Formatear datos para el template de EmailJS
    const emailParams = formatEmailParams(appointmentData);
    
    console.log('📧 Enviando email de confirmación a:', appointmentData.personalInfo.email);
    
    // Enviar email usando EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      emailParams
    );
    
    console.log('✅ Email enviado exitosamente:', response);
    
    return {
      success: true,
      message: 'Email enviado correctamente',
      response: response
    };
    
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    
    return {
      success: false,
      message: 'Error al enviar el email',
      error: error.text || error.message || 'Error desconocido'
    };
  }
}

// ========================================
// FORMATEO DE DATOS
// ========================================

function formatEmailParams(appointmentData) {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  // Formatear fecha legible
  const fechaFormateada = `${appointmentData.date.day} de ${months[appointmentData.date.month]} de ${appointmentData.date.year}`;
  
  // Parámetros que se enviarán al template de EmailJS
  return {
    // Datos del destinatario
    to_email: appointmentData.personalInfo.email,
    to_name: appointmentData.personalInfo.fullName,
    
    // Información de la cita
    appointment_number: appointmentData.appointmentNumber,
    appointment_date: fechaFormateada,
    appointment_time: appointmentData.time,
    service_name: appointmentData.service.name,
    service_price: appointmentData.service.price || 'Consultar',
    service_duration: appointmentData.service.duration || 'Consultar',
    
    // Datos personales
    customer_name: appointmentData.personalInfo.fullName,
    customer_phone: appointmentData.personalInfo.phone,
    customer_email: appointmentData.personalInfo.email,
    document_type: appointmentData.personalInfo.documentType,
    document_number: appointmentData.personalInfo.documentNumber,
    
    // Información adicional
    status: appointmentData.status,
    
    // Ubicación
    location_name: 'SURTILENTES ÓPTICA',
    location_address: 'Carrera 9 #25-48, Centro Histórico, Cartagena de Indias',
    location_phone: '+57 (5) 664-2580',
    location_whatsapp: '+57 310 555 1234',
    
    // Google Maps
    maps_link: 'https://www.google.com/maps/dir/?api=1&destination=Optica+Surtilentes+Cartagena',
    
    // Año actual (para el footer)
    current_year: new Date().getFullYear()
  };
}

// ========================================
// FUNCIÓN DE PRUEBA
// ========================================

function testEmailService() {
  const testAppointment = {
    appointmentNumber: 'SURT-TEST-' + Date.now(),
    personalInfo: {
      fullName: 'Juan Pérez Prueba',
      email: 'tu-email@gmail.com', // CAMBIA ESTO por tu email real
      phone: '3001234567',
      documentType: 'CC',
      documentNumber: '1234567890'
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
    status: 'confirmada'
  };
  
  console.log('🧪 Iniciando prueba de envío de email...');
  
  sendAppointmentConfirmationEmail(testAppointment)
    .then(result => {
      if (result.success) {
        console.log('✅ PRUEBA EXITOSA - Email enviado');
        alert('✅ Email de prueba enviado correctamente. Revisa tu bandeja de entrada.');
      } else {
        console.log('⚠️ PRUEBA FALLIDA:', result.message);
        alert('⚠️ ' + result.message + '\n\nRevisa la consola para más detalles.');
      }
    })
    .catch(error => {
      console.error('❌ ERROR EN PRUEBA:', error);
      alert('❌ Error al enviar email de prueba. Revisa la consola.');
    });
}

// Exponer función globalmente para poder llamarla desde la consola
window.testEmailService = testEmailService;

console.log('📧 Email Service cargado. Para probar: testEmailService()');
