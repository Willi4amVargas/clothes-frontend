// src/env.d.ts
interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_COMPANY_NAME: string
    readonly VITE_COMPANY_RIF: string
    readonly VITE_COMPANY_SLOGAN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}