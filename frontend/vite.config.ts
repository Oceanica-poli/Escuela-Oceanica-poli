import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target:      'http://localhost:3001',
        changeOrigin: true,
        // Corregido: la regex tenía /^api/ sin la barra inicial,
        // lo que convertía /api/auth/login en /auth/login.
        // Con este rewrite el prefijo /api se conserva tal cual
        // porque el backend ya tiene todas sus rutas bajo /api.
        rewrite: (path) => path,
      },
    },
  },
});