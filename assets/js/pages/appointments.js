/**
 * SISTEMA DE AGENDAMIENTO DE CITAS - SURTILENTES
 * Versión 2.0 - Sistema Profesional Completo
 * 
 * FLUJO:
 * 1. Datos Personales (identificación completa)
 * 2. Selección de Servicio
 * 3. Información Médica + Recomendaciones
 * 4. Selección de Fecha
 * 5. Selección de Hora
 * 6. Confirmación y Resumen
 */

// ===================================
// CONFIGURACIÓN API
// ===================================
// Nota: Asegúrate de incluir <script src="../assets/js/config/api-config.js"></script> en el HTML
const API_URL = typeof API_CONFIG !== 'undefined' && API_CONFIG.SHEETS_API_URL !== 'TU_URL_DE_APPS_SCRIPT_AQUI' 
  ? API_CONFIG.SHEETS_API_URL 
  : null;
const DEV_MODE = typeof API_CONFIG !== 'undefined' ? API_CONFIG.DEV_MODE : true;

// ===================================
// ESTADO GLOBAL
// ===================================
const appointmentState = {
  currentStep: 1,
  totalSteps: 6,
  personalInfo: {},
  selectedService: null,
  medicalInfo: {},
  selectedDate: null,
  selectedTime: null,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear()
};

// ===================================
// DATOS Y CONFIGURACIONES
// ===================================

const serviceNames = {
  'examen-visual': 'Examen Visual Completo',
  'lentes-contacto': 'Adaptación Lentes de Contacto',
  'ajuste-monturas': 'Ajuste de Monturas',
  'reparacion': 'Reparación de Gafas',
  'control-vision': 'Control de Visión',
  'asesoria': 'Asesoría de Monturas'
};

// Recomendaciones por servicio
const serviceRecommendations = {
  'examen-visual': [
    'Traiga sus gafas actuales (si las usa)',
    'Traiga su fórmula anterior (si la tiene)',
    'Si usa lentes de contacto, tráigalos puestos o el empaque',
    'Liste los medicamentos que toma actualmente',
    'Venga sin maquillaje en los ojos (facilita el examen)',
    'Evite usar lentes de contacto 24 horas antes del examen',
    'Traiga lista de sus síntomas o molestias visuales'
  ],
  'lentes-contacto': [
    'Traiga su fórmula médica actualizada (obligatorio)',
    'Si ya usa lentes, traiga la caja o empaque',
    'Venga sin maquillaje en los ojos',
    'Traiga sus gafas por si necesita quitarse los lentes',
    'Tenga las manos limpias para la prueba'
  ],
  'ajuste-monturas': [
    'Traiga las gafas que necesitan ajuste',
    'Si tiene el estuche original, tráigalo'
  ],
  'reparacion': [
    'Traiga las gafas que requieren reparación',
    'Si tiene piezas rotas o repuestos, tráigalos',
    'Si es posible, traiga la factura de compra original'
  ],
  'control-vision': [
    'Traiga sus gafas actuales',
    'Traiga su fórmula anterior para comparar',
    'Liste cualquier cambio en su visión desde la última visita'
  ],
  'asesoria': [
    'Traiga su fórmula si ya tiene',
    'Piense en el estilo que le gusta (clásico, moderno, deportivo)',
    'Considere su presupuesto aproximado'
  ]
};

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Sistema de citas inicializado');
  initializeAllHandlers();
  renderCalendar();
  initializeRealTimeValidation();
});

function initializeAllHandlers() {
  initializeServiceCards();
  initializeMedicalInfoForm();
  initializeNavigationButtons();
  initializeCalendarNavigation();
}

// ===================================
// PASO 1: VALIDACIÓN DATOS PERSONALES
// ===================================

function validatePersonalInfo() {
  const form = document.getElementById('personalInfoForm');
  const documentType = document.getElementById('documentType');
  const documentNumber = document.getElementById('documentNumber');
  const fullName = document.getElementById('fullName');
  const birthDate = document.getElementById('birthDate');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');
  const city = document.getElementById('city');
  
  let isValid = true;
  let missingFields = []; // Array para acumular campos faltantes
  
  // Validar tipo de documento
  if (!documentType.value) {
    showFieldError(documentType, 'Seleccione el tipo de documento');
    missingFields.push('Tipo de Documento');
    isValid = false;
  } else {
    showFieldSuccess(documentType);
  }
  
  // Validar número de documento (solo números, 6-12 dígitos)
  const docNumberClean = documentNumber.value.replace(/\D/g, '');
  if (docNumberClean.length < 6 || docNumberClean.length > 12) {
    showFieldError(documentNumber, 'Ingrese un número de documento válido (6-12 dígitos)');
    missingFields.push('Número de Documento (6-12 dígitos)');
    isValid = false;
  } else {
    showFieldSuccess(documentNumber);
    documentNumber.value = docNumberClean; // Guardar solo números
  }
  
  // Validar nombre completo (al menos 2 palabras)
  const nameParts = fullName.value.trim().split(' ').filter(part => part.length > 0);
  if (nameParts.length < 2) {
    showFieldError(fullName, 'Ingrese su nombre y apellidos completos');
    missingFields.push('Nombre Completo (nombre y apellidos)');
    isValid = false;
  } else {
    showFieldSuccess(fullName);
  }
  
  // Validar fecha de nacimiento
  if (!birthDate.value) {
    showFieldError(birthDate, 'Seleccione su fecha de nacimiento');
    missingFields.push('Fecha de Nacimiento');
    isValid = false;
  } else {
    const birthYear = new Date(birthDate.value).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    if (age < 1 || age > 120) {
      showFieldError(birthDate, 'Ingrese una fecha de nacimiento válida');
      missingFields.push('Fecha de Nacimiento (fecha inválida)');
      isValid = false;
    } else {
      showFieldSuccess(birthDate);
    }
  }
  
  // Validar teléfono (10 dígitos)
  const phoneClean = phone.value.replace(/\D/g, '');
  if (phoneClean.length !== 10) {
    showFieldError(phone, 'Ingrese un número de teléfono válido (10 dígitos)');
    missingFields.push('Teléfono/Celular (10 dígitos)');
    isValid = false;
  } else {
    showFieldSuccess(phone);
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    showFieldError(email, 'Ingrese un correo electrónico válido');
    missingFields.push('Correo Electrónico (formato: usuario@ejemplo.com)');
    isValid = false;
  } else {
    showFieldSuccess(email);
  }
  
  // Validar ciudad
  if (!city.value.trim()) {
    showFieldError(city, 'Ingrese su ciudad');
    missingFields.push('Ciudad');
    isValid = false;
  } else {
    showFieldSuccess(city);
  }
  
  // Mostrar modal con los campos faltantes
  if (!isValid && missingFields.length > 0) {
    showValidationModal(missingFields);
    
    // Hacer scroll al primer campo con error
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  if (isValid) {
    // Guardar datos personales
    appointmentState.personalInfo = {
      documentType: documentType.value,
      documentNumber: documentNumber.value,
      fullName: fullName.value.trim(),
      birthDate: birthDate.value,
      phone: phone.value.trim(),
      email: email.value.trim(),
      address: document.getElementById('address').value.trim(),
      city: city.value.trim()
    };
    
    console.log('✅ Datos personales validados:', appointmentState.personalInfo);
  }
  
  return isValid;
}

// ===================================
// PASO 2: SELECCIÓN DE SERVICIO
// ===================================

function initializeServiceCards() {
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', function() {
      serviceCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      
      appointmentState.selectedService = {
        id: this.dataset.service,
        name: this.querySelector('.service-card__title').textContent,
        duration: this.dataset.duration,
        price: this.dataset.price
      };
      
      console.log('✅ Servicio seleccionado:', appointmentState.selectedService);
    });
  });
}

// ===================================
// PASO 3: INFORMACIÓN MÉDICA
// ===================================

function initializeMedicalInfoForm() {
  // Mostrar recomendaciones cuando se seleccione el servicio en paso anterior
  // (Se mostrará cuando llegue al paso 3)
  
  const medicalForm = document.getElementById('medicalInfoForm');
  const radioInputs = medicalForm.querySelectorAll('input[type="radio"]');
  
  radioInputs.forEach(input => {
    input.addEventListener('change', function() {
      updateRecommendationsBox();
    });
  });
  
  const mainReason = document.getElementById('mainReason');
  mainReason?.addEventListener('change', updateRecommendationsBox);
}

function updateRecommendationsBox() {
  const recommendationsBox = document.getElementById('recommendationsBox');
  const recommendationsContent = document.getElementById('recommendationsContent');
  
  if (!appointmentState.selectedService) return;
  
  const recommendations = serviceRecommendations[appointmentState.selectedService.id] || [];
  
  if (recommendations.length > 0) {
    let html = '<ul class="recommendations-list">';
    recommendations.forEach(rec => {
      html += `<li>✓ ${rec}</li>`;
    });
    html += '</ul>';
    
    recommendationsContent.innerHTML = html;
    recommendationsBox.style.display = 'block';
  }
}

function validateMedicalInfo() {
  const firstTime = document.querySelector('input[name="firstTime"]:checked');
  const usesGlasses = document.querySelector('input[name="usesGlasses"]:checked');
  const hasOldPrescription = document.querySelector('input[name="hasOldPrescription"]:checked');
  const mainReason = document.getElementById('mainReason');
  
  let missingFields = [];
  
  if (!firstTime) {
    missingFields.push('¿Es su primera vez en Surtilentes?');
  }
  
  if (!usesGlasses) {
    missingFields.push('¿Usa gafas o lentes de contacto?');
  }
  
  if (!hasOldPrescription) {
    missingFields.push('¿Tiene una fórmula anterior?');
  }
  
  if (!mainReason.value) {
    missingFields.push('Motivo principal de su visita');
  }
  
  // Mostrar modal con los campos faltantes
  if (missingFields.length > 0) {
    showValidationModal(missingFields);
    
    // Hacer scroll al formulario
    document.getElementById('medicalInfoForm')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return false;
  }
  
  // Guardar información médica
  appointmentState.medicalInfo = {
    firstTime: firstTime.value,
    usesGlasses: usesGlasses.value,
    hasOldPrescription: hasOldPrescription.value,
    mainReason: mainReason.value,
    notes: document.getElementById('medicalNotes').value.trim()
  };
  
  console.log('✅ Información médica guardada:', appointmentState.medicalInfo);
  return true;
}

// ===================================
// PASO 4: CALENDARIO
// ===================================

function renderCalendar() {
  const calendarDays = document.getElementById('calendarDays');
  const currentMonthDisplay = document.getElementById('currentMonth');
  
  if (!calendarDays || !currentMonthDisplay) return;
  
  currentMonthDisplay.textContent = `${monthNames[appointmentState.currentMonth]} ${appointmentState.currentYear}`;
  
  calendarDays.innerHTML = '';
  
  const firstDay = new Date(appointmentState.currentYear, appointmentState.currentMonth, 1).getDay();
  const daysInMonth = new Date(appointmentState.currentYear, appointmentState.currentMonth + 1, 0).getDate();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Días vacíos antes del mes
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    calendarDays.appendChild(emptyDay);
  }
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(appointmentState.currentYear, appointmentState.currentMonth, day);
    dateObj.setHours(0, 0, 0, 0);
    
    const dayElement = document.createElement('div');
    dayElement.classList.add('calendar-day');
    dayElement.textContent = day;
    
    if (dateObj.getTime() === today.getTime()) {
      dayElement.classList.add('today');
    }
    
    const dayOfWeek = dateObj.getDay();
    // Deshabilitar: fechas pasadas, domingos
    if (dateObj < today || dayOfWeek === 0) {
      dayElement.classList.add('disabled');
    } else {
      dayElement.addEventListener('click', function() {
        if (!this.classList.contains('disabled')) {
          document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
          this.classList.add('selected');
          
          appointmentState.selectedDate = {
            day: day,
            month: appointmentState.currentMonth,
            year: appointmentState.currentYear,
            dateObj: dateObj
          };
          
          console.log('✅ Fecha seleccionada:', appointmentState.selectedDate);
        }
      });
    }
    
    calendarDays.appendChild(dayElement);
  }
}

function initializeCalendarNavigation() {
  document.getElementById('prevMonth')?.addEventListener('click', function() {
    appointmentState.currentMonth--;
    if (appointmentState.currentMonth < 0) {
      appointmentState.currentMonth = 11;
      appointmentState.currentYear--;
    }
    renderCalendar();
  });
  
  document.getElementById('nextMonth')?.addEventListener('click', function() {
    appointmentState.currentMonth++;
    if (appointmentState.currentMonth > 11) {
      appointmentState.currentMonth = 0;
      appointmentState.currentYear++;
    }
    renderCalendar();
  });
}

// ===================================
// PASO 5: SELECCIÓN DE HORA
// ===================================

// ===================================
// PASO 5: INFORMACIÓN DE ATENCIÓN POR LLEGADA
// ===================================

function setupArrivalInfo() {
  const selectedDateDisplay = document.getElementById('selectedDateDisplay');
  const selectedServiceDisplay = document.getElementById('selectedServiceDisplay');
  
  // Mostrar fecha seleccionada
  selectedDateDisplay.textContent = formatDate(appointmentState.selectedDate.dateObj);
  
  // Mostrar servicio seleccionado
  selectedServiceDisplay.textContent = appointmentState.selectedService.name;
  
  // Establecer que se atiende por orden de llegada (sin hora específica)
  appointmentState.selectedTime = 'Por orden de llegada';
  
  console.log('✅ Paso 5: Información de atención por orden de llegada configurada');
}

// ===================================
// PASO 6: CONFIRMACIÓN
// ===================================

async function displayConfirmation() {
  // Llenar todos los campos del resumen
  document.getElementById('summaryDocument').textContent = 
    `${appointmentState.personalInfo.documentType} ${appointmentState.personalInfo.documentNumber}`;
  document.getElementById('summaryName').textContent = appointmentState.personalInfo.fullName;
  document.getElementById('summaryPhone').textContent = appointmentState.personalInfo.phone;
  document.getElementById('summaryEmail').textContent = appointmentState.personalInfo.email;
  document.getElementById('summaryService').textContent = appointmentState.selectedService.name;
  document.getElementById('summaryDate').textContent = formatDate(appointmentState.selectedDate.dateObj);
  document.getElementById('summaryTime').textContent = appointmentState.selectedTime;
  document.getElementById('summaryDuration').textContent = appointmentState.selectedService.duration;
  document.getElementById('summaryPrice').textContent = appointmentState.selectedService.price;
  document.getElementById('confirmEmailDisplay').textContent = appointmentState.personalInfo.email;
  
  // Mostrar recomendaciones finales
  const finalRecommendationsList = document.getElementById('finalRecommendationsList');
  const recommendations = serviceRecommendations[appointmentState.selectedService.id] || [];
  
  let html = '';
  recommendations.forEach(rec => {
    html += `<li>✓ ${rec}</li>`;
  });
  finalRecommendationsList.innerHTML = html;
  
  // Guardar la cita
  const savedAppointment = await saveAppointment();
  
  // Nota: El email de confirmación se envía automáticamente desde Google Apps Script
  // después de guardar la cita. No requiere código adicional aquí.
  console.log('📧 Email de confirmación programado para envío automático');
  
  // Establecer fecha de impresión para el documento
  const confirmationContainer = document.querySelector('.confirmation-container');
  if (confirmationContainer) {
    const now = new Date();
    const printDate = now.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    confirmationContainer.setAttribute('data-print-date', printDate);
  }
  
  console.log('✅ Cita confirmada y guardada');
}

async function saveAppointment() {
  const appointment = {
    id: Date.now(),
    appointmentNumber: `SURT-${Date.now()}`,
    personalInfo: appointmentState.personalInfo,
    service: appointmentState.selectedService,
    medicalInfo: appointmentState.medicalInfo,
    date: appointmentState.selectedDate,
    time: appointmentState.selectedTime,
    status: 'confirmada',
    createdAt: new Date().toISOString()
  };
  
  // Intentar guardar en Google Sheets
  if (API_URL && !DEV_MODE) {
    try {
      console.log('📤 Guardando cita en Google Sheets...');
      
      const response = await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script requiere no-cors
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment)
      });
      
      console.log('✅ Cita guardada en Google Sheets');
      
      // También guardar en localStorage como backup
      saveToLocalStorage(appointment);
      
      return appointment;
      
    } catch (error) {
      console.error('❌ Error al guardar en Google Sheets:', error);
      console.log('💾 Guardando en localStorage como fallback');
      
      // Fallback a localStorage
      saveToLocalStorage(appointment);
      return appointment;
    }
  } else {
    // Modo desarrollo o sin API configurada
    console.log('💾 Modo desarrollo: Guardando solo en localStorage');
    saveToLocalStorage(appointment);
    return appointment;
  }
}

function saveToLocalStorage(appointment) {
  let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  appointments.push(appointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));
  console.log('💾 Cita guardada en localStorage:', appointment);
}

// ===================================
// NAVEGACIÓN ENTRE PASOS
// ===================================

function initializeNavigationButtons() {
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  
  nextBtn.addEventListener('click', function() {
    if (validateCurrentStep()) {
      goToNextStep();
    }
  });
  
  prevBtn.addEventListener('click', function() {
    goToPreviousStep();
  });
}

function validateCurrentStep() {
  const currentStep = appointmentState.currentStep;
  
  switch(currentStep) {
    case 1:
      return validatePersonalInfo();
      
    case 2:
      if (!appointmentState.selectedService) {
        showValidationModal(['Debe seleccionar un servicio']);
        // Hacer scroll a los servicios
        document.getElementById('servicesGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return false;
      }
      return true;
      
    case 3:
      return validateMedicalInfo();
      
    case 4:
      if (!appointmentState.selectedDate) {
        showValidationModal(['Debe seleccionar una fecha del calendario']);
        // Hacer scroll al calendario
        document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return false;
      }
      return true;
      
    case 5:
      // Paso 5 solo es informativo (atención por orden de llegada)
      // No requiere validación, siempre pasa
      return true;
      
    default:
      return true;
  }
}

function goToNextStep() {
  if (appointmentState.currentStep < appointmentState.totalSteps) {
    appointmentState.currentStep++;
    updateStepDisplay();
    
    // Acciones especiales por paso
    if (appointmentState.currentStep === 3) {
      updateRecommendationsBox();
    } else if (appointmentState.currentStep === 5) {
      setupArrivalInfo();
    } else if (appointmentState.currentStep === 6) {
      displayConfirmation();
    }
  }
}

function goToPreviousStep() {
  if (appointmentState.currentStep > 1) {
    appointmentState.currentStep--;
    updateStepDisplay();
  }
}

function updateStepDisplay() {
  const currentStep = appointmentState.currentStep;
  
  // Hacer scroll al inicio ANTES de cambiar el contenido
  const formCard = document.querySelector('.form-card');
  if (formCard) {
    // Scroll al inicio del form-card con margen superior
    const yOffset = -20; // 20px de margen superior
    const y = formCard.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  
  // Agregar animación de salida al paso actual antes de cambiar
  const activeContent = document.querySelector('.step-content.active');
  if (activeContent) {
    activeContent.classList.add('exiting');
    
    // Esperar a que termine la animación de salida antes de cambiar
    setTimeout(() => {
      // Actualizar contenido visible
      document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active', 'exiting');
      });
      
      const newContent = document.querySelector(`.step-content[data-step="${currentStep}"]`);
      if (newContent) {
        newContent.classList.add('active');
      }
    }, 300); // Duración de la animación de salida
  } else {
    // Primera carga, no hay animación de salida
    document.querySelectorAll('.step-content').forEach(content => {
      content.classList.remove('active');
    });
    document.querySelector(`.step-content[data-step="${currentStep}"]`)?.classList.add('active');
  }
  
  // Actualizar indicador de progreso con animación
  document.querySelectorAll('.progress-step').forEach(step => {
    const stepNum = parseInt(step.dataset.step);
    step.classList.remove('active', 'completed');
    
    if (stepNum < currentStep) {
      step.classList.add('completed');
      // Animar el número del paso
      const stepNumber = step.querySelector('.progress-step__number');
      if (stepNumber) {
        stepNumber.style.animation = 'none';
        setTimeout(() => {
          stepNumber.style.animation = 'pulse 0.4s ease-out';
        }, 10);
      }
    } else if (stepNum === currentStep) {
      step.classList.add('active');
      // Animar el paso activo
      const stepNumber = step.querySelector('.progress-step__number');
      if (stepNumber) {
        stepNumber.style.animation = 'none';
        setTimeout(() => {
          stepNumber.style.animation = 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, 10);
      }
    }
  });
  
  // Animar divisores completados
  document.querySelectorAll('.progress-divider').forEach((divider, index) => {
    if (index < currentStep - 1) {
      divider.classList.add('completed');
    } else {
      divider.classList.remove('completed');
    }
  });
  
  // Actualizar botones de navegación
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const navigationButtons = document.getElementById('navigationButtons');
  
  prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
  
  if (currentStep === 6) {
    navigationButtons.style.display = 'none';
  } else {
    navigationButtons.style.display = 'flex';
    
    if (currentStep === 5) {
      nextBtn.textContent = 'Confirmar Cita ✓';
      nextBtn.classList.remove('btn--primary');
      nextBtn.classList.add('btn--accent');
    } else {
      nextBtn.textContent = 'Siguiente →';
      nextBtn.classList.remove('btn--accent');
      nextBtn.classList.add('btn--primary');
    }
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// FUNCIONES AUXILIARES
// ===================================

function formatDate(date) {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}, ${day} de ${month} de ${year}`;
}

function showFieldError(field, message) {
  const formGroup = field.closest('.form-group');
  formGroup.classList.remove('form-group--valid');
  formGroup.classList.add('form-group--invalid');
  
  const feedback = formGroup.querySelector('.form-feedback--invalid');
  if (feedback && message) {
    feedback.textContent = message;
  }
}

function showFieldSuccess(field) {
  const formGroup = field.closest('.form-group');
  formGroup.classList.remove('form-group--invalid');
  formGroup.classList.add('form-group--valid');
}

// ===================================
// MODAL DE VALIDACIÓN
// ===================================

function showValidationModal(missingFields) {
  const modalList = document.getElementById('validationModalList');
  if (!modalList) return;
  
  // Limpiar lista
  modalList.innerHTML = '';
  
  // Agregar cada campo faltante
  missingFields.forEach((field, index) => {
    const li = document.createElement('li');
    li.style.cssText = 'padding: 12px 16px; margin-bottom: 10px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px; display: flex; align-items: center; gap: 12px; font-size: 0.95rem;';
    li.innerHTML = `
      <span style="background: #ffc107; color: #000; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">${index + 1}</span>
      <span style="color: #856404; font-weight: 500;">${field}</span>
    `;
    modalList.appendChild(li);
  });
  
  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById('validationModal'));
  modal.show();
}

// ===================================
// VALIDACIÓN EN TIEMPO REAL
// ===================================

function initializeRealTimeValidation() {
  // Tipo de documento
  const documentType = document.getElementById('documentType');
  documentType?.addEventListener('change', function() {
    if (this.value) {
      showFieldSuccess(this);
    } else {
      showFieldError(this, 'Seleccione el tipo de documento');
    }
  });
  
  // Número de documento
  const documentNumber = document.getElementById('documentNumber');
  documentNumber?.addEventListener('input', function() {
    const clean = this.value.replace(/\D/g, '');
    if (clean.length >= 6 && clean.length <= 12) {
      showFieldSuccess(this);
    } else if (clean.length > 0) {
      showFieldError(this, `${clean.length}/10 dígitos`);
    }
  });
  
  // Nombre completo
  const fullName = document.getElementById('fullName');
  fullName?.addEventListener('input', function() {
    const parts = this.value.trim().split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      showFieldSuccess(this);
    } else if (this.value.length > 0) {
      showFieldError(this, 'Ingrese nombre y apellidos');
    }
  });
  
  // Fecha de nacimiento
  const birthDate = document.getElementById('birthDate');
  birthDate?.addEventListener('change', function() {
    if (this.value) {
      const year = new Date(this.value).getFullYear();
      const age = new Date().getFullYear() - year;
      if (age >= 1 && age <= 120) {
        showFieldSuccess(this);
      } else {
        showFieldError(this, 'Fecha inválida');
      }
    }
  });
  
  // Teléfono
  const phone = document.getElementById('phone');
  phone?.addEventListener('input', function() {
    const clean = this.value.replace(/\D/g, '');
    if (clean.length === 10) {
      showFieldSuccess(this);
    } else if (clean.length > 0) {
      showFieldError(this, `${clean.length}/10 dígitos`);
    }
  });
  
  // Email
  const email = document.getElementById('email');
  email?.addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.value)) {
      showFieldSuccess(this);
    } else if (this.value.length > 0) {
      showFieldError(this, 'Formato: usuario@ejemplo.com');
    }
  });
  
  // Ciudad
  const city = document.getElementById('city');
  city?.addEventListener('input', function() {
    if (this.value.trim().length > 2) {
      showFieldSuccess(this);
    } else if (this.value.length > 0) {
      showFieldError(this, 'Ingrese su ciudad');
    }
  });
}

// ===================================
// BACK TO TOP BUTTON
// ===================================

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
