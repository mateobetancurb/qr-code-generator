# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Requires pnpm 11 (`packageManager` is pinned in `package.json`).

```bash
pnpm dev              # Start Astro dev server
pnpm build            # Type-check + build to dist/
pnpm preview          # Serve the production build (required before e2e)
pnpm test             # Vitest in watch mode
pnpm test:run         # Vitest once
pnpm test:coverage    # Vitest with coverage enforcement
pnpm lint             # oxlint
pnpm format           # oxfmt (tabs, double quotes, semicolons)
pnpm format:check     # oxfmt dry-run
pnpm check            # Full pipeline: format:check + lint + test:coverage + build
```

To run a single unit test file: `pnpm test src/scripts/qrGenerator.test.ts`

## Architecture

This is a **fully static Astro site** — no framework runtime ships to the browser. All interactivity is handled by plain TypeScript "controller" scripts that are imported per-page via `<script>` tags in Astro components.

### i18n

Two routes: `/` (English) and `/es/` (Spanish). Each has its own `src/pages/index.astro` and `src/pages/es/index.astro`. Translations live in `src/i18n/locales/en.ts` and `es.ts` as typed dictionaries; `src/i18n/getTranslation.ts` resolves the right dictionary from the pathname at build time.

### Client scripts (`src/scripts/`)

Scripts communicate with the DOM exclusively through `data-*` attributes — never by class names or IDs. The three controllers are:

- **`qrGenerator.ts`** — main controller; reads/writes `qrGeneratorState.ts` (persisted to `sessionStorage`) to restore form state across Astro view-transition navigations
- **`theme.ts`** — dark/light mode; persists to `localStorage`; hooks into `astro:before-swap` so theme survives soft navigations
- **`languageNavigation.ts`** — language switcher; maps the current pathname to the equivalent route in the other locale

### QR rendering (`src/utils/`)

`qrRenderer.ts` draws QR codes onto a `<canvas>` (PNG) or builds SVG markup. It supports two module styles: `square` and `dot`. The `qrcode` library creates the raw matrix; rendering is handled entirely in-house.

### Testing

Unit tests use Vitest + jsdom, colocated as `*.test.ts`. Coverage thresholds: 80% statements/functions/lines, 75% branches.

### Coding style

Follow oxfmt output: tabs, double quotes, semicolons. Scripts use strict TypeScript. Astro components are PascalCase; utilities and functions are camelCase.
