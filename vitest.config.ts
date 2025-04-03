import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { version } from './package.json'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'jsdom',
    testTimeout: 10000,
  },
  define: {
    __APP_VERSION__: JSON.stringify(`v${version}`),
  },
})
