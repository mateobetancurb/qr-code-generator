import { Globe, Smartphone, Zap, Palette, Download, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const generateFilename = (text: string): string => {
	if (!text.trim()) return "qrcode";
	try {
		// check if its a url
		const url = new URL(text);
		let domain = url.hostname.replace(/^www\./, "");
		// remove tld (.com, .org, etc.) and use just the domain name
		domain = domain.split(".")[0];
		return domain || "qrcode";
	} catch {
		// not a url, treat as regular text
		// clean the text: remove special characters, limit length, convert to lowercase
		let filename = text
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "") // remove special characters except spaces and hyphens
			.replace(/\s+/g, "-") // replace spaces with hyphens
			.replace(/-+/g, "-") // replace multiple hyphens with single hyphen
			.trim()
			.substring(0, 30); // limit to 30 characters

		// remove leading/trailing hyphens
		filename = filename.replace(/^-+|-+$/g, "");

		return filename || "qrcode";
	}
};

export const sizeMap = {
	small: 200,
	medium: 300,
	large: 400,
	xlarge: 500,
};

export interface FeatureCardConfig {
	id: number;
	icon: LucideIcon;
	color: string;
	bgColor: string;
}

export const featureCardConfig: FeatureCardConfig[] = [
	{
		id: 1,
		icon: Zap,
		color: "text-yellow-500",
		bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
	},
	{
		id: 2,
		icon: Palette,
		color: "text-purple-500",
		bgColor: "bg-purple-100 dark:bg-purple-900/20",
	},
	{
		id: 3,
		icon: Download,
		color: "text-blue-500",
		bgColor: "bg-blue-100 dark:bg-blue-900/20",
	},
	{
		id: 4,
		icon: Shield,
		color: "text-blue-500",
		bgColor: "bg-blue-100 dark:bg-blue-900/20",
	},
	{
		id: 5,
		icon: Smartphone,
		color: "text-red-500",
		bgColor: "bg-red-100 dark:bg-red-900/20",
	},
	{
		id: 6,
		icon: Globe,
		color: "text-indigo-500",
		bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
	},
];
