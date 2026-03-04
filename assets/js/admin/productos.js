/**
 * SISTEMA DE GESTIÓN DE PRODUCTOS - SURTILENTES ADMIN
 * Panel de administración para añadir, editar y eliminar productos
 */

// API Configuration
const API_URL = typeof API_CONFIG !== 'undefined' ? API_CONFIG.SHEETS_API_URL : null;

// Global variables
let allProducts = [];
let productModal;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Panel de administración de productos inicializado');
  
  // Initialize Bootstrap modal
  productModal = new bootstrap.Modal(document.getElementById('productModal'));
  
  // Load products on start
  loadProducts();
});

// ===================================
// LOAD PRODUCTS
// ===================================

async function loadProducts() {
  const container = document.getElementById('productsContainer');
  
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p class="mt-3">Cargando productos...</p>
    </div>
  `;
  
  if (!API_URL) {
    container.innerHTML = `
      <div class="alert alert-danger">
        <i class="fas fa-exclamation-triangle me-2"></i>
        <strong>Error:</strong> API no configurada. Por favor configura la URL en api-config.js
      </div>
    `;
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}?action=getProducts`, {
      method: 'GET',
      mode: 'cors'
    });
    
    const data = await response.json();
    
    if (data.success && data.products) {
      allProducts = data.products;
      console.log(`✅ ${allProducts.length} productos cargados`);
      displayProducts(allProducts);
    } else {
      displayEmptyState();
    }
    
  } catch (error) {
    console.error('❌ Error al cargar productos:', error);
    container.innerHTML = `
      <div class="alert alert-warning">
        <i class="fas fa-info-circle me-2"></i>
        <strong>Aviso:</strong> No se pudieron cargar los productos desde el servidor. 
        <br><small>Error: ${error.message}</small>
      </div>
    `;
    displayEmptyState();
  }
}

// ===================================
// DISPLAY PRODUCTS
// ===================================

function displayProducts(products) {
  const container = document.getElementById('productsContainer');
  
  if (!products || products.length === 0) {
    displayEmptyState();
    return;
  }
  
  let html = '<div class="row">';
  
  products.forEach(product => {
    const categoryClass = `category-${product.categoria}`;
    const priceFormatted = formatPrice(product.precio);
    const stockStatus = product.stock > 0 
      ? `<span class="badge bg-success">En Stock: ${product.stock}</span>` 
      : '<span class="badge bg-danger">Sin Stock</span>';
    
    html += `
      <div class="col-12 product-card">
        <div class="row align-items-center">
          <div class="col-md-2 text-center">
            <img src="${product.imagen}" alt="${product.nombre}" class="product-image" onerror="this.src='../assets/images/products/logo.jpg'">
          </div>
          <div class="col-md-6 product-info">
            <span class="category-badge ${categoryClass}">${getCategoryName(product.categoria)}</span>
            ${stockStatus}
            <h5 class="mt-2">${product.nombre}</h5>
            <p class="text-muted mb-2">${product.modelo || 'Sin modelo'}</p>
            <p class="mb-0">${truncateText(product.descripcion, 100)}</p>
            <div class="mt-2">
              <small class="text-muted">
                <i class="fas fa-palette me-1"></i> ${product.color || 'N/A'} | 
                <i class="fas fa-ruler me-1"></i> ${product.medidas || 'N/A'} |
                <i class="fas fa-shapes me-1"></i> ${product.forma || 'N/A'}
              </small>
            </div>
          </div>
          <div class="col-md-2 text-center">
            <div class="product-price">${priceFormatted}</div>
          </div>
          <div class="col-md-2 text-center">
            <button class="btn-edit" onclick='editProduct(${JSON.stringify(product).replace(/'/g, "&#39;")})'>
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn-delete" onclick="deleteProduct('${product.id}', '${product.nombre}')">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

function displayEmptyState() {
  const container = document.getElementById('productsContainer');
  container.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-glasses"></i>
      <h4>No hay productos registrados</h4>
      <p>Comienza añadiendo tu primer producto al catálogo</p>
      <button class="btn btn-primary mt-3" onclick="openAddProductModal()">
        <i class="fas fa-plus me-2"></i> Añadir Primer Producto
      </button>
    </div>
  `;
}

// ===================================
// FILTER PRODUCTS
// ===================================

function filterProducts() {
  const categoryFilter = document.getElementById('categoryFilter').value;
  const searchText = document.getElementById('searchInput').value.toLowerCase();
  
  let filteredProducts = allProducts;
  
  // Filter by category
  if (categoryFilter !== 'todas') {
    filteredProducts = filteredProducts.filter(p => p.categoria === categoryFilter);
  }
  
  // Filter by search text
  if (searchText) {
    filteredProducts = filteredProducts.filter(p => 
      p.nombre.toLowerCase().includes(searchText) ||
      (p.modelo && p.modelo.toLowerCase().includes(searchText)) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(searchText))
    );
  }
  
  displayProducts(filteredProducts);
}

// ===================================
// MODAL FUNCTIONS
// ===================================

function openAddProductModal() {
  document.getElementById('modalTitle').innerHTML = `
    <i class="fas fa-plus-circle me-2"></i> Añadir Nuevo Producto
  `;
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  productModal.show();
}

function editProduct(product) {
  document.getElementById('modalTitle').innerHTML = `
    <i class="fas fa-edit me-2"></i> Editar Producto
  `;
  
  // Fill form with product data
  document.getElementById('productId').value = product.id;
  document.getElementById('categoria').value = product.categoria;
  document.getElementById('nombre').value = product.nombre;
  document.getElementById('precio').value = product.precio;
  document.getElementById('modelo').value = product.modelo || '';
  document.getElementById('descripcion').value = product.descripcion;
  document.getElementById('montura').value = product.montura || '';
  document.getElementById('medidas').value = product.medidas || '';
  document.getElementById('forma').value = product.forma || '';
  document.getElementById('color').value = product.color || '';
  document.getElementById('garantia').value = product.garantia || '2 años';
  document.getElementById('imagen').value = product.imagen;
  document.getElementById('stock').value = product.stock || 0;
  
  productModal.show();
}

// ===================================
// SAVE PRODUCT
// ===================================

async function saveProduct() {
  const form = document.getElementById('productForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  const productId = document.getElementById('productId').value;
  const productData = {
    id: productId || `PROD-${Date.now()}`,
    categoria: document.getElementById('categoria').value,
    nombre: document.getElementById('nombre').value,
    precio: parseInt(document.getElementById('precio').value),
    modelo: document.getElementById('modelo').value,
    descripcion: document.getElementById('descripcion').value,
    montura: document.getElementById('montura').value,
    medidas: document.getElementById('medidas').value,
    forma: document.getElementById('forma').value,
    color: document.getElementById('color').value,
    garantia: document.getElementById('garantia').value,
    imagen: document.getElementById('imagen').value,
    stock: parseInt(document.getElementById('stock').value) || 0,
    fechaCreacion: productId ? undefined : new Date().toISOString(),
    fechaModificacion: new Date().toISOString()
  };
  
  console.log('💾 Guardando producto:', productData);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: productId ? 'updateProduct' : 'addProduct',
        product: productData
      })
    });
    
    console.log('✅ Producto guardado exitosamente');
    
    // Close modal
    productModal.hide();
    
    // Show success message
    showSuccessMessage(productId ? 'Producto actualizado correctamente' : 'Producto añadido correctamente');
    
    // Reload products
    setTimeout(() => loadProducts(), 500);
    
  } catch (error) {
    console.error('❌ Error al guardar producto:', error);
    showErrorMessage('Error al guardar el producto: ' + error.message);
  }
}

// ===================================
// DELETE PRODUCT
// ===================================

async function deleteProduct(productId, productName) {
  if (!confirm(`¿Estás seguro de eliminar "${productName}"?\n\nEsta acción no se puede deshacer.`)) {
    return;
  }
  
  console.log('🗑️ Eliminando producto:', productId);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'deleteProduct',
        productId: productId
      })
    });
    
    console.log('✅ Producto eliminado exitosamente');
    
    showSuccessMessage('Producto eliminado correctamente');
    
    // Reload products
    setTimeout(() => loadProducts(), 500);
    
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    showErrorMessage('Error al eliminar el producto: ' + error.message);
  }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function getCategoryName(category) {
  const names = {
    'clasicas': 'Clásicas',
    'deportivas': 'Deportivas',
    'modernas': 'Modernas'
  };
  return names[category] || category;
}

function formatPrice(price) {
  return `$${parseInt(price).toLocaleString('es-CO')}`;
}

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function showSuccessMessage(message) {
  const container = document.getElementById('productsContainer');
  const alert = document.createElement('div');
  alert.className = 'alert alert-success alert-dismissible fade show';
  alert.innerHTML = `
    <i class="fas fa-check-circle me-2"></i>
    <strong>¡Éxito!</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  container.parentElement.insertBefore(alert, container);
  
  setTimeout(() => alert.remove(), 5000);
}

function showErrorMessage(message) {
  const container = document.getElementById('productsContainer');
  const alert = document.createElement('div');
  alert.className = 'alert alert-danger alert-dismissible fade show';
  alert.innerHTML = `
    <i class="fas fa-exclamation-circle me-2"></i>
    <strong>Error:</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  container.parentElement.insertBefore(alert, container);
  
  setTimeout(() => alert.remove(), 5000);
}
