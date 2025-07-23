#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Netlify deployment setup...\n');

// Check if netlify.toml exists
const netlifyTomlPath = path.join(__dirname, 'netlify.toml');
if (fs.existsSync(netlifyTomlPath)) {
  console.log('✅ netlify.toml found');
  
  const netlifyConfig = fs.readFileSync(netlifyTomlPath, 'utf8');
  
  // Check build command
  if (netlifyConfig.includes('npm run build:netlify')) {
    console.log('✅ Build command is correct');
  } else {
    console.log('❌ Build command should be "npm run build:netlify"');
  }
  
  // Check publish directory
  if (netlifyConfig.includes('publish = "dist/client"')) {
    console.log('✅ Publish directory is correct');
  } else {
    console.log('❌ Publish directory should be "dist/client"');
  }
  
  // Check Node version
  if (netlifyConfig.includes('NODE_VERSION = "18"')) {
    console.log('✅ Node.js version is set to 18');
  } else {
    console.log('❌ Node.js version should be set to 18');
  }
  
  // Check legacy peer deps
  if (netlifyConfig.includes('NPM_CONFIG_LEGACY_PEER_DEPS = "true"')) {
    console.log('✅ Legacy peer dependencies enabled');
  } else {
    console.log('❌ Legacy peer dependencies should be enabled');
  }
  
} else {
  console.log('❌ netlify.toml not found');
}

// Check if Netlify Vite config exists
const netlifyViteConfigPath = path.join(__dirname, 'vite.config.netlify.reference.ts');
if (fs.existsSync(netlifyViteConfigPath)) {
  console.log('✅ Netlify Vite config found');
  
  const viteConfig = fs.readFileSync(netlifyViteConfigPath, 'utf8');
  
  // Check if it excludes Replit plugin (should not have the actual import/usage)
  if (!viteConfig.includes('runtimeErrorOverlay()') && !viteConfig.includes('import.*@replit')) {
    console.log('✅ Replit plugin excluded from Netlify config');
  } else {
    console.log('❌ Replit plugin should be excluded from Netlify config');
  }
  
} else {
  console.log('❌ vite.config.netlify.reference.ts not found');
}

// Check package.json for build:netlify script
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts['build:netlify']) {
    console.log('✅ build:netlify script found');
  } else {
    console.log('❌ build:netlify script not found in package.json');
  }
} else {
  console.log('❌ package.json not found');
}

// Check if .nvmrc exists
const nvmrcPath = path.join(__dirname, '.nvmrc');
if (fs.existsSync(nvmrcPath)) {
  console.log('✅ .nvmrc file found');
} else {
  console.log('⚠️  .nvmrc file not found (optional but recommended)');
}

console.log('\n🚀 Setup verification complete!');
console.log('\nNext steps:');
console.log('1. Commit and push your changes to GitHub');
console.log('2. In Netlify, clear cache and retry deploy');
console.log('3. If build still fails, check the Netlify build logs for specific errors');