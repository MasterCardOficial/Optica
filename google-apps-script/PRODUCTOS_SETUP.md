# 🛍️ CONFIGURACIÓN DEL SISTEMA DE PRODUCTOS

Este documento explica cómo configurar y usar el nuevo sistema de gestión de productos en Google Apps Script.

---

## 📋 RESUMEN

El sistema de productos permite:
- ✅ Añadir nuevos productos desde el panel de administración
- ✅ Editar productos existentes
- ✅ Eliminar productos (soft delete - se marcan como inactivos)
- ✅ Filtrar productos por categoría (clásicas, deportivas, modernas)
- ✅ Buscar productos por nombre o modelo
- ✅ Gestionar stock e imágenes

---

## 🚀 PASOS DE CONFIGURACIÓN

### 1️⃣ Actualizar el código de Google Apps Script

1. Ve a **https://script.google.com/**
2. Abre tu proyecto "API Citas Surtilentes"
3. En el archivo **citas-api.gs**, verifica que tengas el código actualizado con las nuevas funciones de productos
4. Busca la sección: `// SISTEMA DE GESTIÓN DE PRODUCTOS` (alrededor de la línea 950)
5. También verifica que las funciones `doPost()` y `doGet()` estén actualizadas para manejar productos

### 2️⃣ Crear la hoja de Productos (Automático)

**No necesitas crear manualmente la hoja.** La primera vez que uses el sistema, se creará automáticamente con esta estructura:

| Columna | Nombre              | Descripción                           |
|---------|---------------------|---------------------------------------|
| A       | Timestamp           | Fecha/hora de última modificación    |
| B       | ID                  | Identificador único del producto     |
| C       | Categoria           | clasicas, deportivas, modernas       |
| D       | Nombre              | Nombre completo del producto         |
| E       | Precio              | Precio en pesos colombianos (COP)    |
| F       | Modelo              | Código/SKU del producto              |
| G       | Descripcion         | Descripción detallada                |
| H       | Montura             | Tipo de montura                      |
| I       | Medidas             | Medidas en mm (ej: 50-20-140)        |
| J       | Forma               | Forma del marco                      |
| K       | Color               | Color principal                      |
| L       | Garantia            | Periodo de garantía                  |
| M       | Imagen              | URL de la imagen del producto        |
| N       | Stock               | Cantidad disponible                  |
| O       | Activo              | SI/NO (para soft delete)             |
| P       | Fecha Creacion      | Fecha de creación del producto       |
| Q       | Fecha Modificacion  | Última fecha de modificación         |

### 3️⃣ Probar el sistema (IMPORTANTE)

Antes de usar el panel de administración, prueba que todo funciona:

1. En Google Apps Script, selecciona la función **`testProducts`** en el menú desplegable
2. Haz clic en el botón **▶️ Ejecutar**
3. **Primera vez:** Te pedirá autorización
   - Clic en **"Revisar permisos"**
   - Selecciona tu cuenta de Google
   - Clic en **"Avanzado"**
   - Clic en **"Ir a [nombre del proyecto] (no seguro)"**
   - Clic en **"Permitir"**
4. Espera a que termine la ejecución
5. Verifica los logs (View → Logs o Ctrl+Enter):
   ```
   🧪 Probando sistema de productos...
   ✅ Hoja de Productos creada exitosamente
   ✅ Producto agregado: Gafas de Prueba (ID: TEST-...)
   Total productos: 1
   ✅ Prueba completada.
   ```

6. **Verifica en Google Sheets:**
   - Abre tu hoja de cálculo de Surtilentes
   - Deberías ver una nueva pestaña llamada **"Productos"**
   - Debe tener un producto de prueba

### 4️⃣ Reimplementar la API (CRÍTICO)

Cada vez que modificas el código de Google Apps Script, debes crear una **nueva implementación**:

#### Opción A: Nueva Implementación (Recomendado)

1. Clic en **"Implementar"** → **"Nueva implementación"**
2. Tipo: **"Aplicación web"**
3. Descripción: "Sistema con Productos - v2.0"
4. Ejecutar como: **"Yo"**
5. Quién tiene acceso: **"Cualquier persona"**
6. Clic en **"Implementar"**
7. **COPIAR LA NUEVA URL** (será diferente a la anterior)
8. Actualizar `assets/js/config/api-config.js` con la nueva URL

#### Opción B: Administrar Implementaciones (Más Rápido)

1. Clic en **"Implementar"** → **"Administrar implementaciones"**
2. Clic en el **icono de lápiz ✏️** junto a la implementación activa
3. En "Versión", selecciona **"Nueva versión"**
4. Descripción: "Sistema con Productos"
5. Clic en **"Implementar"**
6. **La URL no cambia**, así que no necesitas actualizar nada

---

## 🧪 PROBAR EL PANEL DE ADMINISTRACIÓN

1. Abre en tu navegador: `http://localhost:3000/admin/productos.html`
2. Deberías ver el panel de administración
3. Si funciona correctamente:
   - Verás el producto de prueba "Gafas de Prueba"
   - Puedes filtrar por categorías
   - El botón "Añadir Producto" abre el modal

---

## ➕ AÑADIR UN PRODUCTO REAL

1. Clic en **"Añadir Producto"**
2. Completa el formulario:
   - **Categoría\*:** clasicas, deportivas o modernas
   - **Nombre\*:** Nombre completo del producto
   - **Precio (COP)\*:** Solo números, ej: 85000
   - **Modelo/SKU:** Código identificador (opcional)
   - **Descripción\*:** Descripción detallada
   - **Montura:** Tipo de montura (ej: "Acetato premium")
   - **Medidas:** Formato: 50-20-140 mm
   - **Forma:** Rectangular, Redonda, Aviador, etc.
   - **Color:** Color principal
   - **Garantía:** Por defecto "2 años"
   - **Imagen URL\*:** URL completa de la imagen
   - **Stock:** Cantidad disponible (default: 1)

3. Clic en **"Guardar Producto"**
4. Verás un mensaje de éxito
5. El producto aparecerá en la lista

### 📸 Cómo subir imágenes

**Opción 1: Imgur (Recomendado - Gratis)**
1. Ve a https://imgur.com/
2. Clic en "New post"
3. Arrastra la imagen
4. Clic derecho en la imagen → "Copiar dirección de imagen"
5. Pega la URL en el campo "Imagen URL"

**Opción 2: Google Photos**
1. Sube la imagen a Google Photos
2. Clic en "Compartir" → "Crear enlace"
3. Copia el enlace compartido
4. Pega en el campo "Imagen URL"

**Opción 3: Usar las imágenes existentes**
```
../../assets/images/products/modernas/modernas1.jpg
../../assets/images/products/deportivas/deportivas1.jpg
../../assets/images/products/clasicas/clasicas1.jpg
```

---

## ✏️ EDITAR UN PRODUCTO

1. En la lista de productos, clic en **"Editar"**
2. Se abrirá el modal con los datos actuales
3. Modifica los campos que necesites
4. Clic en **"Guardar Producto"**
5. Los cambios se guardan en Google Sheets

---

## 🗑️ ELIMINAR UN PRODUCTO

1. En la lista de productos, clic en **"Eliminar"**
2. Confirma la eliminación
3. El producto **NO se borra físicamente** de Google Sheets
4. Se marca la columna "Activo" como "NO"
5. El producto ya no aparece en el catálogo público
6. Puedes reactivarlo manualmente en Google Sheets si lo necesitas

---

## 🔍 FILTRAR Y BUSCAR

### Filtrar por Categoría
1. Usa el dropdown "Filtrar por categoría"
2. Selecciona: Todas / Clásicas / Deportivas / Modernas
3. La lista se actualiza automáticamente

### Buscar por Texto
1. Escribe en el campo "Buscar..."
2. Busca por: nombre, modelo o descripción
3. La búsqueda es en tiempo real

### Refrescar
- Clic en el botón **🔄 Refrescar** para recargar desde el servidor

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "API no configurada"

**Problema:** La URL del API no está en `api-config.js`

**Solución:**
1. Abre `assets/js/config/api-config.js`
2. Verifica que existe:
```javascript
const API_CONFIG = {
  SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycb.../exec'
};
```
3. Si no existe, agrégala con tu URL de Google Apps Script

---

### ❌ Error: "No se pudieron cargar los productos"

**Problema:** El API no responde o hay un error en Google Apps Script

**Solución:**
1. Verifica que reimplementaste el script (Paso 4️⃣)
2. Abre la consola del navegador (F12)
3. Ve a la pestaña "Network"
4. Recarga la página
5. Busca la petición al API
6. Si dice "CORS error", necesitas reimplementar
7. Si dice "404", la URL del API es incorrecta

---

### ❌ Los productos no aparecen en el catálogo público

**Problema:** Los archivos de catálogo aún están usando datos hardcodeados

**Solución:**
- Los catálogos públicos (`pages/catalogo/*.html`) aún usan los productos hardcodeados
- Necesitarás actualizar `assets/js/catalogo_*.js` para que carguen desde el API
- Eso será el siguiente paso de desarrollo

---

### ❌ La imagen no se muestra

**Problema:** La URL de la imagen no es accesible o tiene permisos privados

**Solución:**
1. Verifica que la URL sea pública y accesible
2. Copia la URL en una pestaña nueva del navegador
3. Si no se abre, la URL no es válida
4. Usa imgur.com para hostear las imágenes (gratis)

---

## 📊 VER LOS DATOS EN GOOGLE SHEETS

1. Abre tu Google Sheet de Surtilentes
2. Ve a la pestaña **"Productos"**
3. Verás todos los productos con todas sus columnas
4. Puedes editar manualmente aquí si lo necesitas
5. Los cambios manuales se reflejarán en el panel de administración

---

## 🔒 SEGURIDAD

### ⚠️ IMPORTANTE: Este panel NO tiene autenticación

Actualmente, **cualquier persona con la URL puede añadir/editar/eliminar productos**.

**Recomendaciones de seguridad:**

1. **No compartas la URL** `/admin/productos.html` públicamente
2. **Guarda la URL** en un lugar seguro (solo para ti)
3. **Considera añadir autenticación** en el futuro:
   - Password en el HTML
   - Sistema de login con Google
   - Verificación de email

4. **Protege tu Google Apps Script:**
   - La URL del script ya es difícil de adivinar
   - Solo tú tienes acceso a modificar el código
   - Los datos están en tu Google Sheet personal

---

## 📈 SIGUIENTE PASO: CATÁLOGOS DINÁMICOS

Una vez que el sistema de administración funcione, el siguiente paso es:

1. **Modificar los catálogos públicos** para que carguen productos desde el API
2. **Actualizar** `assets/js/catalogo_modernas.js`, `catalogo_deportivas.js`, `catalogo_clasicas.js`
3. **Crear una página de detalle dinámica** que reciba el ID del producto
4. **Opcional:** Sistema de imágenes múltiples por producto

---

## ✅ CHECKLIST DE CONFIGURACIÓN

- [ ] Código de Google Apps Script actualizado
- [ ] Función `testProducts()` ejecutada y autorizada
- [ ] Pestaña "Productos" creada en Google Sheets
- [ ] API reimplementada (nueva versión)
- [ ] URL del API actualizada en `api-config.js` (si es nueva)
- [ ] Panel de administración abierto en navegador
- [ ] Producto de prueba visible en la lista
- [ ] Prueba de añadir producto real exitosa
- [ ] Prueba de editar producto exitosa
- [ ] Prueba de eliminar producto exitosa
- [ ] Filtros y búsqueda funcionando

---

## 📞 SOPORTE

Si tienes problemas:

1. **Revisa los logs** en Google Apps Script (View → Logs)
2. **Revisa la consola** del navegador (F12 → Console)
3. **Verifica** que la hoja "Productos" existe
4. **Comprueba** que reimplementaste el script
5. **Asegúrate** de que la URL del API es correcta

---

## 🎯 RESUMEN RÁPIDO

```bash
# 1. Actualizar Google Apps Script
# 2. Ejecutar testProducts()
# 3. Autorizar permisos
# 4. Reimplementar el script
# 5. Abrir http://localhost:3000/admin/productos.html
# 6. ¡Empezar a añadir productos!
```

---

**¡Listo! Ya puedes gestionar tus productos dinámicamente sin tocar código. 🎉**
