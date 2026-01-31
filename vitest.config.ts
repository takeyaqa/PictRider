import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['./src/**/*.spec.{ts,tsx}'],
    testTimeout: 20000,
    coverage: {
      provider: 'istanbul',
    },
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
})
