/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Empty = same-origin /api (Vite proxy to Flask). Set full URL for production. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
