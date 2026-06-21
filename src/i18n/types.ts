export type Locale = "en" | "es";

export interface FeatureCardCopy {
	id: number;
	title: string;
	description: string;
}

export interface Translation {
	meta: {
		title: string;
		description: string;
	};
	header: {
		home: string;
		generateQr: string;
		features: string;
		contact: string;
	};
	hero: {
		badge: string;
		headlineLine1: string;
		headlineLine2: string;
		subtext: string;
		cta: string;
		statQrGenerated: string;
		statFreeToUse: string;
		statGenerationTime: string;
	};
	generator: {
		title: string;
		subtitle: string;
		content: string;
		textOrUrl: string;
		placeholder: string;
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
		background: string;
		preview: string;
		emptyPreview: string;
		downloadPng: string;
		downloadSvg: string;
	};
	features: {
		heading: string;
		subheading: string;
		trustedTitle: string;
		statQrsLabel: string;
		statCountriesLabel: string;
		statUptimeLabel: string;
		statFreeLabel: string;
		cards: FeatureCardCopy[];
	};
	footer: {
		tagline: string;
		quickLinks: string;
		home: string;
		qrGenerator: string;
		features: string;
		copyright: string;
		madeWith: string;
		locallyGenerated: string;
	};
}
