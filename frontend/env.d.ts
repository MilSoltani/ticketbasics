/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add your VITE_ prefixed variables here, e.g.:
  // readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
