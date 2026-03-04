/**
 * CONFIGURACIÓN DE LA API DE GOOGLE SHEETS
 * 
 * INSTRUCCIONES:
 * 1. Seguir los pasos en google-apps-script/citas-api.gs
 * 2. Obtener la URL de implementación
 * 3. Reemplazar 'TU_URL_DE_APPS_SCRIPT_AQUI' con tu URL
 * 
 * La URL debe verse así:
 * https://script.google.com/macros/s/AKfycbx.../exec
 */

const API_CONFIG = {
  // URL del Google Apps Script implementado
  SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbwLVK6yIr9tuEq08jiRtV4rOQrkGQjTFEWnBibnu2K_Goo3X81Jlo3kopvec1FltfNsRA/exec',
  
  // Tiempo de espera para requests (milisegundos)
  TIMEOUT: 8000,
  
  // Modo de desarrollo (usar localStorage como fallback)
  DEV_MODE: false
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
