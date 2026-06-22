import type { Translation } from "../types";

export const en: Translation = {
	meta: {
		title: "Free QR Code Generator | Customize & Download",
		description:
			"Create custom QR codes for links and text with our free QR code generator. Choose colors, sizes, and patterns, then download PNG or SVG files instantly.",
	},
	header: {
		skipToContent: "Skip to main content",
		home: "QRGenerator home",
		language: "Language",
		switchToDark: "Switch to dark mode",
		switchToLight: "Switch to light mode",
	},
	generator: {
		kicker: "Private. Fast. Yours.",
		title: "Create your QR code",
		subtitle:
			"Add your content, customize the design, and download a ready-to-use QR code in seconds.",
		content: "Content",
		contentHint: "Your QR code updates as you type.",
		textOrUrl: "Text or URL",
		placeholder: "https://example.com or any text",
		customize: "Customize",
		customizeHint: "Size, pattern, and colors",
		size: "Size",
		sizeSmall: "Small (200 × 200)",
		sizeMedium: "Medium (300 × 300)",
		sizeLarge: "Large (400 × 400)",
		sizeXlarge: "Extra large (500 × 500)",
		pattern: "Pattern",
		patternSquare: "Square",
		patternDots: "Dots",
		colors: "Colors",
		foreground: "Foreground",
		foregroundHex: "Foreground hex color",
		background: "Background",
		backgroundHex: "Background hex color",
		image: "Image or logo (optional)",
		imageHint: "PNG, JPEG, or WebP up to 2 MB. Your image stays on this device.",
		selectImage: "Choose image",
		replaceImage: "Replace image",
		removeImage: "Remove image",
		imageSize: "Image size",
		imageRadius: "Corner roundness",
		imageBackground: "Background behind image",
		imageBackgroundColor: "Image background color",
		imageBackgroundHex: "Image background hex color",
		imageTypeError: "Choose a PNG, JPEG, or WebP image.",
		imageSizeError: "Choose an image smaller than 2 MB.",
		imageDecodeError: "This image could not be opened. Try a different file.",
		preview: "Preview",
		livePreview: "Live",
		emptyPreview: "Your QR code will appear here",
		previewReady: "QR code preview ready",
		previewLabel: "Generated QR code preview",
		generationError:
			"The QR code could not be generated. Check the content and colors and try again.",
		downloadPng: "Download PNG",
		downloadSvg: "Download SVG",
	},
	trust: {
		label: "Why use QRGenerator",
		items: [
			{ icon: "check", title: "Free to use", description: "No limits or fees" },
			{ icon: "check", title: "No account", description: "Start immediately" },
			{ icon: "shield", title: "Processed locally", description: "Your data stays on your device" },
		],
	},
	faq: {
		heading: "Questions, answered",
		subheading: "The essentials about privacy, file formats, and reliable scanning.",
		items: [
			{
				question: "Is my content uploaded anywhere?",
				answer:
					"No. QR codes are generated locally in your browser, so the text you enter does not leave your device.",
			},
			{
				question: "Should I download PNG or SVG?",
				answer:
					"PNG works well for websites, documents, and sharing. SVG stays sharp at any size and is best for print or design software.",
			},
			{
				question: "How do I keep my QR code easy to scan?",
				answer:
					"Use strong contrast between foreground and background colors. Test the downloaded code with more than one camera before publishing it.",
			},
		],
	},
	footer: {
		copyright: "© {year} QRGenerator",
		localProcessing: "QR codes generated locally in your browser",
		creatorCredit: "Created by {name}",
	},
};
