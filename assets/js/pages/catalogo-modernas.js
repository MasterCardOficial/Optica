// Espera a que todo el contenido del HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Base de Datos de Gafas Modernas (PRECIOS ACTUALIZADOS: $60,000 - $80,000 COP) ---
    const gafasModernas = [
        {
            id: 201,
            nombre: "Montura Geométrica 'Hexa' Ultraligera",
            precio: 75000, // Precio ajustado al rango
            calidad: 'premium',
            tipo: 'formula',
            imagen: '../../assets/images/products/modernas/modernas1.jpg',
            enlace: '#'
        },
        {
            id: 202,
            nombre: "Gafas de Sol 'Futura' Oversize Espejadas",
            precio: 78000, // Precio ajustado al rango
            calidad: 'premium',
            tipo: 'sol',
            imagen: '../../assets/images/products/modernas/modernas2.jpg',
            enlace: '#'
        },
        {
            id: 203,
            nombre: "Montura 'Wireframe' Transparente y Delgada",
            precio: 65000, // Precio ajustado al rango
            calidad: 'estandar',
            tipo: 'formula',
            imagen: '../../assets/images/products/modernas/modernas3.jpg',
            enlace: '#'
        },
        {
            id: 204,
            nombre: "Gafas de Sol Deportivas 'Vanguardia' Polarizado",
            precio: 79000, // Precio ajustado al rango
            calidad: 'premium',
            tipo: 'sol',
            imagen: '../../assets/images/products/modernas/modernas1.jpg',
            enlace: '#'
        },
        {
            id: 205,
            nombre: "Montura Acetato Brillante Color Menta",
            precio: 60000, // Precio ajustado al rango (Mínimo)
            calidad: 'estandar',
            tipo: 'formula',
            imagen: '../../assets/images/products/modernas/modernas2.jpg',
            enlace: '#'
        },
        {
            id: 206,
            nombre: "Gafas 'Escudo' de una Sola Pieza (Shield)",
            precio: 77000, // Precio ajustado al rango
            calidad: 'premium',
            tipo: 'sol',
            imagen: '../../assets/images/products/modernas/modernas3.jpg',
            enlace: '#'
        },
        {
            id: 207,
            nombre: "Montura Moderna 'Nylon' Negro Mate",
            precio: 71000, // Precio ajustado al rango
            calidad: 'estandar',
            tipo: 'formula',
            imagen: '../../assets/images/products/modernas/modernas1.jpg',
            enlace: '#'
        },
        {
            id: 208,
            nombre: "Gafas de Sol con Detalle Metálico en el Puente",
            precio: 74000, // Precio ajustado al rango
            calidad: 'premium',
            tipo: 'sol',
            imagen: '../../assets/images/products/modernas/modernas2.jpg',
            enlace: '#'
        },
        {
            id: 209,
            nombre: "Montura Octagonal en Titanio",
            precio: 80000, // Precio ajustado al rango (Máximo)
            calidad: 'premium',
            tipo: 'formula',
            imagen: '../../assets/images/products/modernas/modernas3.jpg',
            enlace: '#'
        },
        {
            id: 210,
            nombre: "Gafas Modernas de Sol Estilo 'Gafas de Ciclista'",
            precio: 72000, // Precio ajustado al rango
            calidad: 'estandar',
            tipo: 'sol',
            imagen: '../../assets/images/products/modernas/modernas1.jpg',
            enlace: '#'
        },
        {
            id: 211,
            nombre: "Montura Fina Color Azul Eléctrico",
            precio: 63000, // Precio ajustado al rango
            calidad: 'estandar',
            tipo: 'formula',
            imagen: '../../assets/images/products/modernas/modernas2.jpg',
            enlace: '#'
        },
        {
            id: 212,
            nombre: "Gafas de Sol 'Wrap-Around' con Lentes de Colores",
            precio: 76000, // Precio ajustado al rango
            calidad: 'premium',
            tipo: 'sol',
            imagen: '../../assets/images/products/modernas/modernas3.jpg',
            enlace: '#'
        },
        {
            id: 213,
            nombre: "Montura de Diseño 'Half-Rim' Minimalista",
            precio: 67000, // Precio ajustado al rango
            calidad: 'estandar',
            tipo: 'formula',
            imagen: '../../assets/images/products/modernas/modernas1.jpg',
            enlace: '#'
        },
        {
            id: 214,
            nombre: "Gafas de Sol con Estructura Abierta (Cut-Out)",
            precio: 73000, // Precio ajustado al rango
            calidad: 'premium',
            tipo: 'sol',
            imagen: '../../assets/images/products/modernas/modernas2.jpg',
            enlace: '#'
        },
        {
            id: 215,
            nombre: "Montura Cuadrada de Gran Tamaño ('Geek Chic')",
            precio: 61000, // Precio ajustado al rango
            calidad: 'estandar',
            tipo: 'formula',
            imagen: '../../assets/images/products/modernas/modernas3.jpg',
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
        console.error("ERROR: No se pudieron encontrar uno o más elementos del DOM en catalogo_modernas.js.");
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

            // Estructura de la tarjeta de producto (Copiada del diseño original)
            col.innerHTML = `
                <div class="card-product h-100">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="text-muted">
                            Calidad: ${producto.calidad.charAt(0).toUpperCase() + producto.calidad.slice(1)} 
                            - Estilo: ${producto.tipo.charAt(0).toUpperCase() + producto.tipo.slice(1)}
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
        
        const productosFiltrados = gafasModernas.filter(producto => {
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
    mostrarProductos(gafasModernas);

});