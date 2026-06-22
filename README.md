# QR Code Generator

A fast, accessible QR code generator built with Astro, TypeScript, and Tailwind CSS. The English and Spanish pages are statically rendered, while small framework-free scripts handle QR generation, theme switching, and mobile navigation.

## Features

- Generate QR codes locally in the browser
- Customize size, square/dot pattern, and colors
- Download decodable PNG and SVG files
- English and Spanish routes with localized SEO metadata
- Dark mode with persisted system-aware preference
- Static, crawlable content with no framework runtime
- Keyboard and screen-reader accessible interactions

## Stack

- Astro 6.4
- TypeScript 6
- Tailwind CSS 4
- `qrcode`
- Vitest and Playwright
- oxlint and oxfmt

## Project structure

```text
src/
├── components/       Astro page sections
├── i18n/             Typed English and Spanish dictionaries
├── interfaces/       Shared QR types
├── layouts/          Shared document and SEO layout
├── pages/            Static / and /es/ routes
├── scripts/          Framework-free browser controllers
└── utils/            QR rendering and shared utilities
e2e/                  Playwright workflows and accessibility tests
public/               Crawl, social, and deployment assets
```

## Development

This project requires pnpm 11.

```bash
pnpm install
pnpm dev
```

The main commands are:

| Command              | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| `pnpm dev`           | Start the Astro development server              |
| `pnpm build`         | Type-check and build the static site to `dist/` |
| `pnpm preview`       | Preview the production build                    |
| `pnpm test:run`      | Run unit tests once                             |
| `pnpm test:coverage` | Run unit tests with coverage thresholds         |
| `pnpm test:e2e`      | Run Chromium browser tests                      |
| `pnpm lint`          | Check source with oxlint                        |
| `pnpm format`        | Format source with oxfmt                        |
| `pnpm check`         | Run the complete local verification pipeline    |

## Deployment

`pnpm build` produces a fully static `dist/` directory suitable for Cloudflare Pages. The two canonical routes are `/` and `/es/`; `public/_redirects`, `robots.txt`, and `sitemap.xml` are copied into the build.

## Privacy

QR content is processed entirely in the browser and is not uploaded to a server.
