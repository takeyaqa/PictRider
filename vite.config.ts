import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import license from 'rollup-plugin-license'
import path from 'path'
import { version } from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    license({
      thirdParty: {
        output: {
          file: path.join(__dirname, 'dist', 'dependencies.txt'),
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
  define: {
    __APP_VERSION__: JSON.stringify(`v${version}`),
    __NOTIFICATION_MESSAGE__: JSON.stringify(
      'This application is under active development and is not recommended for production use.',
    ),
  },
})
