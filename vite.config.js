import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Laravel dev server. `php artisan serve` listens on 127.0.0.1 (IPv4) only.
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://127.0.0.1:8000';
  // Same origin in development as in production (SPA + API on one domain): the browser
  // only ever talks to this server, so there are no cross-origin (CORS) requests.
  const backend = { target: apiTarget, changeOrigin: false, xfwd: true };

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': backend,
        '/sanctum': backend,
        '/oauth': backend,
      },
    },
  };
});
