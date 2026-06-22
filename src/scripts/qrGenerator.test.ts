import QRCode from "qrcode";
import { describe, expect, it, vi } from "vitest";
import * as renderer from "../utils/qrRenderer";
import { ImageUploadValidationError, loadImageFile } from "../utils/imageUpload";
import { initQRGenerator } from "./qrGenerator";

vi.mock("../utils/imageUpload", async (importOriginal) => ({
	...(await importOriginal<typeof import("../utils/imageUpload")>()),
	loadImageFile: vi.fn(),
}));

const renderGenerator = () => {
	document.body.innerHTML = `<section data-qr-generator>
		<textarea data-qr-text></textarea><select data-qr-size><option value="medium">Medium</option><option value="large">Large</option></select>
		<button data-module-style="square" aria-pressed="true"></button><button data-module-style="dots" aria-pressed="false"></button>
		<input data-color-picker="foreground" value="#000000"><input data-color-text="foreground" value="#000000">
		<input data-color-picker="background" value="#ffffff"><input data-color-text="background" value="#ffffff">
		<label data-image-select data-add="Choose" data-replace="Replace"><span>Choose</span><input data-qr-image type="file"></label>
		<div data-image-selection hidden><img data-image-thumbnail><span data-image-name></span><button data-image-remove></button></div>
		<div data-image-controls hidden><input data-image-size type="range" value="20"><output data-image-size-output></output><input data-image-radius type="range" value="0"><output data-image-radius-output></output><input data-image-background type="checkbox"><div data-image-background-controls hidden><input data-image-background-picker value="#ffffff"><input data-image-background-text value="#ffffff"></div></div>
		<p data-image-error data-type="Type error" data-size="Size error" data-decode="Decode error" hidden></p>
		<canvas data-qr-canvas hidden></canvas><div data-empty-preview></div><details data-customization></details>
		<p data-qr-status data-empty="Empty" data-ready="Ready"></p><p data-qr-error hidden>Error</p><div data-downloads hidden><button data-download="png"></button><button data-download="svg"></button></div>
	</section>`;
	initQRGenerator();
	return {
		text: document.querySelector<HTMLTextAreaElement>("[data-qr-text]")!,
		size: document.querySelector<HTMLSelectElement>("[data-qr-size]")!,
		canvas: document.querySelector<HTMLCanvasElement>("canvas")!,
		downloads: document.querySelector<HTMLElement>("[data-downloads]")!,
		imageInput: document.querySelector<HTMLInputElement>("[data-qr-image]")!,
	};
};

const input = (element: HTMLInputElement | HTMLTextAreaElement, value: string) => {
	element.value = value;
	element.dispatchEvent(new Event("input", { bubbles: true }));
};

const selectFile = (input: HTMLInputElement, file: File) => {
	Object.defineProperty(input, "files", { configurable: true, value: [file] });
	input.dispatchEvent(new Event("change", { bubbles: true }));
};

const uploadedImage = {
	dataUrl: "data:image/png;base64,bG9nbw==",
	source: document.createElement("img"),
	width: 120,
	height: 60,
};

describe("initQRGenerator", () => {
	it("generates, customizes, clears, and reports status", () => {
		const view = renderGenerator();
		input(view.text, "https://example.com");
		expect(view.canvas).not.toHaveAttribute("hidden");
		expect(view.downloads).not.toHaveAttribute("hidden");
		expect(document.querySelector("[data-qr-status]")).toHaveTextContent("Ready");

		view.size.value = "large";
		view.size.dispatchEvent(new Event("change"));
		expect(view.canvas.width).toBe(400);
		document.querySelector<HTMLButtonElement>('[data-module-style="dots"]')?.click();
		expect(document.querySelector('[data-module-style="dots"]')).toHaveAttribute(
			"aria-pressed",
			"true",
		);

		input(document.querySelector<HTMLInputElement>('[data-color-text="foreground"]')!, "#123456");
		expect(document.querySelector('[data-color-picker="foreground"]')).toHaveValue("#123456");
		input(view.text, "");
		expect(view.downloads).toHaveAttribute("hidden");
		expect(document.querySelector("[data-qr-status]")).toHaveTextContent("Empty");
	});

	it("downloads PNG and SVG with content-derived names", () => {
		const click = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => undefined);
		const view = renderGenerator();
		input(view.text, "https://example.com/path");
		document.querySelector<HTMLButtonElement>('[data-download="png"]')?.click();
		document.querySelector<HTMLButtonElement>('[data-download="svg"]')?.click();
		expect(click).toHaveBeenCalledTimes(2);
		expect(URL.createObjectURL).toHaveBeenCalledOnce();
		expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
	});

	it("shows generation failures and safely handles absent markup", () => {
		vi.spyOn(console, "error").mockImplementation(() => undefined);
		vi.spyOn(renderer, "renderQRToCanvas").mockImplementation(() => {
			throw new Error("failed");
		});
		const view = renderGenerator();
		input(view.text, "test");
		expect(document.querySelector("[data-qr-error]")).not.toHaveAttribute("hidden");
		expect(view.downloads).toHaveAttribute("hidden");
		document.body.replaceChildren();
		expect(() => initQRGenerator()).not.toThrow();
	});

	it("keeps customization collapsed on mobile", () => {
		renderGenerator();
		expect(document.querySelector("[data-customization]")).not.toHaveAttribute("open");
	});

	it("restores persisted controls and generated preview", () => {
		sessionStorage.setItem(
			"qr-generator-state",
			JSON.stringify({
				version: 1,
				text: "QR persistido",
				size: "large",
				moduleStyle: "dots",
				foregroundColor: "#123456",
				backgroundColor: "#fefefe",
				customizationOpen: true,
			}),
		);
		const view = renderGenerator();

		expect(view.text).toHaveValue("QR persistido");
		expect(view.size).toHaveValue("large");
		expect(document.querySelector('[data-module-style="dots"]')).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(document.querySelector('[data-color-text="foreground"]')).toHaveValue("#123456");
		expect(document.querySelector('[data-color-text="background"]')).toHaveValue("#fefefe");
		expect(document.querySelector("[data-customization]")).toHaveAttribute("open");
		expect(view.canvas).not.toHaveAttribute("hidden");
	});

	it("does not attach duplicate listeners to the same document", () => {
		const view = renderGenerator();
		const renderCanvas = vi.spyOn(renderer, "renderQRToCanvas");
		initQRGenerator();
		renderCanvas.mockClear();

		input(view.text, "single update");
		expect(renderCanvas).toHaveBeenCalledOnce();
	});

	it("adds a valid image with high error correction and removes it", async () => {
		vi.mocked(loadImageFile).mockResolvedValue(uploadedImage);
		const create = vi.spyOn(QRCode, "create");
		const renderCanvas = vi.spyOn(renderer, "renderQRToCanvas");
		const renderSVG = vi.spyOn(renderer, "renderQRToSVG");
		const view = renderGenerator();
		input(view.text, "with logo");
		selectFile(view.imageInput, new File(["logo"], "brand.png", { type: "image/png" }));

		await vi.waitFor(() =>
			expect(renderCanvas).toHaveBeenLastCalledWith(
				view.canvas,
				expect.anything(),
				expect.objectContaining({ image: uploadedImage }),
			),
		);
		expect(create).toHaveBeenLastCalledWith("with logo", { errorCorrectionLevel: "H" });
		expect(document.querySelector("[data-image-selection]")).not.toHaveAttribute("hidden");
		expect(document.querySelector("[data-image-name]")).toHaveTextContent("brand.png");
		expect(sessionStorage.getItem("qr-generator-state")).not.toContain(uploadedImage.dataUrl);
		expect(renderCanvas).toHaveBeenLastCalledWith(
			view.canvas,
			expect.anything(),
			expect.not.objectContaining({ imageBackgroundColor: expect.anything() }),
		);
		input(document.querySelector<HTMLInputElement>("[data-image-size]")!, "30");
		input(document.querySelector<HTMLInputElement>("[data-image-radius]")!, "50");
		const imageBackground = document.querySelector<HTMLInputElement>("[data-image-background]")!;
		imageBackground.checked = true;
		imageBackground.dispatchEvent(new Event("change", { bubbles: true }));
		expect(renderCanvas).toHaveBeenLastCalledWith(
			view.canvas,
			expect.anything(),
			expect.objectContaining({ imageBackgroundColor: "#ffffff" }),
		);
		input(document.querySelector<HTMLInputElement>('[data-color-text="background"]')!, "#abcdef");
		expect(document.querySelector("[data-image-background-text]")).toHaveValue("#abcdef");
		input(document.querySelector<HTMLInputElement>("[data-image-background-text]")!, "#fedcba");
		input(document.querySelector<HTMLInputElement>('[data-color-text="background"]')!, "#123456");
		expect(renderCanvas).toHaveBeenLastCalledWith(
			view.canvas,
			expect.anything(),
			expect.objectContaining({
				imageSize: 0.3,
				imageRadius: 0.5,
				imageBackgroundColor: "#fedcba",
			}),
		);
		expect(document.querySelector("[data-image-size-output]")).toHaveTextContent("30%");
		expect(document.querySelector("[data-image-radius-output]")).toHaveTextContent("50%");
		expect(document.querySelector<HTMLImageElement>("[data-image-thumbnail]")).toHaveStyle({
			"--image-preview-radius": "50%",
		});
		document.querySelector<HTMLButtonElement>('[data-download="svg"]')?.click();
		expect(renderSVG).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({ image: uploadedImage }),
		);

		document.querySelector<HTMLButtonElement>("[data-image-remove]")?.click();
		expect(renderCanvas).toHaveBeenLastCalledWith(
			view.canvas,
			expect.anything(),
			expect.not.objectContaining({ image: expect.anything() }),
		);
		expect(document.querySelector("[data-image-selection]")).toHaveAttribute("hidden");
		expect(document.querySelector("[data-image-controls]")).toHaveAttribute("hidden");
		expect(document.querySelector("[data-image-size]")).toHaveValue("20");
		expect(document.querySelector("[data-image-radius]")).toHaveValue("0");
		expect(document.querySelector("[data-image-background]")).not.toBeChecked();
		expect(document.querySelector("[data-image-background-text]")).toHaveValue("#123456");
	});

	it("keeps the previous image when a replacement fails validation", async () => {
		vi.mocked(loadImageFile)
			.mockResolvedValueOnce(uploadedImage)
			.mockRejectedValueOnce(new ImageUploadValidationError("type"));
		const renderCanvas = vi.spyOn(renderer, "renderQRToCanvas");
		const view = renderGenerator();
		input(view.text, "with logo");
		selectFile(view.imageInput, new File(["logo"], "brand.png", { type: "image/png" }));
		await vi.waitFor(() => expect(renderCanvas).toHaveBeenCalledTimes(2));

		selectFile(view.imageInput, new File(["bad"], "brand.svg", { type: "image/svg+xml" }));
		await vi.waitFor(() =>
			expect(document.querySelector("[data-image-error]")).toHaveTextContent("Type error"),
		);
		expect(document.querySelector("[data-image-selection]")).not.toHaveAttribute("hidden");
		expect(document.querySelector("[data-image-name]")).toHaveTextContent("brand.png");
	});

	it.each([
		["size", "Size error"],
		["decode", "Decode error"],
	] as const)("reports %s upload errors", async (reason, message) => {
		vi.mocked(loadImageFile).mockRejectedValue(new ImageUploadValidationError(reason));
		const view = renderGenerator();
		selectFile(view.imageInput, new File(["image"], "brand.png", { type: "image/png" }));

		await vi.waitFor(() =>
			expect(document.querySelector("[data-image-error]")).toHaveTextContent(message),
		);
	});

	it("ignores an older upload that finishes after its replacement", async () => {
		let finishFirst: ((image: typeof uploadedImage) => void) | undefined;
		const firstUpload = new Promise<typeof uploadedImage>((resolve) => {
			finishFirst = resolve;
		});
		const replacement = { ...uploadedImage, dataUrl: "data:image/png;base64,bmV3" };
		vi.mocked(loadImageFile).mockReturnValueOnce(firstUpload).mockResolvedValueOnce(replacement);
		const view = renderGenerator();
		selectFile(view.imageInput, new File(["old"], "old.png", { type: "image/png" }));
		selectFile(view.imageInput, new File(["new"], "new.png", { type: "image/png" }));

		await vi.waitFor(() =>
			expect(document.querySelector("[data-image-name]")).toHaveTextContent("new.png"),
		);
		finishFirst?.(uploadedImage);
		await firstUpload;
		expect(document.querySelector("[data-image-name]")).toHaveTextContent("new.png");
		expect(document.querySelector<HTMLImageElement>("[data-image-thumbnail]")?.src).toContain(
			"data:image/png;base64,bmV3",
		);
	});
});
