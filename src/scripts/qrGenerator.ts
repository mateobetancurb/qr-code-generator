import QRCode from "qrcode";
import type { ModuleStyle, QROptions } from "../interfaces";
import { generateFilename, sizeMap } from "../utils";
import { renderQRToCanvas, renderQRToSVG } from "../utils/qrRenderer";
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
	const customization = root.querySelector<HTMLDetailsElement>("[data-customization]");
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
	cleanupCurrentRoot = () => desktop.removeEventListener("change", syncCustomization);

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
			const qrCode = QRCode.create(options.text);
			renderQRToCanvas(canvas, qrCode, {
				width: sizeMap[options.size],
				moduleStyle: options.moduleStyle,
				foregroundColor: options.foregroundColor,
				backgroundColor: options.backgroundColor,
			});
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
			render();
		});
		colorText.addEventListener("input", () => {
			options[kind === "foreground" ? "foregroundColor" : "backgroundColor"] = colorText.value;
			if (/^#[\da-f]{6}$/i.test(colorText.value)) picker.value = colorText.value;
			render();
		});
	}
	customization?.addEventListener("toggle", () => {
		if (!desktop.matches) preferredCustomizationOpen = customization.open;
		persist();
	});

	root.querySelector<HTMLButtonElement>('[data-download="png"]')?.addEventListener("click", () => {
		if (!dataURL) return;
		const link = document.createElement("a");
		link.download = `${generateFilename(options.text)}.png`;
		link.href = dataURL;
		link.click();
	});
	root.querySelector<HTMLButtonElement>('[data-download="svg"]')?.addEventListener("click", () => {
		if (!options.text.trim()) return;
		const svg = renderQRToSVG(QRCode.create(options.text), {
			width: sizeMap[options.size],
			moduleStyle: options.moduleStyle,
			foregroundColor: options.foregroundColor,
			backgroundColor: options.backgroundColor,
		});
		const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
		const link = document.createElement("a");
		link.download = `${generateFilename(options.text)}.svg`;
		link.href = url;
		link.click();
		URL.revokeObjectURL(url);
	});
	render();
};
