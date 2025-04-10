import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import { join } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl()
  ],
  resolve: {
    alias: {
      '@': join(__dirname, 'client/src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 443,
    }
  },
  build: {
    outDir: 'dist/client', // Output client-only files for Netlify
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: join(__dirname, 'client/index.html')
      }
    }
  }
});