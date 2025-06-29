const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, '../send_receive');
const publicDir = path.join(__dirname, 'public');

try {
  console.log('Building React client...');
  
  // Change to client directory and run build
  execSync('npm run build', { 
    cwd: clientDir, 
    stdio: 'inherit' 
  });
  
  console.log('Copying built files to transmit/public...');
  
  // Remove existing public directory if it exists
  if (fs.existsSync(publicDir)) {
    fs.rmSync(publicDir, { recursive: true, force: true });
  }
  
  // Create public directory
  fs.mkdirSync(publicDir, { recursive: true });
  
  // Copy dist contents to public
  const distDir = path.join(clientDir, 'dist');
  copyDir(distDir, publicDir);
  
  console.log('✅ Client build complete!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
