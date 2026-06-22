export type Locale = "en" | "es";

export interface FaqCopy {
	question: string;
	answer: string;
}

export interface TrustCopy {
	icon: "check" | "shield";
	title: string;
	description: string;
}

export interface Translation {
	meta: {
		title: string;
		description: string;
	};
	header: {
		skipToContent: string;
		home: string;
		language: string;
		switchToDark: string;
		switchToLight: string;
	};
	generator: {
		kicker: string;
		title: string;
		subtitle: string;
		content: string;
		contentHint: string;
		textOrUrl: string;
		placeholder: string;
		customize: string;
		customizeHint: string;
		size: string;
		sizeSmall: string;
		sizeMedium: string;
		sizeLarge: string;
		sizeXlarge: string;
		pattern: string;
		patternSquare: string;
		patternDots: string;
		colors: string;
		foreground: string;
		foregroundHex: string;
		background: string;
		backgroundHex: string;
		image: string;
		imageHint: string;
		selectImage: string;
		replaceImage: string;
		removeImage: string;
		imageSize: string;
		imageRadius: string;
		imageBackground: string;
		imageBackgroundColor: string;
		imageBackgroundHex: string;
		imageTypeError: string;
		imageSizeError: string;
		imageDecodeError: string;
		preview: string;
		livePreview: string;
		emptyPreview: string;
		previewReady: string;
		previewLabel: string;
		generationError: string;
		downloadPng: string;
		downloadSvg: string;
	};
	trust: {
		label: string;
		items: TrustCopy[];
	};
	faq: {
		heading: string;
		subheading: string;
		items: FaqCopy[];
	};
	footer: {
		copyright: string;
		localProcessing: string;
		creatorCredit: string;
	};
}
