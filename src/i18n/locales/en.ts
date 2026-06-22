import type { Translation } from "../types";

export const en: Translation = {
	meta: {
		title: "Free QR Code Generator | Customize & Download",
		description:
			"Create custom QR codes for links and text with our free QR code generator. Choose colors, sizes, and patterns, then download PNG or SVG files instantly.",
	},
	header: {
		skipToContent: "Skip to main content",
		home: "Home",
		generateQr: "Generate QR",
		features: "Features",
		howItWorks: "How it works",
		faq: "FAQ",
		contact: "Contact",
		language: "Language",
		primaryNavigation: "Primary navigation",
		mobileNavigation: "Mobile navigation",
		openMenu: "Open navigation menu",
		closeMenu: "Close navigation menu",
		switchToDark: "Switch to dark mode",
		switchToLight: "Switch to light mode",
	},
	hero: {
		badge: "Fast & Reliable QR Generation",
		headlineLine1: "Generate Your",
		headlineLine2: "QR Code Instantly",
		subtext:
			"Create custom QR codes for your business, events, or personal use. Fast, free, and with full customization options including colors and sizes.",
		cta: "Get Started",
		benefits: [
			{ value: "Free", label: "No cost to use" },
			{ value: "No account", label: "No registration" },
			{ value: "On device", label: "Private by design" },
		],
	},
	generator: {
		title: "QR Code Generator",
		subtitle: "Customize your QR code with different sizes, patterns, colors, and download formats",
		content: "Content",
		textOrUrl: "Text or URL",
		placeholder: "Enter text or links to generate QR code",
		size: "Size",
		sizeSmall: "Small (200x200)",
		sizeMedium: "Medium (300x300)",
		sizeLarge: "Large (400x400)",
		sizeXlarge: "Extra Large (500x500)",
		pattern: "Pattern",
		patternSquare: "Square",
		patternDots: "Dots",
		colors: "Colors",
		foreground: "Foreground",
		foregroundHex: "Foreground hex color",
		background: "Background",
		backgroundHex: "Background hex color",
		preview: "Preview",
		emptyPreview: "Enter text to generate QR code",
		previewReady: "QR code preview ready",
		previewLabel: "Generated QR code preview",
		generationError:
			"The QR code could not be generated. Check the content and colors and try again.",
		downloadPng: "Download PNG",
		downloadSvg: "Download SVG",
	},
	features: {
		heading: "Why Choose this tool?",
		subheading:
			"Powerful features designed to make QR code generation simple, fast, and customizable",
		highlightsTitle: "Everything you need to create a QR code",
		highlights: [
			{ value: "Local", label: "Browser processing" },
			{ value: "PNG + SVG", label: "Download formats" },
			{ value: "4", label: "Output sizes" },
			{ value: "2", label: "Module patterns" },
		],
		cards: [
			{
				id: 1,
				title: "Lightning Fast",
				description: "Generate QR codes instantly with real-time preview. No waiting, no delays",
			},
			{
				id: 2,
				title: "Custom Colors",
				description: "Personalize your QR codes with custom foreground and background colors",
			},
			{
				id: 3,
				title: "Multiple Formats",
				description: "Download your QR codes in PNG or SVG format for any use case",
			},
			{
				id: 4,
				title: "Privacy First",
				description:
					"All QR codes are generated locally in your browser. Your data never leaves your device",
			},
			{
				id: 5,
				title: "Mobile Friendly",
				description:
					"Fully responsive design works perfectly on desktop, tablet, and mobile devices",
			},
			{
				id: 6,
				title: "No Registration",
				description: "Start generating QR codes immediately. No account needed, completely free",
			},
		],
	},
	howItWorks: {
		heading: "How to create a QR code",
		subheading: "Turn a link or text into a downloadable QR code in three simple steps.",
		steps: [
			{
				title: "Enter your content",
				description: "Paste a website link or type the text you want your QR code to contain.",
			},
			{
				title: "Customize the design",
				description:
					"Choose the size, square or dot pattern, and foreground and background colors.",
			},
			{
				title: "Download your QR code",
				description: "Save a PNG for everyday use or an SVG for sharp scaling in print and design.",
			},
		],
	},
	faq: {
		heading: "QR code generator questions",
		subheading: "Quick answers about creating, customizing, and downloading your QR code.",
		items: [
			{
				question: "What can I put in a QR code?",
				answer:
					"You can encode a website link or any plain text. The scanner displays the text or offers to open the link when someone scans the code.",
			},
			{
				question: "Is this QR code generator free?",
				answer:
					"Yes. You can generate, customize, and download QR codes without creating an account or paying a fee.",
			},
			{
				question: "Is my content uploaded anywhere?",
				answer:
					"No. QR codes are generated locally in your browser, so the text you enter does not need to leave your device.",
			},
			{
				question: "Should I download PNG or SVG?",
				answer:
					"PNG works well for websites, documents, and sharing. SVG stays sharp at any size and is better for print or design software.",
			},
			{
				question: "How do I keep a custom QR code easy to scan?",
				answer:
					"Use strong contrast between foreground and background colors, and test the downloaded code with more than one camera before publishing it.",
			},
		],
	},
	footer: {
		tagline:
			"Generate beautiful, customizable QR codes instantly. Fast, free, and privacy-focused. Perfect for businesses, events, and personal use",
		quickLinks: "Quick Links",
		home: "Home",
		qrGenerator: "QR Generator",
		features: "Features",
		howItWorks: "How it works",
		faq: "FAQ",
		socialLinks: "Social links",
		github: "Mateo Betancur on GitHub",
		twitter: "Mateo Betancur on X",
		linkedin: "Mateo Betancur on LinkedIn",
		copyright: "© {year} QRGenerator",
		madeWith: "Made with 💙 for the community by Mateo",
		locallyGenerated: "All QR codes generated locally in your browser",
	},
};
