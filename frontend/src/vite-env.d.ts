/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_CHAIN_ID: string
  readonly VITE_MARKETPLACE_ADDRESS: string
  readonly VITE_NFT_TOKEN_ADDRESS: string
  readonly VITE_SENTRY_DSN: string
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}