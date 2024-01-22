/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REQUEST_BASE_URL: string
  readonly VITE_OAUTH_ISSUER: string
  readonly VITE_OAUTH_CLIENT_ID: string
  readonly VITE_OAUTH_CLIENT_SECRET: string
  readonly VITE_OAUTH_SCOPE: string
  readonly VITE_OAUTH_REDIRECT_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}
