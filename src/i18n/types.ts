export type Locale = "en" | "es";

export interface FeatureCardCopy {
	id: number;
	title: string;
	description: string;
}

export interface LabeledValueCopy {
	value: string;
	label: string;
}

export interface StepCopy {
	title: string;
	description: string;
}

export interface FaqCopy {
	question: string;
	answer: string;
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
		howItWorks: string;
		faq: string;
		contact: string;
	};
	hero: {
		badge: string;
		headlineLine1: string;
		headlineLine2: string;
		subtext: string;
		cta: string;
		benefits: LabeledValueCopy[];
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
		highlightsTitle: string;
		highlights: LabeledValueCopy[];
		cards: FeatureCardCopy[];
	};
	howItWorks: {
		heading: string;
		subheading: string;
		steps: StepCopy[];
	};
	faq: {
		heading: string;
		subheading: string;
		items: FaqCopy[];
	};
	footer: {
		tagline: string;
		quickLinks: string;
		home: string;
		qrGenerator: string;
		features: string;
		howItWorks: string;
		faq: string;
		copyright: string;
		madeWith: string;
		locallyGenerated: string;
	};
}
