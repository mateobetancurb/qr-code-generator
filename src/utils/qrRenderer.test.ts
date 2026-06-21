import type { QRCode as QRCodeData } from "qrcode";
import { describe, expect, it, vi } from "vitest";
import { renderQRToCanvas, renderQRToSVG } from "./qrRenderer";

const createQR = (activeModules: Array<[number, number]>, size = 21): QRCodeData => {
	const active = new Set(activeModules.map(([row, column]) => `${row}:${column}`));
	return {
		modules: {
			size,
			get: (row: number, column: number) => active.has(`${row}:${column}`),
		},
	} as unknown as QRCodeData;
};

const options = {
	width: 290,
	moduleStyle: "square" as const,
	foregroundColor: "#123456",
	backgroundColor: "#abcdef",
};

describe("renderQRToSVG", () => {
	it("renders dimensions, colors, modules, and a four-module quiet zone", () => {
		const svg = renderQRToSVG(createQR([[0, 0]]), options);

		expect(svg).toContain('width="290" height="290"');
		expect(svg).toContain('viewBox="0 0 29 29"');
		expect(svg).toContain('<rect width="29" height="29" fill="#abcdef"/>');
		expect(svg).toContain('<g fill="#123456"');
		expect(svg).toContain('<rect x="4" y="4" width="1" height="1"/>');
	});

	it("uses dots outside finder patterns while keeping finder modules square", () => {
		const svg = renderQRToSVG(
			createQR([
				[0, 0],
				[10, 10],
			]),
			{
				...options,
				moduleStyle: "dots",
			},
		);

		expect(svg).toContain('<rect x="4" y="4" width="1" height="1"/>');
		expect(svg).toContain('<circle cx="14.5" cy="14.5" r="0.5"/>');
	});

	it("falls back to safe colors when input colors are invalid", () => {
		const svg = renderQRToSVG(createQR([[10, 10]]), {
			...options,
			foregroundColor: "black",
			backgroundColor: "transparent",
		});

		expect(svg).toContain('fill="#000000"');
		expect(svg).toContain('fill="#ffffff"');
	});
});

describe("renderQRToCanvas", () => {
	it("sizes and paints a square canvas", () => {
		const fillRect = vi.fn();
		const context = {
			clearRect: vi.fn(),
			fillRect,
			beginPath: vi.fn(),
			arc: vi.fn(),
			fill: vi.fn(),
			fillStyle: "",
		} as unknown as CanvasRenderingContext2D;
		const canvas = document.createElement("canvas");
		vi.spyOn(canvas, "getContext").mockReturnValue(context);

		renderQRToCanvas(canvas, createQR([[0, 0]]), options);

		expect(canvas.width).toBe(290);
		expect(canvas.height).toBe(290);
		expect(canvas.style.width).toBe("290px");
		expect(fillRect).toHaveBeenNthCalledWith(1, 0, 0, 290, 290);
		expect(fillRect).toHaveBeenNthCalledWith(2, 40, 40, 10, 10);
	});

	it("draws non-finder modules as dots", () => {
		const context = {
			clearRect: vi.fn(),
			fillRect: vi.fn(),
			beginPath: vi.fn(),
			arc: vi.fn(),
			fill: vi.fn(),
			fillStyle: "",
		} as unknown as CanvasRenderingContext2D;
		const canvas = document.createElement("canvas");
		vi.spyOn(canvas, "getContext").mockReturnValue(context);

		renderQRToCanvas(canvas, createQR([[10, 10]]), { ...options, moduleStyle: "dots" });

		expect(context.beginPath).toHaveBeenCalledOnce();
		expect(context.arc).toHaveBeenCalledWith(145, 145, 5, 0, 2 * Math.PI);
		expect(context.fill).toHaveBeenCalledOnce();
	});

	it("fails clearly when canvas rendering is unavailable", () => {
		const canvas = document.createElement("canvas");
		vi.spyOn(canvas, "getContext").mockReturnValue(null);

		expect(() => renderQRToCanvas(canvas, createQR([]), options)).toThrow(
			"Canvas rendering is not supported",
		);
	});
});
