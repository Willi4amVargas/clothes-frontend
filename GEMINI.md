# AGENTS.md

## Commands

- `npm run dev` — starts Vite dev server with `--host` (exposes to network)
- `npm run build` — runs `tsc -b` then `vite build` (typecheck is part of build)
- `npm run lint` — ESLint flat config
- `npm run preview` — preview production build locally

No test framework is configured. Do not invent one unless asked.

## Architecture

- **Router**: `src/routes/router.tsx` — react-router v7 `createBrowserRouter`. All protected routes are children of `MainLayout` with `protectedLoader`. Login is a separate top-level route.
- **Auth**: `src/feature/auth/context/auth-context.tsx` wraps `<App />` in `main.tsx`. Token storage lives in `src/shared/lib/token.ts`.
- **Route guards**: `src/routes/protected-loader.ts` — redirects to `/login` if no token, or to `/` if already authenticated on `/login`.
- **Features** (directory: `src/feature/`): `auth`, `clients`, `dashboard`, `inventory`, `products`. New features go here.
- **Shared**: `src/shared/lib/` — API client (`api.ts`) and token storage (`token.ts`).
- **Layouts**: `src/layouts/MainLayout.tsx` — wraps all authenticated pages.
- **UI components**: `src/components/ui/` — shadcn primitives. `src/components/` — app-level components.

## Stack & Quirks

- **React 19** with **React Compiler** enabled (babel plugin). Avoid patterns the compiler cannot optimize (e.g., certain closure captures).
- **Tailwind v4** via `@tailwindcss/vite` plugin. CSS is in `src/index.css` using `@import "tailwindcss"`.
- **shadcn/ui** — style: `radix-lyra`, icon library: `phosphor` (`@phosphor-icons/react`). **Do not run shadcn CLI to generate components**; assume primitives exist or list missing ones for manual addition.
- **Path alias**: `@/*` → `./src/*` (configured in tsconfig + vite).
- **TypeScript strict**: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax`. No enums (use const objects), no unused imports.
- **Env**: `VITE_API_URL` in `.env` (backend defaults to port 5000).
- **Font**: Geist Variable (`@fontsource-variable/geist`).
