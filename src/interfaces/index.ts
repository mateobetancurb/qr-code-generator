export type ModuleStyle = "square" | "dots";

export interface QROptions {
	text: string;
	size: "small" | "medium" | "large" | "xlarge";
	moduleStyle: ModuleStyle;
	foregroundColor: string;
	backgroundColor: string;
	logo?: string;
}
