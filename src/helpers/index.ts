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
