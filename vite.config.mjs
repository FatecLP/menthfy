import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/lesson-schedules': {
        target: process.env.VITE_SCHEDULING_API_URL || 'http://localhost:5080',
        changeOrigin: true,
      },
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'https://menthfy-backend.onrender.com',
        changeOrigin: true,
      },
      '/usuarios': {
        target: process.env.VITE_BACKEND_URL || 'https://menthfy-backend.onrender.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
