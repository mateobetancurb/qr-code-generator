import {
	Globe,
	Smartphone,
	Zap,
	Palette,
	Download,
	Shield,
} from "lucide-react";

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

export const features = [
	{
		id: 1,
		icon: Zap,
		title: "Lightning Fast",
		description:
			"Generate QR codes instantly with real-time preview. No waiting, no delays",
		color: "text-yellow-500",
		bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
	},
	{
		id: 2,
		icon: Palette,
		title: "Custom Colors",
		description:
			"Personalize your QR codes with custom foreground and background colors",
		color: "text-purple-500",
		bgColor: "bg-purple-100 dark:bg-purple-900/20",
	},
	{
		id: 3,
		icon: Download,
		title: "Multiple Formats",
		description: "Download your QR codes in PNG or SVG format for any use case",
		color: "text-blue-500",
		bgColor: "bg-blue-100 dark:bg-blue-900/20",
	},
	{
		id: 4,
		icon: Shield,
		title: "Privacy First",
		description:
			"All QR codes are generated locally in your browser. Your data never leaves your device",
		color: "text-blue-500",
		bgColor: "bg-blue-100 dark:bg-blue-900/20",
	},
	{
		id: 5,
		icon: Smartphone,
		title: "Mobile Friendly",
		description:
			"Fully responsive design works perfectly on desktop, tablet, and mobile devices",
		color: "text-red-500",
		bgColor: "bg-red-100 dark:bg-red-900/20",
	},
	{
		id: 6,
		icon: Globe,
		title: "No Registration",
		description:
			"Start generating QR codes immediately. No account needed, completely free",
		color: "text-indigo-500",
		bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
	},
];
