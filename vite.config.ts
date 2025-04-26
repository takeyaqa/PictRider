import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import license from 'rollup-plugin-license'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    license({
      thirdParty: {
        output: {
          file: join(__dirname, 'dist', 'dependencies.txt'),
          encoding: 'utf-8',
        },
      },
    }),
  ],
  server: {
    host: '127.0.0.1',
  },
  optimizeDeps: {
    exclude: ['@takeyaqa/pict-browser'],
  },
})
