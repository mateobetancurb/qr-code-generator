# QR Code Generator

A modern, responsive QR code generator built with React, TypeScript, and Vite. Generate customizable QR codes instantly with full color control, brand logo support, multiple export formats, and a beautiful dark mode interface.

![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## Features

- **Lightning Fast**: Generate QR codes instantly with real-time preview
- **Custom Colors**: Personalize QR codes with custom foreground and background colors
- **Brand Logo**: Upload a custom image to embed as a logo in the center of the QR code
- **Multiple Formats**: Download in PNG or SVG format for any use case
- **Privacy First**: All QR codes generated locally in your browser — your data never leaves your device
- **Internationalization**: Full i18n support with English and Spanish locales
- **Mobile Friendly**: Fully responsive design that works perfectly on all devices
- **Dark Mode**: Beautiful dark/light theme with automatic system preference detection
- **No Registration**: Start generating QR codes immediately, completely free

## Tech Stack

### Core Technologies

- **React 19.2.6** — Modern React with latest features
- **TypeScript 6.0+** — Type-safe development
- **Vite 8.0** — Lightning-fast build tool and dev server

### Styling & UI

- **Tailwind CSS 4.3** — Utility-first CSS framework via `@tailwindcss/vite` plugin
- **Lucide React 1.16** — Beautiful, customizable icons

### QR Generation

- **qrcode 1.5.4** — Robust QR code generation library
- **Canvas API** — High-quality rendering, color customization, and logo compositing

### Internationalization

- **Custom i18n layer** — Lightweight locale system with English (`en`) and Spanish (`es`) translations

### Development Tools

- **oxlint** — Fast, Rust-based linter
- **oxfmt** — Rust-based code formatter
- **TypeScript ESLint** — TypeScript-specific linting rules
- **@vitejs/plugin-react** — Optimized React development experience
- **pnpm** — Fast, disk-efficient package manager

## Project Architecture

### Source Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation with dark mode & locale toggles
│   ├── Hero.tsx            # Landing section with animated elements
│   ├── QRGenerator.tsx     # Main QR code generation interface
│   ├── Features.tsx        # Feature showcase section
│   ├── SocialIcons.tsx     # Reusable social media icon links
│   └── Footer.tsx          # Site footer with links
├── context/
│   ├── DarkMode.tsx        # Global dark mode state management
│   └── Locale.tsx          # Global locale/language state management
├── i18n/
│   ├── getTranslation.ts   # Translation lookup helper
│   ├── types.ts            # i18n type definitions
│   └── locales/
│       ├── en.ts           # English translations
│       └── es.ts           # Spanish translations
├── interfaces/
│   └── index.ts            # Shared TypeScript type definitions
├── utils/
│   └── index.ts            # Utility functions and constants
├── App.tsx                 # Root component with context providers
└── main.tsx                # Application entry point
```

### Key Components

#### QRGenerator

The heart of the application — handles:

- Real-time QR code generation via the `qrcode` library
- Color customization (foreground & background)
- Size selection (200×200 to 500×500)
- Custom logo upload via image compositing on Canvas
- File download in PNG and SVG formats
- Smart filename generation based on content

#### Context Providers

| Provider | Responsibility |
|---|---|
| `DarkMode.tsx` | System preference detection, localStorage persistence, theme switching |
| `Locale.tsx` | Language selection (EN/ES), localStorage persistence, locale switching |

#### i18n Layer

A lightweight, custom i18n system with no external dependencies:

- Locale strings defined in `src/i18n/locales/`
- `getTranslation.ts` resolves keys for the active locale
- Consumed via the `Locale` context throughout the component tree

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mateobetancurb/qr-code-generator.git
   cd qr-code-generator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

## Usage

1. **Enter Content**: Type any text or paste a URL into the text area
2. **Customize**:
   - Choose from 4 different sizes (200×200 to 500×500)
   - Pick custom foreground and background colors
   - Upload a custom image to embed as a center logo
   - Preview changes in real-time
3. **Download**: Export your QR code as PNG or SVG

### Example Use Cases

- **Business Cards**: Add contact information or LinkedIn profiles
- **Event Tickets**: Include event details or check-in links
- **Marketing**: Link to websites, social media, or promotional content
- **WiFi Sharing**: Generate QR codes for WiFi credentials
- **Product Information**: Link to manuals, specifications, or reviews

## Design Features

- **Glassmorphism Effects**: Modern translucent UI elements
- **Smooth Animations**: CSS-based transitions and micro-interactions
- **Gradient Backgrounds**: Dynamic, animated gradient overlays
- **Responsive Typography**: Scales beautifully across all devices
- **Accessibility**: Keyboard navigation and screen reader support

## Development

### Project Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run oxlint |
| `pnpm format` | Run oxfmt formatter |
| `pnpm format:check` | Check formatting without writing |

### Code Quality

The project uses:

- **TypeScript 6** for type safety with strict configuration
- **oxlint** — fast Rust-based linter for JavaScript/TypeScript
- **oxfmt** — Rust-based formatter
- **Modern React patterns** (hooks, functional components, context API)

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Built with love for the community
- Inspired by modern web design principles
- Icons provided by [Lucide React](https://lucide.dev/)
- QR generation powered by [qrcode](https://github.com/soldair/node-qrcode)

---

**Made by [Mateo](https://github.com/mateobetancurb)**
