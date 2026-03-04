const fs = require('fs');
const path = require('path');

const DIR = 'c:\\Users\\jose\\Downloads\\optica-pagina-master\\pages\\productos';

function fixProductPages() {
    const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));

    for (const file of files) {
        const fullPath = path.join(DIR, file);
        let html = fs.readFileSync(fullPath, 'utf8');

        // Locate the wrongly placed injected snippet
        const startPattern = '<a href="https://wa.me/573105551234?text=';
        const endPattern = '</a>.</div>';

        const startIndex = html.indexOf(startPattern);
        if (startIndex === -1) {
            console.log(`Not found in ${file}.`);
            continue;
        }

        // Since we formatted it with multiple divs, we can just use substring to extract it.
        // The snippet starts with `<a href=` and ends with `</a>.\n                        </div>`
        const blockRegex = /<a href="https:\/\/wa\.me\/[0-9]+\?text=[^"]+".*?class="btn btn-whatsapp-buy" target="_blank">[\s\S]*?<\/a>\s*<div class="product-secondary-actions mt-3">[\s\S]*?<\/div>/;

        const blockMatch = html.match(blockRegex);
        if (!blockMatch) {
            console.log(`Could not match Regex for ${file}`);
            continue;
        }

        const injectedBlock = blockMatch[0];

        // Remove it from current document
        html = html.replace(injectedBlock, '');

        // Now safely insert it after the product-features list
        const splitToken = '<ul class="product-features">';
        const parts = html.split(splitToken);

        if (parts.length === 2) {
            let featuresSection = parts[1];
            featuresSection = featuresSection.replace('</ul>', '</ul>\n                        ' + injectedBlock + '\n                    ');
            html = parts[0] + splitToken + featuresSection;

            fs.writeFileSync(fullPath, html, 'utf8');
            console.log(`Fixed ${file} successfully.`);
        } else {
            console.log(`Couldn't find features list in ${file}`);
        }
    }
}

fixProductPages();
