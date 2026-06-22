# Repository Guidelines

## Project Structure & Module Organization

Application code lives in `src/`. Astro UI components are in `src/components/`, shared layouts in `src/layouts/`, routes in `src/pages/`, and framework-free browser controllers in `src/scripts/`. QR rendering and helpers live in `src/utils/`; localization code is in `src/i18n/` with English and Spanish dictionaries under `locales/`. Keep shared types in `src/interfaces/`. Unit tests are colocated with TypeScript as `*.test.ts`; browser tests live in `e2e/`. Static assets and deployment files belong in `public/`.

## Build, Test, and Development Commands

Use pnpm 11 (declared in `package.json`).

- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm dev` starts the Astro development server.
- `pnpm build` type-checks with TypeScript and writes the production build to `dist/`.
- `pnpm test` runs Vitest in watch mode; `pnpm test:run` runs it once.
- `pnpm test:coverage` runs unit tests with coverage enforcement.
- `pnpm test:e2e` runs Playwright tests in Chromium.
- `pnpm lint` and `pnpm format:check` validate code quality.
- `pnpm check` runs the complete local verification pipeline.

## Coding Style & Naming Conventions

Write strict TypeScript, static Astro components, and focused framework-free client controllers. Follow the existing oxfmt output: tabs for indentation, double quotes, and semicolons. Use PascalCase for Astro components (`QRGenerator.astro`), camelCase for functions and utilities, and descriptive test names. Keep browser behavior in `scripts/`, reusable logic in `utils/`, and shared types in `interfaces/`. Run `pnpm format` before committing and fix all oxlint findings.

## Testing Guidelines

Use Vitest, jsdom, and `jest-dom` for unit and controller tests. Test observable behavior rather than implementation details. Coverage must remain at least 80% for statements, functions, and lines, and 75% for branches. Add Playwright coverage for user-facing workflows, static rendering, and accessibility checks under `e2e/`. Run `pnpm check` before opening a pull request.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit prefixes such as `feat:`, `chore:`, and `docs:`. Keep subjects imperative, concise, and scoped to one logical change. Pull requests should explain the behavior changed, list verification commands, link relevant issues, and include screenshots for visible UI changes. Call out localization, accessibility, or deployment impacts explicitly.
