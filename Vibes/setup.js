#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up ResuMatic...\n');

// Create necessary directories
const directories = [
  'backend/uploads',
  'frontend/dist',
  'backend/dist'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Copy environment files
const envFiles = [
  { src: 'backend/env.example', dest: 'backend/.env' },
  { src: 'frontend/env.example', dest: 'frontend/.env' }
];

envFiles.forEach(({ src, dest }) => {
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Created ${dest} from ${src}`);
  }
});

console.log('\n📦 Installing dependencies...');

try {
  // Install root dependencies
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed');

  // Install frontend dependencies
  execSync('npm run install:all', { stdio: 'inherit' });
  console.log('✅ All dependencies installed');

} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Configure your environment variables in backend/.env and frontend/.env');
console.log('2. Set up Firebase and get your API keys');
console.log('3. Run "npm run dev" to start the application');
console.log('\nFor detailed setup instructions, see README.md');
