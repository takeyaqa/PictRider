import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'jsdom',
    testTimeout: 10000,
    coverage: {
      provider: 'istanbul',
    },
  },
})
