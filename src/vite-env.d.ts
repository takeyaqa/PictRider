/// <reference types="vite/client" />

declare const __APP_VERSION__: string
declare const __NOTIFICATION_MESSAGE__: string

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_BASE_DOMAIN: string
  readonly VITE_NOTIFICATION_MESSAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
