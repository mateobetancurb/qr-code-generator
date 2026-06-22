# QR Code Generator

A fast, private QR code generator built with Astro and TypeScript. Create and customize QR codes entirely in the browser, then export them as PNG or SVG files.

[Open the live application](https://qr-code-generator-2pn.pages.dev/)

## Features

- Generate QR codes from text or URLs with a live preview
- Export raster PNG and scalable SVG files
- Choose from four output sizes between 200 and 500 pixels
- Switch between square and dot module patterns
- Customize foreground and background colors
- Add a centered PNG, JPEG, or WebP image up to 2 MiB
- Adjust the image size, corner radius, and optional background plate
- Preserve text and standard customization settings during the browser session
- Use the application in English or Spanish without losing generator state or scroll position
- Follow the system color scheme or save a light/dark theme preference
- Navigate with keyboard and screen-reader-friendly controls
- Serve static, crawlable pages with localized metadata and structured data

> Highly customized colors or large center images can reduce scan reliability. Test exported codes with the devices and scanner applications you intend to support.

## Technology

- [Astro 6](https://astro.build/) for statically rendered pages and client-side navigation
- [TypeScript 6](https://www.typescriptlang.org/) in strict mode
- [Tailwind CSS 4](https://tailwindcss.com/) through its Vite plugin
- [`qrcode`](https://www.npmjs.com/package/qrcode) for QR matrix generation
- Canvas and SVG browser APIs for custom rendering and downloads
- Vitest, jsdom, and Testing Library matchers for unit and controller tests
- oxlint and oxfmt for linting and formatting

## Getting Started

### Prerequisites

- Node.js 22
- pnpm 11 (the exact package manager version is declared in `package.json`)

### Local Development

```bash
pnpm install
pnpm dev
```

Astro prints the local development URL when the server starts.

### Commands

| Command              | Purpose                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`           | Start the Astro development server                                       |
| `pnpm build`         | Run Astro type checks and build the static site into `dist/`             |
| `pnpm preview`       | Preview the production build locally                                     |
| `pnpm test`          | Run Vitest in watch mode                                                 |
| `pnpm test:run`      | Run unit tests once                                                      |
| `pnpm test:coverage` | Run tests and enforce coverage thresholds                                |
| `pnpm lint`          | Check the repository with oxlint                                         |
| `pnpm format`        | Format supported files with oxfmt                                        |
| `pnpm format:check`  | Verify formatting without changing files                                 |
| `pnpm check`         | Run formatting, linting, coverage, type checks, and the production build |

## Architecture

The project produces a fully static site. Astro components render the page shell, localized content, and accessible controls at build time; focused, framework-free TypeScript controllers add browser behavior after the page loads.

```text
src/
├── components/       Static Astro sections and controls
├── i18n/             Typed locale routing and English/Spanish dictionaries
├── interfaces/       Shared QR option types
├── layouts/          Document shell, metadata, and structured data
├── pages/            Static English (/) and Spanish (/es/) routes
├── scripts/          QR, theme, state, and language-navigation controllers
├── test/             Shared Vitest setup
├── utils/            Rendering, image validation, and filename helpers
└── index.css         Tailwind import and global component styles
public/               Redirects, crawl metadata, icons, and social assets
docs/                 Design specifications
.github/workflows/    Continuous integration
```

### QR Generation Flow

1. `QRGenerator.astro` renders the form, preview, customization controls, and localized status messages.
2. `scripts/qrGenerator.ts` reads user input, creates a QR matrix with `qrcode`, and coordinates state and downloads.
3. `utils/qrRenderer.ts` draws the matrix and optional center image to Canvas for preview/PNG or serializes equivalent SVG markup.
4. `utils/imageUpload.ts` validates and decodes local image files before rendering.

Uploaded content never enters an application server. Standard generator settings are stored in `sessionStorage`; uploaded image data and image-specific adjustments are intentionally not persisted. Theme choice is stored separately in `localStorage` and otherwise follows the operating-system preference.

## Localization and SEO

English is served at `/` and Spanish at `/es/`. Both routes use the same typed `Translation` contract, shared components, localized page metadata, canonical and alternate-language links, Open Graph and Twitter metadata, and JSON-LD describing the site as a free web application. Update both dictionaries whenever user-facing copy changes.

Static `robots.txt`, `sitemap.xml`, social images, and the `/es` redirect live in `public/` and are copied into the production build.

## Testing and Quality

Unit tests are colocated with TypeScript modules as `*.test.ts` and run in jsdom. Coverage thresholds are 80% for statements, functions, and lines, and 75% for branches.

CI runs on pushes and pull requests to `main` using Node.js 22. It installs dependencies from the lockfile, then checks linting, formatting, test coverage, type safety, and the static production build. Run the same pipeline locally before submitting changes:

```bash
pnpm check
```

## Deployment

```bash
pnpm build
```

The generated `dist/` directory can be deployed to any static host. The current production URL and public SEO assets target Cloudflare Pages, so update the canonical site URL in `src/layouts/BaseLayout.astro` and URLs under `public/` when deploying under another domain.

## Privacy

QR text and uploaded images are processed locally by browser APIs. The application has no backend endpoint for QR generation and does not upload that content to a server.

## Contributing

Keep Astro components static, put browser interactions in `src/scripts/`, reusable rendering logic in `src/utils/`, shared types in `src/interfaces/`, and translations in both locale dictionaries. Add or update colocated tests for observable behavior, run `pnpm format`, and verify the complete pipeline with `pnpm check` before opening a pull request.
