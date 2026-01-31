import js from '@eslint/js'
import globals from 'globals'
import reactDom from 'eslint-plugin-react-dom'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactX from 'eslint-plugin-react-x'
import tseslint from 'typescript-eslint'
import vitest from '@vitest/eslint-plugin'
import playwright from 'eslint-plugin-playwright'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.spec.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactDom.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactX.configs['recommended-typescript'],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['src/**/*.spec.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      vitest.configs.recommended,
    ],
  },
  {
    files: ['e2e/**/*.spec.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      playwright.configs['flat/recommended'],
    ],
  },
  eslintConfigPrettier,
])
