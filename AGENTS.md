# Repository Guidelines

## Project Structure & Module Organization

Application code lives in `src/`. React UI components are in `src/components/`, shared providers in `src/context/`, QR rendering and helpers in `src/utils/`, and localization code in `src/i18n/` with English and Spanish dictionaries under `locales/`. Keep shared types in `src/interfaces/`. Unit tests are colocated with source files as `*.test.ts` or `*.test.tsx`; browser tests live in `e2e/`. Static assets and deployment files belong in `public/`. The root `index.html` and `es/index.html` are Vite entry points for localized pages.

## Build, Test, and Development Commands

Use pnpm 11 (declared in `package.json`).

- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm dev` starts the Vite development server.
- `pnpm build` type-checks with TypeScript and writes the production build to `dist/`.
- `pnpm test` runs Vitest in watch mode; `pnpm test:run` runs it once.
- `pnpm test:coverage` runs unit tests with coverage enforcement.
- `pnpm test:e2e` runs Playwright tests in Chromium.
- `pnpm lint` and `pnpm format:check` validate code quality.
- `pnpm check` runs the complete local verification pipeline.

## Coding Style & Naming Conventions

Write strict TypeScript and functional React components. Follow the existing oxfmt output: tabs for indentation, double quotes, and semicolons. Use PascalCase for components and context modules (`QRGenerator.tsx`, `DarkMode.tsx`), camelCase for functions and utilities, and descriptive test names. Prefer colocating component-specific behavior; move reusable logic into `utils/` or shared types into `interfaces/`. Run `pnpm format` before committing and fix all oxlint findings.

## Testing Guidelines

Use Vitest, Testing Library, and `jest-dom` for unit and component tests. Test observable behavior rather than implementation details. Coverage must remain at least 80% for statements, functions, and lines, and 75% for branches. Add Playwright coverage for user-facing workflows and accessibility checks under `e2e/`. Run `pnpm check` before opening a pull request.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit prefixes such as `feat:`, `chore:`, and `docs:`. Keep subjects imperative, concise, and scoped to one logical change. Pull requests should explain the behavior changed, list verification commands, link relevant issues, and include screenshots for visible UI changes. Call out localization, accessibility, or deployment impacts explicitly.
