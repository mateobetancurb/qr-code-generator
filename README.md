# QR Code Generator

A modern, responsive QR code generator built with React, TypeScript, and Vite. Generate customizable QR codes instantly with full color control, multiple export formats, and a beautiful dark mode interface.

![QR Code Generator](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## ✨ Features

- **🚀 Lightning Fast**: Generate QR codes instantly with real-time preview
- **🎨 Custom Colors**: Personalize QR codes with custom foreground and background colors
- **📱 Multiple Formats**: Download in PNG or SVG format for any use case
- **🔒 Privacy First**: All QR codes generated locally in your browser - your data never leaves your device
- **📱 Mobile Friendly**: Fully responsive design that works perfectly on all devices
- **🌙 Dark Mode**: Beautiful dark/light theme with automatic system preference detection
- **🎯 No Registration**: Start generating QR codes immediately, completely free

## 🛠️ Tech Stack

### Core Technologies

- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.8+** - Type-safe development
- **Vite 7.1.2** - Lightning-fast build tool and dev server

### Styling & UI

- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Lucide React 0.542.0** - Beautiful, customizable icons
- **Custom CSS animations** - Smooth transitions and micro-interactions

### QR Generation

- **qrcode 1.5.4** - Robust QR code generation library
- **Canvas API** - High-quality rendering and customization

### Development Tools

- **ESLint** - Code linting and quality assurance
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Vite React Plugin** - Optimized React development experience

## 🏗️ Project Architecture

### Component Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation with dark mode toggle
│   ├── Hero.tsx            # Landing section with animated elements
│   ├── QRGenerator.tsx     # Main QR code generation interface
│   ├── Features.tsx        # Feature showcase section
│   └── Footer.tsx          # Site footer with links
├── context/
│   └── DarkMode.tsx        # Global dark mode state management
├── interfaces/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   └── index.ts            # Utility functions and constants
└── App.tsx                 # Root component with providers
```

### Key Components

#### QRGenerator

The heart of the application - handles:

- Real-time QR code generation
- Color customization (foreground/background)
- Size selection (200x200 to 500x500)
- File download in PNG/SVG formats
- Smart filename generation based on content

#### DarkMode Context

Comprehensive dark mode implementation with:

- System preference detection
- Local storage persistence
- Smooth transitions between themes
- Provider pattern for global state

#### Responsive Design

- Mobile-first approach
- Collapsible navigation for smaller screens
- Adaptive layouts for all screen sizes
- Touch-friendly interactive elements

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/qr-code-generator.git
   cd qr-code-generator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
pnpm build
# or
npm run build
```

The built files will be in the `dist` directory.

## 📖 Usage

1. **Enter Content**: Type any text or paste a URL into the text area
2. **Customize**:
   - Choose from 4 different sizes (200x200 to 500x500)
   - Pick custom foreground and background colors
   - Preview changes in real-time
3. **Download**: Export your QR code as PNG or SVG

### Example Use Cases

- **Business Cards**: Add contact information or LinkedIn profiles
- **Event Tickets**: Include event details or check-in links
- **Marketing**: Link to websites, social media, or promotional content
- **WiFi Sharing**: Generate QR codes for WiFi credentials
- **Product Information**: Link to manuals, specifications, or reviews

## 🎨 Design Features

- **Glassmorphism Effects**: Modern translucent UI elements
- **Smooth Animations**: CSS-based transitions and micro-interactions
- **Gradient Backgrounds**: Dynamic, animated gradient overlays
- **Responsive Typography**: Scales beautifully across all devices
- **Accessibility**: Keyboard navigation and screen reader support

## 🧩 Development

### Project Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build

### Code Quality

The project uses:

- **TypeScript** for type safety
- **ESLint** with React and TypeScript rules
- **Strict TypeScript configuration**
- **Modern React patterns** (hooks, functional components)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💝 Acknowledgments

- Built with ❤️ for the community
- Inspired by modern web design principles
- Icons provided by [Lucide React](https://lucide.dev/)
- QR generation powered by [qrcode](https://github.com/soldair/node-qrcode)

---

**Made with 💙 by [Mateo](https://github.com/mateobetancurb)**
