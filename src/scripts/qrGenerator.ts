import QRCode from "qrcode";
import type { ModuleStyle, QROptions } from "../interfaces";
import { generateFilename, sizeMap } from "../utils";
import { ImageUploadValidationError, loadImageFile } from "../utils/imageUpload";
import { renderQRToCanvas, renderQRToSVG, type QRImage } from "../utils/qrRenderer";
import {
	readQRGeneratorState,
	writeQRGeneratorState,
	type QRGeneratorState,
} from "./qrGeneratorState";

let initializedRoot: HTMLElement | null = null;
let cleanupCurrentRoot: (() => void) | null = null;

export const initQRGenerator = (): void => {
	const root = document.querySelector<HTMLElement>("[data-qr-generator]");
	if (!root) return;
	if (root === initializedRoot) return;
	const text = root.querySelector<HTMLTextAreaElement>("[data-qr-text]");
	const size = root.querySelector<HTMLSelectElement>("[data-qr-size]");
	const canvas = root.querySelector<HTMLCanvasElement>("[data-qr-canvas]");
	const emptyPreview = root.querySelector<HTMLElement>("[data-empty-preview]");
	const status = root.querySelector<HTMLElement>("[data-qr-status]");
	const error = root.querySelector<HTMLElement>("[data-qr-error]");
	const downloads = root.querySelector<HTMLElement>("[data-downloads]");
	if (!text || !size || !canvas || !emptyPreview || !status || !error || !downloads) return;
	cleanupCurrentRoot?.();
	initializedRoot = root;

	const options: QROptions = {
		text: "",
		size: "medium",
		moduleStyle: "square",
		foregroundColor: "#000000",
		backgroundColor: "#ffffff",
	};
	let dataURL = "";
	let uploadedImage: QRImage | null = null;
	let imageSize = 20;
	let imageRadius = 0;
	let imageBackgroundEnabled = false;
	let imageBackgroundColor = options.backgroundColor;
	let imageBackgroundCustomized = false;
	let syncLinkedImageBackground = (): void => undefined;
	let imageRequest = 0;
	const customization = root.querySelector<HTMLDetailsElement>("[data-customization]");
	const imageInput = root.querySelector<HTMLInputElement>("[data-qr-image]");
	const imageSelect = root.querySelector<HTMLElement>("[data-image-select]");
	const imageSelectText = imageSelect?.querySelector<HTMLElement>("span");
	const imageSelection = root.querySelector<HTMLElement>("[data-image-selection]");
	const imageThumbnail = root.querySelector<HTMLImageElement>("[data-image-thumbnail]");
	const imageName = root.querySelector<HTMLElement>("[data-image-name]");
	const imageError = root.querySelector<HTMLElement>("[data-image-error]");
	const imageRemove = root.querySelector<HTMLButtonElement>("[data-image-remove]");
	const imageControls = root.querySelector<HTMLElement>("[data-image-controls]");
	const imageSizeInput = root.querySelector<HTMLInputElement>("[data-image-size]");
	const imageSizeOutput = root.querySelector<HTMLOutputElement>("[data-image-size-output]");
	const imageRadiusInput = root.querySelector<HTMLInputElement>("[data-image-radius]");
	const imageRadiusOutput = root.querySelector<HTMLOutputElement>("[data-image-radius-output]");
	const imageBackgroundInput = root.querySelector<HTMLInputElement>("[data-image-background]");
	const imageBackgroundControls = root.querySelector<HTMLElement>(
		"[data-image-background-controls]",
	);
	const imageBackgroundPicker = root.querySelector<HTMLInputElement>(
		"[data-image-background-picker]",
	);
	const imageBackgroundText = root.querySelector<HTMLInputElement>("[data-image-background-text]");
	const desktop = window.matchMedia("(min-width: 56rem)");
	const storedState = readQRGeneratorState();
	let preferredCustomizationOpen = storedState?.customizationOpen ?? false;
	if (storedState) {
		Object.assign(options, {
			text: storedState.text,
			size: storedState.size,
			moduleStyle: storedState.moduleStyle,
			foregroundColor: storedState.foregroundColor,
			backgroundColor: storedState.backgroundColor,
		});
		text.value = storedState.text;
		size.value = storedState.size;
		for (const button of root.querySelectorAll<HTMLButtonElement>("[data-module-style]")) {
			const selected = button.dataset.moduleStyle === storedState.moduleStyle;
			button.setAttribute("aria-pressed", String(selected));
			button.classList.toggle("is-selected", selected);
		}
		for (const kind of ["foreground", "background"] as const) {
			const color =
				kind === "foreground" ? storedState.foregroundColor : storedState.backgroundColor;
			const picker = root.querySelector<HTMLInputElement>(`[data-color-picker="${kind}"]`);
			const colorText = root.querySelector<HTMLInputElement>(`[data-color-text="${kind}"]`);
			if (picker) picker.value = color;
			if (colorText) colorText.value = color;
		}
	}
	const persist = (): void => {
		writeQRGeneratorState({
			version: 1,
			...options,
			text: text.value,
			customizationOpen: preferredCustomizationOpen,
		} satisfies QRGeneratorState);
	};
	const syncCustomization = (): void => {
		if (!customization) return;
		customization.open = desktop.matches || (storedState?.customizationOpen ?? false);
	};
	syncCustomization();
	desktop.addEventListener("change", syncCustomization);
	cleanupCurrentRoot = () => {
		imageRequest += 1;
		desktop.removeEventListener("change", syncCustomization);
	};

	const createQRCode = () =>
		QRCode.create(options.text, uploadedImage ? { errorCorrectionLevel: "H" } : undefined);
	const getRenderOptions = () => ({
		width: sizeMap[options.size],
		moduleStyle: options.moduleStyle,
		foregroundColor: options.foregroundColor,
		backgroundColor: options.backgroundColor,
		...(uploadedImage
			? {
					image: uploadedImage,
					imageSize: imageSize / 100,
					imageRadius: imageRadius / 100,
					...(imageBackgroundEnabled ? { imageBackgroundColor } : {}),
				}
			: {}),
	});

	const render = (): void => {
		options.text = text.value;
		if (!options.text.trim()) {
			dataURL = "";
			canvas.hidden = true;
			emptyPreview.hidden = false;
			downloads.hidden = true;
			error.hidden = true;
			status.textContent = status.dataset.empty ?? "";
			persist();
			return;
		}
		try {
			const qrCode = createQRCode();
			renderQRToCanvas(canvas, qrCode, getRenderOptions());
			dataURL = canvas.toDataURL("image/png");
			canvas.hidden = false;
			emptyPreview.hidden = true;
			downloads.hidden = false;
			error.hidden = true;
			status.textContent = status.dataset.ready ?? "";
			persist();
		} catch (caught) {
			console.error("Error generating QR code:", caught);
			dataURL = "";
			canvas.hidden = true;
			emptyPreview.hidden = false;
			downloads.hidden = true;
			error.hidden = false;
		}
	};

	text.addEventListener("input", render);
	size.addEventListener("change", () => {
		options.size = size.value as QROptions["size"];
		render();
	});
	for (const button of root.querySelectorAll<HTMLButtonElement>("[data-module-style]")) {
		button.addEventListener("click", () => {
			options.moduleStyle = button.dataset.moduleStyle as ModuleStyle;
			for (const candidate of root.querySelectorAll<HTMLButtonElement>("[data-module-style]")) {
				const selected = candidate === button;
				candidate.setAttribute("aria-pressed", String(selected));
				candidate.classList.toggle("is-selected", selected);
			}
			render();
		});
	}

	for (const kind of ["foreground", "background"] as const) {
		const picker = root.querySelector<HTMLInputElement>(`[data-color-picker="${kind}"]`);
		const colorText = root.querySelector<HTMLInputElement>(`[data-color-text="${kind}"]`);
		if (!picker || !colorText) continue;
		picker.addEventListener("input", () => {
			colorText.value = picker.value;
			options[kind === "foreground" ? "foregroundColor" : "backgroundColor"] = picker.value;
			if (kind === "background") syncLinkedImageBackground();
			render();
		});
		colorText.addEventListener("input", () => {
			options[kind === "foreground" ? "foregroundColor" : "backgroundColor"] = colorText.value;
			if (/^#[\da-f]{6}$/i.test(colorText.value)) picker.value = colorText.value;
			if (kind === "background") syncLinkedImageBackground();
			render();
		});
	}
	customization?.addEventListener("toggle", () => {
		if (!desktop.matches) preferredCustomizationOpen = customization.open;
		persist();
	});

	if (
		imageInput &&
		imageSelect &&
		imageSelectText &&
		imageSelection &&
		imageThumbnail &&
		imageName &&
		imageError &&
		imageRemove &&
		imageControls &&
		imageSizeInput &&
		imageSizeOutput &&
		imageRadiusInput &&
		imageRadiusOutput &&
		imageBackgroundInput &&
		imageBackgroundControls &&
		imageBackgroundPicker &&
		imageBackgroundText
	) {
		const setImageError = (reason: "type" | "size" | "decode" | null): void => {
			imageError.hidden = reason === null;
			imageError.textContent = reason ? (imageError.dataset[reason] ?? "") : "";
		};
		const syncImageSelection = (file?: File): void => {
			const hasImage = Boolean(uploadedImage && file);
			imageSelection.hidden = !hasImage;
			imageControls.hidden = !hasImage;
			imageSelectText.textContent = hasImage
				? (imageSelect.dataset.replace ?? "")
				: (imageSelect.dataset.add ?? "");
			if (!hasImage) {
				imageThumbnail.removeAttribute("src");
				imageName.textContent = "";
				return;
			}
			imageThumbnail.src = uploadedImage?.dataUrl ?? "";
			imageName.textContent = file?.name ?? "";
		};
		const syncImageAdjustments = (): void => {
			imageSizeInput.value = String(imageSize);
			imageRadiusInput.value = String(imageRadius);
			imageSizeOutput.value = `${imageSize}%`;
			imageRadiusOutput.value = `${imageRadius}%`;
			imageThumbnail.style.setProperty("--image-preview-radius", `${imageRadius}%`);
			imageBackgroundInput.checked = imageBackgroundEnabled;
			imageBackgroundControls.hidden = !imageBackgroundEnabled;
		};
		const syncImageBackgroundColor = (): void => {
			imageBackgroundText.value = imageBackgroundColor;
			if (/^#[\da-f]{6}$/i.test(imageBackgroundColor)) {
				imageBackgroundPicker.value = imageBackgroundColor;
			}
		};
		syncLinkedImageBackground = () => {
			if (imageBackgroundCustomized) return;
			imageBackgroundColor = options.backgroundColor;
			syncImageBackgroundColor();
		};

		imageInput.addEventListener("click", () => {
			imageInput.value = "";
		});
		imageInput.addEventListener("change", async () => {
			const file = imageInput.files?.[0];
			if (!file) return;
			const request = ++imageRequest;
			setImageError(null);
			try {
				const nextImage = await loadImageFile(file);
				if (request !== imageRequest || root !== initializedRoot) return;
				uploadedImage = nextImage;
				syncImageSelection(file);
				render();
			} catch (caught) {
				if (request !== imageRequest || root !== initializedRoot) return;
				imageInput.value = "";
				setImageError(caught instanceof ImageUploadValidationError ? caught.reason : "decode");
			}
		});
		imageRemove.addEventListener("click", () => {
			imageRequest += 1;
			uploadedImage = null;
			imageSize = 20;
			imageRadius = 0;
			imageBackgroundEnabled = false;
			imageBackgroundCustomized = false;
			imageBackgroundColor = options.backgroundColor;
			imageInput.value = "";
			setImageError(null);
			syncImageBackgroundColor();
			syncImageAdjustments();
			syncImageSelection();
			render();
		});
		imageSizeInput.addEventListener("input", () => {
			imageSize = Number(imageSizeInput.value);
			syncImageAdjustments();
			render();
		});
		imageRadiusInput.addEventListener("input", () => {
			imageRadius = Number(imageRadiusInput.value);
			syncImageAdjustments();
			render();
		});
		imageBackgroundInput.addEventListener("change", () => {
			imageBackgroundEnabled = imageBackgroundInput.checked;
			if (!imageBackgroundCustomized) imageBackgroundColor = options.backgroundColor;
			syncImageBackgroundColor();
			syncImageAdjustments();
			render();
		});
		imageBackgroundPicker.addEventListener("input", () => {
			imageBackgroundCustomized = true;
			imageBackgroundColor = imageBackgroundPicker.value;
			imageBackgroundText.value = imageBackgroundColor;
			render();
		});
		imageBackgroundText.addEventListener("input", () => {
			imageBackgroundCustomized = true;
			imageBackgroundColor = imageBackgroundText.value;
			if (/^#[\da-f]{6}$/i.test(imageBackgroundColor)) {
				imageBackgroundPicker.value = imageBackgroundColor;
			}
			render();
		});
		syncLinkedImageBackground();
		syncImageAdjustments();
	}

	root.querySelector<HTMLButtonElement>('[data-download="png"]')?.addEventListener("click", () => {
		if (!dataURL) return;
		const link = document.createElement("a");
		link.download = `${generateFilename(options.text)}.png`;
		link.href = dataURL;
		link.click();
	});
	root.querySelector<HTMLButtonElement>('[data-download="svg"]')?.addEventListener("click", () => {
		if (!options.text.trim()) return;
		const svg = renderQRToSVG(createQRCode(), getRenderOptions());
		const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
		const link = document.createElement("a");
		link.download = `${generateFilename(options.text)}.svg`;
		link.href = url;
		link.click();
		URL.revokeObjectURL(url);
	});
	render();
};
