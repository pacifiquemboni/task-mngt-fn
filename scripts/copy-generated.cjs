const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'generated');
const dest = path.join(__dirname, '..', 'dist', 'generated');

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyRecursive(src, dest);
  console.log('Copied generated client to', dest);
} catch (err) {
  console.error('Error copying generated client:', err);
  process.exit(1);
}
