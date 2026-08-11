import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["localhost:5173","tristin-basaltic-pessimistically.ngrok-free.dev"],
  },
})
