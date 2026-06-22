import type { QRImage } from "./qrRenderer";

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const acceptedImageTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

export type ImageUploadError = "type" | "size" | "decode";

export class ImageUploadValidationError extends Error {
	constructor(public readonly reason: ImageUploadError) {
		super(reason);
	}
}

const readFileAsDataUrl = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			if (typeof reader.result === "string") resolve(reader.result);
			else reject(new ImageUploadValidationError("decode"));
		});
		reader.addEventListener("error", () => reject(new ImageUploadValidationError("decode")));
		reader.readAsDataURL(file);
	});

const decodeImage = (dataUrl: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", () => reject(new ImageUploadValidationError("decode")));
		image.src = dataUrl;
	});

export const loadImageFile = async (file: File): Promise<QRImage> => {
	if (!acceptedImageTypes.has(file.type)) throw new ImageUploadValidationError("type");
	if (file.size > MAX_IMAGE_BYTES) throw new ImageUploadValidationError("size");

	const dataUrl = await readFileAsDataUrl(file);
	const source = await decodeImage(dataUrl);
	if (!source.naturalWidth || !source.naturalHeight) {
		throw new ImageUploadValidationError("decode");
	}

	return {
		dataUrl,
		source,
		width: source.naturalWidth,
		height: source.naturalHeight,
	};
};
