import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Step 1: Building WebGL Production Bundle...');
execSync('npm.cmd run build', { cwd: rootDir, stdio: 'inherit' });

const distDir = path.join(rootDir, 'dist');
const targetAssetsDir = path.join(rootDir, 'android-app', 'app', 'src', 'main', 'assets', 'www');

console.log('📂 Step 2: Syncing web bundle to Android Java assets...');

if (fs.existsSync(targetAssetsDir)) {
  fs.rmSync(targetAssetsDir, { recursive: true, force: true });
}
fs.mkdirSync(targetAssetsDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(distDir, targetAssetsDir);

console.log('✅ Success! WebGL assets successfully bundled into Android Java project at:');
console.log(`📍 ${targetAssetsDir}`);
console.log('\n📲 You can now open the "android-app" directory in Android Studio or run gradlew assembleDebug to build your .APK!');
