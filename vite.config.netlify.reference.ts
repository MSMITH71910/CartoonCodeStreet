import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared')
    }
  },
  root: path.resolve(__dirname, 'client'),
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 443,
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/client'), // Output client-only files for Netlify
    emptyOutDir: true
  },
  // Add support for large models and audio files
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.mp3', '**/*.ogg', '**/*.wav']
});