interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string
  readonly VITE_BASE_DOMAIN: string
  readonly VITE_NOTIFICATION_MESSAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
