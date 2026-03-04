const fs = require('fs');
const path = require('path');

const DIR = 'c:\\Users\\jose\\Downloads\\optica-pagina-master\\pages\\productos';

function updateProductPages() {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
  
  for (const file of files) {
    const fullPath = path.join(DIR, file);
    let html = fs.readFileSync(fullPath, 'utf8');

    // Remove the old Comprar Ahora + Secondary actions block.
    // Replace with WhatsApp consulting button.
    const productTitleMatch = html.match(/<h1 class="product-title">(.*?)<\/h1>/);
    const title = productTitleMatch ? productTitleMatch[1] : 'estas monturas/gafas';

    const phone = '573105551234';
    const whatsappMsg = `¡Hola! Estoy muy interesado/a en: *${title}*. 

Me gustaría saber si están disponibles para la venta.`;

    const encodedMsg = encodeURIComponent(whatsappMsg);

    // Replace the button and secondary actions section.
    html = html.replace(/<button class="btn btn-custom">[^<]+<\/button>/, '');
    html = html.replace(/<div class="product-secondary-actions">[\s\S]*?<\/div>/, '');

    // Add the new button section (we use string concatenation to build it nicely below the features)
    const newSection = `
                        <a href="https://wa.me/${phone}?text=${encodedMsg}" class="btn btn-whatsapp-buy" target="_blank">
                            <i class="fab fa-whatsapp"></i> Consultar Disponibilidad
                        </a>
                        <div class="product-secondary-actions mt-3">
                            <i class="fas fa-calendar-alt me-2"></i> ¿Necesitas lentes formulados? 
                            <a href="../agendar-cita.html">Agenda un examen visual</a>.
                        </div>`;

    // We'll insert this right after the product-features closing tag.
    html = html.replace(/<\/ul>\s*/, `</ul>\n${newSection}\n                        `);

    fs.writeFileSync(fullPath, html, 'utf8');
    console.log(`Updated ${file} successfully.`);
  }
}

updateProductPages();
