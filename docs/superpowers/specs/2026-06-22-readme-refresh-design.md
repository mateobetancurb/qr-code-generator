# README Refresh Design

## Goal

Replace the stale README with an accurate, concise introduction for both users and contributors, with developer setup and architecture given priority after the product overview.

## Content Structure

The README will contain:

1. A short product description and link to the deployed application.
2. A feature list covering local QR generation, live preview, output formats, visual customization, image overlays, session continuity, localization, theming, accessibility, and SEO.
3. A technology summary based on the versions and packages declared in `package.json`.
4. Prerequisites and local setup using pnpm 11 and Node.js 22, matching the package manager declaration and CI environment.
5. A command table containing only scripts currently defined in `package.json`.
6. An architecture overview explaining the static Astro shell, framework-free browser controllers, QR rendering utilities, typed localization, and storage boundaries.
7. An updated project tree that reflects the current source, test, public asset, and CI organization.
8. Testing and quality requirements, including Vitest, jsdom, coverage thresholds, oxlint, oxfmt, Astro checks, and the CI pipeline.
9. Deployment, localization, privacy, and contribution notes relevant to maintainers.

## Accuracy Rules

- Remove Playwright, `e2e/`, and `pnpm test:e2e` references because they no longer exist.
- Describe uploaded image constraints as PNG, JPEG, or WebP with a 2 MiB maximum.
- State that text and standard customization state persist in `sessionStorage`; uploaded image data and image controls are not persisted.
- State that theme preference uses `localStorage` and falls back to the operating-system preference.
- Avoid claiming that generated output is guaranteed decodable; customization and embedded images can affect scan reliability.
- Describe deployment as a static build suitable for Cloudflare Pages without implying that Cloudflare is required.

## Verification

- Compare all documented commands with `package.json`.
- Compare features and data flow with the Astro components, browser controllers, and rendering utilities.
- Run `pnpm format:check` after editing.
- Review the final diff for stale references and unsupported claims.
