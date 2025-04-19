import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { version } from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
  },
  optimizeDeps: {
    exclude: ['@takeyaqa/pict-browser'],
  },
  define: {
    __APP_VERSION__: JSON.stringify(`v${version}`),
  },
})
