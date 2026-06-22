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

const image = {
	dataUrl: "data:image/png;base64,dGVzdA==",
	source: document.createElement("img"),
	width: 200,
	height: 100,
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

	it("embeds only the centered, aspect-ratio-preserving image", () => {
		const svg = renderQRToSVG(createQR([[10, 10]]), { ...options, image });

		expect(svg).toContain(
			'<image href="data:image/png;base64,dGVzdA==" x="11.6" y="13.05" width="5.8" height="2.9" preserveAspectRatio="xMidYMid meet"/>',
		);
		expect(svg.match(/<rect/g)).toHaveLength(2);
	});

	it("scales and rounds an SVG image using safe option limits", () => {
		const svg = renderQRToSVG(createQR([[10, 10]]), {
			...options,
			image,
			imageSize: 0.3,
			imageRadius: 0.5,
		});

		expect(svg).toContain(
			'<clipPath id="qr-image-clip"><rect x="10.15" y="12.325" width="8.7" height="4.35" rx="2.175"/></clipPath>',
		);
		expect(svg).toContain('clip-path="url(#qr-image-clip)"');
	});

	it("adds an optional image background using its custom color", () => {
		const svg = renderQRToSVG(createQR([[10, 10]]), {
			...options,
			image,
			imageBackgroundColor: "#fedcba",
		});

		expect(svg).toContain(
			'<rect x="11.02" y="11.02" width="6.96" height="6.96" rx="0.58" fill="#fedcba"/>',
		);
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

	it("draws only the uploaded image", () => {
		const context = {
			clearRect: vi.fn(),
			fillRect: vi.fn(),
			beginPath: vi.fn(),
			arc: vi.fn(),
			fill: vi.fn(),
			roundRect: vi.fn(),
			drawImage: vi.fn(),
			fillStyle: "",
		} as unknown as CanvasRenderingContext2D;
		const canvas = document.createElement("canvas");
		vi.spyOn(canvas, "getContext").mockReturnValue(context);

		renderQRToCanvas(canvas, createQR([[10, 10]]), { ...options, image });

		expect(context.roundRect).not.toHaveBeenCalled();
		expect(context.fill).not.toHaveBeenCalled();
		expect(context.drawImage).toHaveBeenCalledWith(image.source, 116, 130.5, 58, 29);
	});

	it("clips a resized canvas image to the selected corner radius", () => {
		const context = {
			clearRect: vi.fn(),
			fillRect: vi.fn(),
			beginPath: vi.fn(),
			arc: vi.fn(),
			fill: vi.fn(),
			roundRect: vi.fn(),
			drawImage: vi.fn(),
			save: vi.fn(),
			clip: vi.fn(),
			restore: vi.fn(),
			fillStyle: "",
		} as unknown as CanvasRenderingContext2D;
		const canvas = document.createElement("canvas");
		vi.spyOn(canvas, "getContext").mockReturnValue(context);

		renderQRToCanvas(canvas, createQR([[10, 10]]), {
			...options,
			image,
			imageSize: 0.3,
			imageRadius: 0.5,
		});

		expect(context.roundRect).toHaveBeenLastCalledWith(101.5, 123.25, 87, 43.5, 21.75);
		expect(context.clip).toHaveBeenCalledOnce();
		expect(context.drawImage).toHaveBeenCalledWith(image.source, 101.5, 123.25, 87, 43.5);
		expect(context.restore).toHaveBeenCalledOnce();
	});

	it("draws an optional custom-colored background behind the canvas image", () => {
		const context = {
			clearRect: vi.fn(),
			fillRect: vi.fn(),
			beginPath: vi.fn(),
			arc: vi.fn(),
			fill: vi.fn(),
			roundRect: vi.fn(),
			drawImage: vi.fn(),
			fillStyle: "",
		} as unknown as CanvasRenderingContext2D;
		const canvas = document.createElement("canvas");
		vi.spyOn(canvas, "getContext").mockReturnValue(context);

		renderQRToCanvas(canvas, createQR([[10, 10]]), {
			...options,
			image,
			imageBackgroundColor: "#fedcba",
		});

		expect(context.roundRect).toHaveBeenCalledWith(110.2, 110.2, 69.6, 69.6, 5.8);
		expect(context.fill).toHaveBeenCalledOnce();
		expect(context.fillStyle).toBe("#fedcba");
	});
});
