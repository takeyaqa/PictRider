import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    license: { fileName: 'license.md' },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,wasm,css,html,svg,md}'],
      },
      manifest: {
        name: 'PictRider',
        short_name: 'PictRider',
        description:
          'PictRider is a modern web-based tool for pairwise testing that allows QA engineers and developers to generate optimized test cases with no installation required. Define parameters, create constraints, and export test cases directly in your browser.',
        theme_color: '#ffffff',
        display: 'standalone',
      },
      pwaAssets: {
        image: 'public/PictRider_icon.svg',
      },
    }),
  ],
  server: {
    host: '127.0.0.1',
  },
  optimizeDeps: {
    exclude: ['@takeyaqa/pict-wasm'],
  },
})
