/**
 * CONSULTA DE CITAS - SURTILENTES
 * Permite buscar citas por número de documento (cédula)
 */

// ===================================
// CONFIGURACIÓN API
// ===================================
// Nota: Asegúrate de incluir <script src="../assets/js/config/api-config.js"></script> en el HTML
const API_URL = typeof API_CONFIG !== 'undefined' && API_CONFIG.SHEETS_API_URL !== 'TU_URL_DE_APPS_SCRIPT_AQUI' 
  ? API_CONFIG.SHEETS_API_URL 
  : null;
const DEV_MODE = typeof API_CONFIG !== 'undefined' ? API_CONFIG.DEV_MODE : true;

// Recomendaciones por servicio (igual que en appointments.js)
const serviceRecommendations = {
  'examen-visual': [
    'Traiga sus gafas actuales (si las usa)',
    'Traiga su fórmula anterior (si la tiene)',
    'Si usa lentes de contacto, tráigalos puestos o el empaque',
    'Liste los medicamentos que toma actualmente',
    'Venga sin maquillaje en los ojos',
    'Evite usar lentes de contacto 24 horas antes del examen'
  ],
  'lentes-contacto': [
    'Traiga su fórmula médica actualizada (obligatorio)',
    'Si ya usa lentes, traiga la caja o empaque',
    'Venga sin maquillaje en los ojos',
    'Traiga sus gafas por si necesita quitarse los lentes'
  ],
  'ajuste-monturas': [
    'Traiga las gafas que necesitan ajuste',
    'Si tiene el estuche original, tráigalo'
  ],
  'reparacion': [
    'Traiga las gafas que requieren reparación',
    'Si tiene piezas rotas o repuestos, tráigalos',
    'Si es posible, traiga la factura de compra'
  ],
  'control-vision': [
    'Traiga sus gafas actuales',
    'Traiga su fórmula anterior para comparar',
    'Liste cualquier cambio en su visión'
  ],
  'asesoria': [
    'Traiga su fórmula si ya tiene',
    'Piense en el estilo que le gusta',
    'Considere su presupuesto aproximado'
  ]
};

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Sistema de consulta de citas inicializado');
  initializeSearchForm();
  initializeBackToTop();
});

// ===================================
// FORMULARIO DE BÚSQUEDA
// ===================================

function initializeSearchForm() {
  const searchForm = document.getElementById('searchForm');
  
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const documentType = document.getElementById('searchDocumentType').value;
    const documentNumber = document.getElementById('searchDocumentNumber').value.replace(/\D/g, '');
    
    if (!documentType) {
      alert('Por favor seleccione el tipo de documento');
      return;
    }
    
    if (documentNumber.length < 6) {
      alert('Por favor ingrese un número de documento válido');
      return;
    }
    
    searchAppointments(documentType, documentNumber);
  });
}

// ===================================
// BÚSQUEDA DE CITAS
// ===================================

async function searchAppointments(documentType, documentNumber) {
  console.log(`🔍 Buscando citas para: ${documentType} ${documentNumber}`);
  
  // Elementos del formulario
  const searchButton = document.querySelector('.btn-search');
  const documentTypeInput = document.getElementById('searchDocumentType');
  const documentNumberInput = document.getElementById('searchDocumentNumber');
  const resultsContainer = document.getElementById('resultsContainer');
  const noResults = document.getElementById('noResults');
  
  // Ocultar resultados previos
  resultsContainer.style.display = 'none';
  noResults.style.display = 'none';
  
  // Mostrar estado de carga
  const originalButtonHTML = searchButton.innerHTML;
  searchButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Buscando...';
  searchButton.disabled = true;
  documentTypeInput.disabled = true;
  documentNumberInput.disabled = true;
  
  let userAppointments = [];
  
  // Validar que la API esté configurada
  if (!API_URL) {
    alert('⚠️ Error: La API de Google Sheets no está configurada.\n\nPor favor configure la URL en api-config.js');
    searchButton.innerHTML = originalButtonHTML;
    searchButton.disabled = false;
    documentTypeInput.disabled = false;
    documentNumberInput.disabled = false;
    showNoResults();
    return;
  }
  
  // Consultar en Google Sheets
  try {
    console.log('📤 Consultando Google Sheets...');
    
    const response = await fetch(`${API_URL}?cedula=${documentNumber}`, {
      method: 'GET',
      mode: 'cors'
    });
    
    const data = await response.json();
    
    if (data.success && data.appointments) {
      console.log(`✅ Encontradas ${data.count} citas en Google Sheets`);
      userAppointments = data.appointments;
    } else {
      console.log('⚠️ No se encontraron citas en Google Sheets');
    }
    
  } catch (error) {
    console.error('❌ Error al consultar Google Sheets:', error);
    searchButton.innerHTML = originalButtonHTML;
    searchButton.disabled = false;
    documentTypeInput.disabled = false;
    documentNumberInput.disabled = false;
    alert('❌ Error al consultar la base de datos.\n\nPor favor verifique su conexión a internet e intente nuevamente.');
    showNoResults();
    return;
  }
  
  // Restaurar botón
  searchButton.innerHTML = originalButtonHTML;
  searchButton.disabled = false;
  documentTypeInput.disabled = false;
  documentNumberInput.disabled = false;
  
  console.log(`📋 Citas encontradas: ${userAppointments.length}`);
  
  if (userAppointments.length > 0) {
    displayAppointments(userAppointments);
  } else {
    showNoResults();
  }
}

// ===================================
// MOSTRAR RESULTADOS
// ===================================

function displayAppointments(appointments) {
  const resultsContainer = document.getElementById('resultsContainer');
  const appointmentsList = document.getElementById('appointmentsList');
  const appointmentsCount = document.getElementById('appointmentsCount');
  const noResults = document.getElementById('noResults');
  
  // Ocultar mensaje de no resultados
  noResults.style.display = 'none';
  
  // Mostrar contenedor de resultados
  resultsContainer.style.display = 'block';
  
  // Limpiar lista
  appointmentsList.innerHTML = '';
  
  // Actualizar contador
  appointmentsCount.textContent = `${appointments.length} ${appointments.length === 1 ? 'cita' : 'citas'}`;
  
  // Ordenar por fecha (más recientes primero)
  appointments.sort((a, b) => {
    const dateA = new Date(a.date.year, a.date.month, a.date.day);
    const dateB = new Date(b.date.year, b.date.month, b.date.day);
    return dateB - dateA;
  });
  
  // Crear filas de tabla
  appointments.forEach((apt, index) => {
    const row = createTableRow(apt, index);
    appointmentsList.appendChild(row);
  });
  
  // Scroll a resultados
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createTableRow(appointment, index) {
  const row = document.createElement('tr');
  row.style.animationDelay = `${0.1 + (index * 0.05)}s`;
  
  // Determinar estado
  const dateObj = new Date(appointment.date.year, appointment.date.month, appointment.date.day);
  const formattedDate = formatDate(dateObj);
  const formattedShortDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
  
  // Verificar si la cita está vencida
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
  const appointmentDate = new Date(appointment.date.year, appointment.date.month, appointment.date.day);
  appointmentDate.setHours(0, 0, 0, 0);
  
  const isPastDate = appointmentDate < now;
  let statusClass = 'status-active';
  let statusIcon = '✓';
  let statusText = 'Activo';
  
  if (isPastDate) {
    statusClass = 'status-expired';
    statusIcon = '⏱️';
    statusText = 'Vencido';
  } else if (appointment.status === 'completada') {
    statusClass = 'status-completed';
    statusIcon = '✓';
    statusText = 'Completado';
  }
  
  row.innerHTML = `
    <td><strong>${appointment.appointmentNumber || `SURT-${appointment.id}`}</strong></td>
    <td>${formattedShortDate}</td>
    <td>${appointment.time}</td>
    <td>${appointment.service.name}</td>
    <td>
      <span class="status-badge-table ${statusClass}">
        ${statusIcon} ${statusText}
      </span>
    </td>
    <td>
      <button class="btn-detail" onclick="showAppointmentDetail(${index})">
        <i class="fas fa-eye"></i> Ver Detalle
      </button>
    </td>
  `;
  
  // Guardar datos completos en el elemento para acceso posterior
  row.dataset.appointmentData = JSON.stringify(appointment);
  
  return row;
}

// ===================================
// MODAL DE DETALLES
// ===================================

function showAppointmentDetail(index) {
  const appointmentsList = document.getElementById('appointmentsList');
  const row = appointmentsList.children[index];
  
  if (!row) {
    console.error('No se encontró la fila de la cita');
    return;
  }
  
  const appointment = JSON.parse(row.dataset.appointmentData);
  
  // Determinar estado
  const dateObj = new Date(appointment.date.year, appointment.date.month, appointment.date.day);
  const formattedDate = formatDate(dateObj);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const appointmentDate = new Date(appointment.date.year, appointment.date.month, appointment.date.day);
  appointmentDate.setHours(0, 0, 0, 0);
  const isPastDate = appointmentDate < now;
  
  // Obtener recomendaciones
  const recommendations = serviceRecommendations[appointment.service.id] || [];
  let recommendationsHTML = '';
  
  if (recommendations.length > 0 && !isPastDate) {
    recommendationsHTML = `
      <div class="recommendations-modal">
        <h6>
          <i class="fas fa-clipboard-check"></i>
          Qué debe traer a su cita
        </h6>
        <ul>
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Crear contenido del modal
  const modalContent = `
    <div class="detail-section">
      <h6><i class="fas fa-file-alt"></i> Información de la Cita</h6>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-item-label">Número de Cita</span>
          <span class="detail-item-value">${appointment.appointmentNumber || `SURT-${appointment.id}`}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item-label">Estado</span>
          <span class="detail-item-value">${isPastDate ? '⏱️ Vencido' : '✓ Activo'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item-label">Fecha de Creación</span>
          <span class="detail-item-value">${new Date(appointment.createdAt || Date.now()).toLocaleDateString('es-CO')}</span>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h6><i class="fas fa-user"></i> Datos del Paciente</h6>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-item-label">Nombre Completo</span>
          <span class="detail-item-value">${appointment.personalInfo.fullName}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item-label">Documento</span>
          <span class="detail-item-value">${appointment.personalInfo.documentType} - ${appointment.personalInfo.documentNumber}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item-label">Teléfono</span>
          <span class="detail-item-value">
            <a href="tel:${appointment.personalInfo.phone}" style="color: #0891b2; text-decoration: none;">
              <i class="fas fa-phone"></i> ${appointment.personalInfo.phone}
            </a>
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-item-label">Email</span>
          <span class="detail-item-value" style="font-size: 0.9rem;">
            <a href="mailto:${appointment.personalInfo.email}" style="color: #0891b2; text-decoration: none;">
              <i class="fas fa-envelope"></i> ${appointment.personalInfo.email}
            </a>
          </span>
        </div>
        ${appointment.personalInfo.birthDate ? `
        <div class="detail-item">
          <span class="detail-item-label">Fecha de Nacimiento</span>
          <span class="detail-item-value">${appointment.personalInfo.birthDate}</span>
        </div>
        ` : ''}
        ${appointment.personalInfo.address ? `
        <div class="detail-item">
          <span class="detail-item-label">Dirección</span>
          <span class="detail-item-value">${appointment.personalInfo.address}</span>
        </div>
        ` : ''}
        ${appointment.personalInfo.city ? `
        <div class="detail-item">
          <span class="detail-item-label">Ciudad</span>
          <span class="detail-item-value">${appointment.personalInfo.city}</span>
        </div>
        ` : ''}
      </div>
    </div>

    <div class="detail-section">
      <h6><i class="fas fa-stethoscope"></i> Servicio Solicitado</h6>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-item-label">Servicio</span>
          <span class="detail-item-value">${appointment.service.name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item-label">Precio</span>
          <span class="detail-item-value">${appointment.service.price}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item-label">Duración Estimada</span>
          <span class="detail-item-value">${appointment.service.duration}</span>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h6><i class="fas fa-calendar-check"></i> Fecha y Hora</h6>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-item-label">Fecha</span>
          <span class="detail-item-value">${formattedDate}</span>
        </div>
        <div class="detail-item">
          <span class="detail-item-label">Hora</span>
          <span class="detail-item-value">${appointment.time}</span>
        </div>
      </div>
    </div>

    ${appointment.medicalInfo && Object.keys(appointment.medicalInfo).length > 0 ? `
    <div class="detail-section">
      <h6><i class="fas fa-notes-medical"></i> Información Médica</h6>
      <div class="detail-grid">
        ${appointment.medicalInfo.firstTime ? `
        <div class="detail-item">
          <span class="detail-item-label">¿Primera vez en Surtilentes?</span>
          <span class="detail-item-value">${appointment.medicalInfo.firstTime === 'si' ? 'Sí' : 'No'}</span>
        </div>
        ` : ''}
        ${appointment.medicalInfo.usesGlasses ? `
        <div class="detail-item">
          <span class="detail-item-label">¿Usa lentes o gafas?</span>
          <span class="detail-item-value">${
            appointment.medicalInfo.usesGlasses === 'gafas' ? 'Sí, usa gafas' :
            appointment.medicalInfo.usesGlasses === 'lentes' ? 'Sí, usa lentes de contacto' :
            appointment.medicalInfo.usesGlasses === 'ambos' ? 'Usa ambos' :
            'No usa nada'
          }</span>
        </div>
        ` : ''}
        ${appointment.medicalInfo.hasOldPrescription ? `
        <div class="detail-item">
          <span class="detail-item-label">¿Tiene fórmula anterior?</span>
          <span class="detail-item-value">${appointment.medicalInfo.hasOldPrescription === 'si' ? 'Sí' : 'No'}</span>
        </div>
        ` : ''}
        ${appointment.medicalInfo.mainReason ? `
        <div class="detail-item" style="grid-column: 1 / -1;">
          <span class="detail-item-label">Motivo Principal de la Visita</span>
          <span class="detail-item-value">${
            appointment.medicalInfo.mainReason === 'examen-rutina' ? 'Examen de rutina / Revisión' :
            appointment.medicalInfo.mainReason === 'problemas-vision' ? 'Problemas de visión (no veo bien)' :
            appointment.medicalInfo.mainReason === 'dolor-molestias' ? 'Dolor o molestias en los ojos' :
            appointment.medicalInfo.mainReason === 'comprar-gafas' ? 'Quiero comprar gafas nuevas' :
            appointment.medicalInfo.mainReason === 'cambiar-lentes' ? 'Cambiar o renovar lentes de contacto' :
            appointment.medicalInfo.mainReason === 'segunda-opinion' ? 'Segunda opinión médica' :
            'Otro motivo'
          }</span>
        </div>
        ` : ''}
        ${appointment.medicalInfo.notes ? `
        <div class="detail-item" style="grid-column: 1 / -1;">
          <span class="detail-item-label">Notas Adicionales</span>
          <span class="detail-item-value">${appointment.medicalInfo.notes}</span>
        </div>
        ` : ''}
      </div>
    </div>
    ` : ''}

    ${recommendationsHTML}

    <div class="location-box">
      <h6><i class="fas fa-map-marker-alt"></i> Ubicación de la Óptica</h6>
      <p><strong>SURTILENTES ÓPTICA</strong></p>
      <p>📍 Dirección: Carrera 9 #25-48, Centro Histórico, Cartagena de Indias</p>
      <p>📞 Teléfono: <a href="tel:+5756642580" style="color: #92400e; font-weight: 700;">+57 (5) 664-2580</a></p>
      <p>📱 WhatsApp: <a href="https://wa.me/573105551234" target="_blank" style="color: #92400e; font-weight: 700;">+57 310 555 1234</a></p>
      <p>🕐 Horario: Lunes a Viernes 9:00 AM - 6:00 PM, Sábados 9:00 AM - 2:00 PM</p>
      
      <div style="margin: 20px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125566.92943877657!2d-75.69934580273433!3d10.424229500000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef62f9e5cbd5163%3A0xed97fa68fed08570!2sOptica%20Surtilentes!5e0!3m2!1ses-419!2sco!4v1772569518477!5m2!1ses-419!2sco" 
          width="100%" 
          height="300" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
      
      <a href="https://www.google.com/maps/dir/?api=1&destination=Optica+Surtilentes+Cartagena" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; margin-top: 10px; padding: 10px 20px; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);">
        <i class="fas fa-directions"></i> Cómo Llegar
      </a>
    </div>

    ${!isPastDate ? `
    <div style="background: #f0f9ff; border-radius: 12px; padding: 18px; border: 2px solid #0ea5e9; margin-top: 15px;">
      <p style="color: #0c4a6e; margin: 0; font-weight: 600;">
        <i class="fas fa-info-circle"></i> 
        <strong>Importante:</strong> Por favor llegue 10 minutos antes de su cita. Si necesita cancelar o reprogramar, contáctenos con al menos 24 horas de anticipación.
      </p>
    </div>
    ` : ''}
  `;
  
  document.getElementById('modalDetailContent').innerHTML = modalContent;
  
  // Guardar datos del appointment en el modal para imprimir
  const modalElement = document.getElementById('appointmentDetailModal');
  modalElement.appointmentData = appointment;
  
  // Mostrar modal
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

function showNoResults() {
  const resultsContainer = document.getElementById('resultsContainer');
  const noResults = document.getElementById('noResults');
  
  resultsContainer.style.display = 'none';
  noResults.style.display = 'block';
  
  noResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===================================
// ACCIONES
// ===================================

function printAppointment(appointmentId) {
  console.log(`🖨️ Imprimiendo cita ${appointmentId}`);
  
  // Obtener la cita del modal actual
  const modal = document.getElementById('appointmentDetailModal');
  if (!modal || !modal.appointmentData) {
    alert('No se pudo acceder a los datos de la cita');
    return;
  }
  
  const appointment = modal.appointmentData;
  
  if (!appointment) {
    alert('No se encontró la cita');
    return;
  }
  
  // Crear ventana de impresión
  const dateObj = new Date(appointment.date.year, appointment.date.month, appointment.date.day);
  const formattedDate = formatDate(dateObj);
  
  const recommendations = serviceRecommendations[appointment.service.id] || [];
  let recommendationsHTML = '';
  if (recommendations.length > 0) {
    recommendationsHTML = `
      <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-left: 4px solid #0ea5e9;">
        <h3 style="color: #0369a1; margin-bottom: 15px;">📌 Qué debe traer a su cita:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          ${recommendations.map(rec => `<li style="margin: 8px 0;">${rec}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cita ${appointment.appointmentNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #0A2463;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .title {
          font-size: 28px;
          color: #0A2463;
          margin: 0;
        }
        .subtitle {
          color: #666;
          margin-top: 10px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 18px;
          color: #0A2463;
          border-bottom: 2px solid #00B4D8;
          padding-bottom: 8px;
          margin-bottom: 15px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .info-item {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .info-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        .info-value {
          font-weight: bold;
          color: #0A2463;
          font-size: 16px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">👓</div>
        <h1 class="title">SURTILENTES ÓPTICA</h1>
        <p class="subtitle">Confirmación de Cita</p>
      </div>

      <div class="section">
        <h2 class="section-title">📄 Información de la Cita</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Número de Cita</div>
            <div class="info-value">${appointment.appointmentNumber || `SURT-${appointment.id}`}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Estado</div>
            <div class="info-value">${appointment.status === 'confirmada' ? '✓ Confirmada' : appointment.status}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">👤 Datos del Paciente</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Nombre Completo</div>
            <div class="info-value">${appointment.personalInfo.fullName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Documento</div>
            <div class="info-value">${appointment.personalInfo.documentType} ${appointment.personalInfo.documentNumber}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Teléfono</div>
            <div class="info-value">${appointment.personalInfo.phone}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value" style="font-size: 14px;">${appointment.personalInfo.email}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">📅 Detalles del Servicio</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Servicio</div>
            <div class="info-value">${appointment.service.name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Precio</div>
            <div class="info-value">${appointment.service.price}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Fecha</div>
            <div class="info-value">${formattedDate}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Hora</div>
            <div class="info-value">${appointment.time}</div>
          </div>
        </div>
      </div>

      ${recommendationsHTML}

      <div class="footer">
        <p><strong>SURTILENTES ÓPTICA</strong></p>
        <p>📍 Calle 123 #45-67, Bogotá</p>
        <p>📞 (601) 123 4567 | ✉️ info@surtilentes.com</p>
        <p style="margin-top: 15px; font-size: 12px;">
          Por favor llegue 10 minutos antes de su cita<br>
          Para cancelar o reprogramar, contáctenos con al menos 24 horas de anticipación
        </p>
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// ===================================
// UTILIDADES
// ===================================

function formatDate(date) {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}, ${day} de ${month} de ${year}`;
}

function initializeBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn?.classList.add('show');
    } else {
      backToTopBtn?.classList.remove('show');
    }
  });
  
  backToTopBtn?.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
