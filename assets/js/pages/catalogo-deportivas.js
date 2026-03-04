// Espera a que todo el contenido del HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Base de Datos de Gafas Deportivas (PRECIOS ACTUALIZADOS: $60,000 - $80,000 COP) ---
    const gafasDeportivas = [
        {
            id: 301,
            nombre: "Gafas de Ciclismo Pro Lente Intercambiable",
            precio: 75000, // Precio ajustado al rango (antes 250000)
            calidad: 'profesional',
            tipo: 'ciclismo',
            imagen: '../../assets/images/products/deportivas/gafas1.jpg',
            enlace: '#'
        },
        {
            id: 302,
            nombre: "Lentes de Running Ultraligeros con Ventilación",
            precio: 68000, // Precio ajustado al rango (antes 180000)
            calidad: 'profesional',
            tipo: 'running',
            imagen: '../../assets/images/products/deportivas/gafas2.jpg',
            enlace: '#'
        },
        {
            id: 303,
            nombre: "Gafas de Sol para Natación Antiempañamiento",
            precio: 62000, // Precio ajustado al rango (antes 95000)
            calidad: 'recreativa',
            tipo: 'acuatico',
            imagen: '../../assets/images/products/deportivas/gafas3.jpg',
            enlace: '#'
        },
        {
            id: 304,
            nombre: "Gafas Deportivas Versátiles con Correa",
            precio: 65000, // Precio ajustado al rango (antes 120000)
            calidad: 'recreativa',
            tipo: 'running',
            imagen: '../../assets/images/products/deportivas/gafas1.jpg',
            enlace: '#'
        },
        {
            id: 305,
            nombre: "Montura Deportiva para Fórmula (Anti-Impacto)",
            precio: 79000, // Precio ajustado al rango (antes 215000)
            calidad: 'profesional',
            tipo: 'ciclismo',
            imagen: '../../assets/images/products/deportivas/gafas2.jpg',
            enlace: '#'
        },
        {
            id: 306,
            nombre: "Gafas de Triatlón con Lentes Fotocromáticas",
            precio: 78000, // Precio ajustado al rango (antes 350000)
            calidad: 'profesional',
            tipo: 'ciclismo',
            imagen: '../../assets/images/products/deportivas/gafas3.jpg',
            enlace: '#'
        },
        {
            id: 307,
            nombre: "Lentes de Sol para Mar y Playa Polarizados",
            precio: 71000, // Precio ajustado al rango (antes 145000)
            calidad: 'recreativa',
            tipo: 'acuatico',
            imagen: '../../assets/images/products/deportivas/gafas1.jpg',
            enlace: '#'
        },
        {
            id: 308,
            nombre: "Gafas de Trail Running con Agarre Antideslizante",
            precio: 76000, // Precio ajustado al rango (antes 220000)
            calidad: 'profesional',
            tipo: 'running',
            imagen: '../../assets/images/products/deportivas/gafas2.jpg',
            enlace: '#'
        },
        {
            id: 309,
            nombre: "Gafas Deportivas para Niños (Correa Ajustable)",
            precio: 60000, // Precio ajustado al rango (antes 85000) - Mínimo del rango
            calidad: 'recreativa',
            tipo: 'acuatico',
            imagen: '../../assets/images/products/deportivas/gafas3.jpg',
            enlace: '#'
        },
        {
            id: 310,
            nombre: "Modelo Aerodinámico para Carretera",
            precio: 80000, // Precio ajustado al rango (antes 280000) - Máximo del rango
            calidad: 'profesional',
            tipo: 'ciclismo',
            imagen: '../../assets/images/products/deportivas/gafas1.jpg',
            enlace: '#'
        },
        {
            id: 311,
            nombre: "Gafas de Sol para Entrenamiento en Pista",
            precio: 69000, // Precio ajustado al rango (antes 160000)
            calidad: 'recreativa',
            tipo: 'running',
            imagen: '../../assets/images/products/deportivas/gafas2.jpg',
            enlace: '#'
        },
        {
            id: 312,
            nombre: "Gafas Polarizadas con Montura Flotante",
            precio: 73000, // Precio ajustado al rango (antes 190000)
            calidad: 'profesional',
            tipo: 'acuatico',
            imagen: '../../assets/images/products/deportivas/gafas3.jpg',
            enlace: '#'
        }
    ];

    // --- 2. Selección de Elementos del DOM ---
    const grid = document.getElementById('productos-grid');
    const noResultados = document.getElementById('no-resultados');
    
    // Inputs de filtros
    const filtroNombre = document.getElementById('filtro-nombre');
    const filtroPrecioMin = document.getElementById('filtro-precio-min');
    const filtroPrecioMax = document.getElementById('filtro-precio-max');
    const filtroCalidad = document.getElementById('filtro-calidad');
    const filtroTipo = document.getElementById('filtro-tipo');
    const btnLimpiar = document.getElementById('btn-limpiar');

    // Verificación de elementos (para depuración)
    if (!grid || !filtroNombre || !filtroPrecioMin || !filtroPrecioMax || !filtroCalidad || !filtroTipo || !btnLimpiar) {
        console.error("ERROR: No se pudieron encontrar uno o más elementos del DOM en catalogo_deportivas.js.");
        return; 
    }

    // --- 3. Función para Mostrar los Productos en el HTML ---
    function mostrarProductos(productos) {
        grid.innerHTML = '';

        if (productos.length === 0) {
            noResultados.style.display = 'block';
        } else {
            noResultados.style.display = 'none';
        }

        productos.forEach(producto => {
            const precioFormateado = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            }).format(producto.precio);

            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6 mb-4 animate__animated animate__fadeIn'; 

            // Estructura de la tarjeta de producto
            col.innerHTML = `
                <div class="card-product h-100">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="text-muted">
                            Calidad: ${producto.calidad.charAt(0).toUpperCase() + producto.calidad.slice(1)} 
                            - Uso: ${producto.tipo.charAt(0).toUpperCase() + producto.tipo.slice(1)}
                        </p>
                        <p class="price">${precioFormateado}</p>
                        <a href="${producto.enlace}" class="btn-custom w-100 text-center mt-auto">
                            Consultar <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `;
            grid.appendChild(col);
        });
    }

    // --- 4. Función Principal de Filtrado ---
    function aplicarFiltros() {
        const nombre = filtroNombre.value.toLowerCase();
        const minPrecio = parseFloat(filtroPrecioMin.value) || 0;
        const maxPrecio = parseFloat(filtroPrecioMax.value) || Infinity;
        const calidad = filtroCalidad.value;
        const tipo = filtroTipo.value;
        
        const productosFiltrados = gafasDeportivas.filter(producto => {
            const pasaNombre = producto.nombre.toLowerCase().includes(nombre);
            const pasaPrecio = producto.precio >= minPrecio && producto.precio <= maxPrecio;
            const pasaCalidad = (calidad === 'todas') || (producto.calidad === calidad);
            const pasaTipo = (tipo === 'todos') || (producto.tipo === tipo);

            return pasaNombre && pasaPrecio && pasaCalidad && pasaTipo;
        });

        mostrarProductos(productosFiltrados);
    }

    // --- 5. Función para Limpiar Filtros ---
    function limpiarFiltros() {
        filtroNombre.value = '';
        filtroPrecioMin.value = '';
        filtroPrecioMax.value = '';
        filtroCalidad.value = 'todas';
        filtroTipo.value = 'todos';
        aplicarFiltros();
    }

    // --- 6. Añadir "Escuchadores" de Eventos ---
    filtroNombre.addEventListener('input', aplicarFiltros);
    filtroPrecioMin.addEventListener('input', aplicarFiltros);
    filtroPrecioMax.addEventListener('input', aplicarFiltros);
    filtroCalidad.addEventListener('change', aplicarFiltros);
    filtroTipo.addEventListener('change', aplicarFiltros);
    btnLimpiar.addEventListener('click', limpiarFiltros);

    // --- 7. Carga Inicial ---
    mostrarProductos(gafasDeportivas);

});