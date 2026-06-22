import { describe, expect, it, vi } from "vitest";
import * as renderer from "../utils/qrRenderer";
import { initQRGenerator } from "./qrGenerator";

const renderGenerator = () => {
	document.body.innerHTML = `<section data-qr-generator>
		<textarea data-qr-text></textarea><select data-qr-size><option value="medium">Medium</option><option value="large">Large</option></select>
		<button data-module-style="square" aria-pressed="true"></button><button data-module-style="dots" aria-pressed="false"></button>
		<input data-color-picker="foreground" value="#000000"><input data-color-text="foreground" value="#000000">
		<input data-color-picker="background" value="#ffffff"><input data-color-text="background" value="#ffffff">
		<canvas data-qr-canvas hidden></canvas><div data-empty-preview></div><details data-customization></details>
		<p data-qr-status data-empty="Empty" data-ready="Ready"></p><p data-qr-error hidden>Error</p><div data-downloads hidden><button data-download="png"></button><button data-download="svg"></button></div>
	</section>`;
	initQRGenerator();
	return {
		text: document.querySelector<HTMLTextAreaElement>("[data-qr-text]")!,
		size: document.querySelector<HTMLSelectElement>("[data-qr-size]")!,
		canvas: document.querySelector<HTMLCanvasElement>("canvas")!,
		downloads: document.querySelector<HTMLElement>("[data-downloads]")!,
	};
};

const input = (element: HTMLInputElement | HTMLTextAreaElement, value: string) => {
	element.value = value;
	element.dispatchEvent(new Event("input", { bubbles: true }));
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
});
