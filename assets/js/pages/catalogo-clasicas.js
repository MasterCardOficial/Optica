// Espera a que todo el contenido del HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Base de Datos de Gafas Clásicas (PRECIOS ACTUALIZADOS: $60,000 - $80,000 COP) ---
    const gafasClasicas = [
        {
            id: 1,
            nombre: "Gafas de Montura Cat Eye Carolina Herrera",
            precio: 79000, // Precio ajustado al rango (antes 89900)
            calidad: 'alta',
            tipo: 'formula',
            imagen: '../../assets/images/products/clasicas/clasicas1.jpg',
            enlace: '../productos/gafas-de-clasica1.html'
        },
        {
            id: 2,
            nombre: "Montura Oftálmica Swarovski Estilo Cuadrado",
            precio: 75000, // Precio ajustado al rango (antes 95900)
            calidad: 'alta',
            tipo: 'formula',
            imagen: '../../assets/images/products/clasicas/casicas2.jpg',
            enlace: '../productos/gafas-de-clasica2.html'
        },
        {
            id: 3,
            nombre: "Montura Oftálmica New Look Transparente",
            precio: 80000, // Precio ajustado al rango (Máximo)
            calidad: 'media',
            tipo: 'formula',
            imagen: '../../assets/images/products/clasicas/casicas3.jpg',
            enlace: '../productos/gafas-de-clasica3.html'
        },
        {
            id: 4,
            nombre: "Gafas de Sol Clásicas 'Aviador'",
            precio: 70000, // Precio ajustado al rango (antes 120000)
            calidad: 'alta',
            tipo: 'sol',
            imagen: '../../assets/images/products/clasicas/clasicas1.jpg',
            enlace: '#'
        },
        {
            id: 5,
            nombre: "Montura Clásica 'Retro 80s'",
            precio: 68000, // Precio ajustado al rango (antes 75000)
            calidad: 'media',
            tipo: 'sol',
            imagen: '../../assets/images/products/clasicas/casicas2.jpg',
            enlace: '#'
        },
        {
            id: 6,
            nombre: "Gafas 'Intelectual' Montura Redonda",
            precio: 77000, // Precio ajustado al rango (antes 110000)
            calidad: 'alta',
            tipo: 'formula',
            imagen: '../../assets/images/products/clasicas/casicas3.jpg',
            enlace: '#'
        },
        {
            id: 7,
            nombre: "Montura 'Wayfarer' Clásica Negra",
            precio: 71000, // Precio ajustado al rango (antes 85000)
            calidad: 'media',
            tipo: 'sol',
            imagen: '../../assets/images/products/clasicas/clasicas1.jpg',
            enlace: '#'
        },
        {
            id: 8,
            nombre: "Gafas de Sol 'Clubmaster' Estilo Clásico",
            precio: 74000, // Precio ajustado al rango (antes 130000)
            calidad: 'alta',
            tipo: 'sol',
            imagen: '../../assets/images/products/clasicas/casicas2.jpg',
            enlace: '#'
        },
        {
            id: 9,
            nombre: "Montura Metálica Dorada (Delgada)",
            precio: 62000, // Precio ajustado al rango (antes 92000)
            calidad: 'media',
            tipo: 'formula',
            imagen: '../../assets/images/products/clasicas/casicas3.jpg',
            enlace: '#'
        },
        // --- NUEVOS PRODUCTOS AÑADIDOS con precios ajustados ---
        {
            id: 10,
            nombre: "Gafas Clásicas 'Ojo de Gato' Rojas",
            precio: 76000, // Precio ajustado al rango (antes 98000)
            calidad: 'alta',
            tipo: 'sol',
            imagen: '../../assets/images/products/clasicas/clasicas1.jpg',
            enlace: '#'
        },
        {
            id: 11,
            nombre: "Montura Clásica 'John Lennon' Circular",
            precio: 65000, // Precio ajustado al rango (antes 65000)
            calidad: 'media',
            tipo: 'formula',
            imagen: '../../assets/images/products/clasicas/casicas2.jpg',
            enlace: '#'
        },
        {
            id: 12,
            nombre: "Gafas de Sol 'Mariposa' Grandes",
            precio: 73000, // Precio ajustado al rango (antes 115000)
            calidad: 'alta',
            tipo: 'sol',
            imagen: '../../assets/images/products/clasicas/casicas3.jpg',
            enlace: '#'
        },
        {
            id: 13,
            nombre: "Montura Clásica Rectangular Acetato",
            precio: 78000, // Precio ajustado al rango (antes 78000)
            calidad: 'media',
            tipo: 'formula',
            imagen: '../../assets/images/products/clasicas/clasicas1.jpg',
            enlace: '#'
        },
        {
            id: 14,
            nombre: "Gafas de Sol 'Aviador' Espejadas",
            precio: 66000, // Precio ajustado al rango (antes 140000)
            calidad: 'alta',
            tipo: 'sol',
            imagen: '../../assets/images/products/clasicas/casicas2.jpg',
            enlace: '#'
        },
        {
            id: 15,
            nombre: "Montura 'Browline' Clásica Bicolor",
            precio: 69000, // Precio ajustado al rango (antes 105000)
            calidad: 'alta',
            tipo: 'formula',
            imagen: '../../assets/images/products/clasicas/casicas3.jpg',
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

    // --- NUEVO: Verificación de elementos ---
    if (!grid || !filtroNombre || !filtroPrecioMin || !filtroPrecioMax || !filtroCalidad || !filtroTipo || !btnLimpiar) {
        console.error("ERROR: No se pudieron encontrar uno o más elementos del DOM.");
        console.error("Asegúrate de que los 'id' en tu HTML coincidan con los 'getElementById' en tu JS.");
        console.log("Elementos encontrados:", {
            grid,
            noResultados,
            filtroNombre,
            filtroPrecioMin,
            filtroPrecioMax,
            filtroCalidad,
            filtroTipo,
            btnLimpiar
        });
        // Detiene la ejecución si falta un elemento clave
        return; 
    }
    
    console.log("Script de catálogo cargado correctamente. Todos los elementos fueron encontrados.");

    // --- 3. Función para Mostrar los Productos en el HTML ---
    function mostrarProductos(productos) {
        // Limpia la cuadrícula actual
        grid.innerHTML = '';

        // Comprueba si hay productos para mostrar
        if (productos.length === 0) {
            noResultados.style.display = 'block';
        } else {
            noResultados.style.display = 'none';
        }

        // Itera sobre cada producto y crea su tarjeta HTML
        productos.forEach(producto => {
            // Formatea el precio a moneda (ej: 89900 -> $89.900)
            const precioFormateado = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            }).format(producto.precio);

            // Crea el elemento de la columna
            const col = document.createElement('div');
            // He añadido 'animate__fadeIn' para una animación suave al filtrar
            col.className = 'col-lg-4 col-md-6 mb-4 animate__animated animate__fadeIn'; 

            // Esta estructura HTML es la misma que la de tu .card-product
            col.innerHTML = `
                <div class="card-product h-100">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="text-muted">
                            Calidad: ${producto.calidad.charAt(0).toUpperCase() + producto.calidad.slice(1)} 
                            - Tipo: ${producto.tipo.charAt(0).toUpperCase() + producto.tipo.slice(1)}
                        </p>
                        <p class="price">${precioFormateado}</p>
                        <a href="${producto.enlace}" class="btn-custom w-100 text-center mt-auto">
                            Consultar <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `;
            // Añade la nueva columna a la cuadrícula
            grid.appendChild(col);
        });
    }

    // --- 4. Función Principal de Filtrado ---
    function aplicarFiltros() {
        // Obtiene los valores actuales de todos los filtros
        const nombre = filtroNombre.value.toLowerCase();
        // Convierte a número. Si está vacío, usa 0
        const minPrecio = parseFloat(filtroPrecioMin.value) || 0;
        // Si está vacío, usa un número muy grande (Infinito)
        const maxPrecio = parseFloat(filtroPrecioMax.value) || Infinity;
        const calidad = filtroCalidad.value;
        const tipo = filtroTipo.value;
        
        // Aplica los filtros a la base de datos
        const productosFiltrados = gafasClasicas.filter(producto => {
            // Filtro por Nombre
            const pasaNombre = producto.nombre.toLowerCase().includes(nombre);
            // Filtro por Precio
            const pasaPrecio = producto.precio >= minPrecio && producto.precio <= maxPrecio;
            // Filtro por Calidad
            const pasaCalidad = (calidad === 'todas') || (producto.calidad === calidad);
            // Filtro por Tipo
            const pasaTipo = (tipo === 'todos') || (producto.tipo === tipo);

            // El producto solo pasa si cumple TODAS las condiciones
            return pasaNombre && pasaPrecio && pasaCalidad && pasaTipo;
        });

        // Muestra los productos que pasaron el filtro
        mostrarProductos(productosFiltrados);
    }

    // --- 5. Función para Limpiar Filtros ---
    function limpiarFiltros() {
        filtroNombre.value = '';
        filtroPrecioMin.value = '';
        filtroPrecioMax.value = '';
        filtroCalidad.value = 'todas';
        filtroTipo.value = 'todos';
        
        // Vuelve a aplicar los filtros (que ahora mostrarán todo)
        aplicarFiltros();
    }

    // --- 6. Añadir "Escuchadores" de Eventos ---
    // Cada vez que el usuario escriba o cambie una selección, se llama a aplicarFiltros()
    filtroNombre.addEventListener('input', aplicarFiltros);
    filtroPrecioMin.addEventListener('input', aplicarFiltros);
    filtroPrecioMax.addEventListener('input', aplicarFiltros);
    filtroCalidad.addEventListener('change', aplicarFiltros);
    filtroTipo.addEventListener('change', aplicarFiltros);
    btnLimpiar.addEventListener('click', limpiarFiltros);

    // --- 7. Carga Inicial ---
    console.log("Mostrando productos iniciales...");
    mostrarProductos(gafasClasicas);

});