// Scroll suave para los enlaces del navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Filtrar productos por categoría
function filterProducts(category) {
    const productos = document.querySelectorAll('#productos > div');
    productos.forEach(producto => {
        if (category === 'todos' || producto.getAttribute('data-category') === category) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });

    // Actualizar botón activo
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });
}
