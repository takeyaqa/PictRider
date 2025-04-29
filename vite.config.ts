import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import license from 'rollup-plugin-license'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,wasm,css,html,svg}', '**/dependencies.txt'],
      },
      manifest: {
        name: 'PictRider',
        short_name: 'PictRider',
        description:
          'PictRider is a modern web-based tool for pairwise testing that allows QA engineers and developers to generate optimized test cases with no installation required. Define parameters, create constraints, and export test cases directly in your browser.',
        theme_color: '#ffffff',
        display: 'standalone',
      },
      pwaAssets: {},
    }),
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
