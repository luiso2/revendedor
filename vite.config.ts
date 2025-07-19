/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<base href=".\/" \/>/,
          '<base href="/revendedor/" />'
        )
      }
    }
  ],
  base: '/revendedor/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Asegura que los assets se copien correctamente
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Configuración para desarrollo
  server: {
    port: 3000,
    open: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})