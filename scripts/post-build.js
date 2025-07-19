import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para copiar archivos que faltan
function postBuild() {
  const distPath = path.join(__dirname, '..', 'dist');
  
  // Verificar que dist existe
  if (!fs.existsSync(distPath)) {
    console.error('Error: La carpeta dist no existe. Ejecuta npm run build primero.');
    process.exit(1);
  }
  
  // Copiar archivos desde public si no existen en dist
  const publicPath = path.join(__dirname, '..', 'public');
  const filesToCopy = ['.nojekyll', '404.html'];
  
  filesToCopy.forEach(file => {
    const srcPath = path.join(publicPath, file);
    const destPath = path.join(distPath, file);
    
    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copiado: ${file}`);
    }
  });
  
  // Verificar que index.html tiene las rutas correctas
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Verificar que no tiene referencias a src/main.tsx
    if (html.includes('src/main.tsx')) {
      console.error('Error: index.html contiene referencias de desarrollo (src/main.tsx)');
      console.error('El build no se completó correctamente.');
      process.exit(1);
    }
    
    // Verificar que tiene la base href correcta
    if (!html.includes('base href="/revendedor/"')) {
      console.log('Actualizando base href...');
      html = html.replace(/<base href="[^"]*"/, '<base href="/revendedor/"');
      fs.writeFileSync(indexPath, html);
    }
    
    console.log('Build verificado correctamente.');
  }
}

postBuild();