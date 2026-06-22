import QRCode from "qrcode";
import type { ModuleStyle, QROptions } from "../interfaces";
import { generateFilename, sizeMap } from "../utils";
import { renderQRToCanvas, renderQRToSVG } from "../utils/qrRenderer";

const selectedClasses = [
	"border-blue-600",
	"bg-blue-50",
	"text-blue-800",
	"dark:border-blue-400",
	"dark:bg-blue-900/40",
	"dark:text-blue-200",
];
const unselectedClasses = [
	"border-gray-200",
	"text-gray-700",
	"hover:border-blue-300",
	"dark:border-gray-700",
	"dark:text-gray-300",
	"dark:hover:border-blue-700",
];

export const initQRGenerator = (): void => {
	const root = document.querySelector<HTMLElement>("[data-qr-generator]");
	if (!root) return;
	const text = root.querySelector<HTMLTextAreaElement>("[data-qr-text]");
	const size = root.querySelector<HTMLSelectElement>("[data-qr-size]");
	const canvas = root.querySelector<HTMLCanvasElement>("[data-qr-canvas]");
	const emptyPreview = root.querySelector<HTMLElement>("[data-empty-preview]");
	const status = root.querySelector<HTMLElement>("[data-qr-status]");
	const error = root.querySelector<HTMLElement>("[data-qr-error]");
	const downloads = root.querySelector<HTMLElement>("[data-downloads]");
	if (!text || !size || !canvas || !emptyPreview || !status || !error || !downloads) return;

	const options: QROptions = {
		text: "",
		size: "medium",
		moduleStyle: "square",
		foregroundColor: "#000000",
		backgroundColor: "#ffffff",
	};
	let dataURL = "";

	const render = (): void => {
		options.text = text.value;
		if (!options.text.trim()) {
			dataURL = "";
			canvas.hidden = true;
			emptyPreview.hidden = false;
			downloads.hidden = true;
			error.hidden = true;
			status.textContent = status.dataset.empty ?? "";
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
				candidate.classList.remove(...(selected ? unselectedClasses : selectedClasses));
				candidate.classList.add(...(selected ? selectedClasses : unselectedClasses));
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
};
