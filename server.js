const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para servir archivos estáticos
app.use(express.static(__dirname));

// Rutas específicas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Ruta para agendar cita
app.get('/agendar-cita', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'agendar-cita.html'));
});

// Ruta para consultar citas
app.get('/consultar-citas', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'consultar-citas.html'));
});

// Catálogos
app.get('/catalogo/:tipo', (req, res) => {
  const tipo = req.params.tipo;
  const validTypes = ['clasicas', 'deportivas', 'modernas'];
  
  if (validTypes.includes(tipo)) {
    res.sendFile(path.join(__dirname, 'pages', 'catalogo', `${tipo}.html`));
  } else {
    res.status(404).send('Catálogo no encontrado');
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Visita: http://localhost:${PORT}`);
});
