/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the CV service (SSE events). Defaults to http://127.0.0.1:8000. */
  readonly VITE_CV_SERVICE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
