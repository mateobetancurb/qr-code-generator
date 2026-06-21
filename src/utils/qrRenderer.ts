import type { QRCode as QRCodeData } from "qrcode";
import type { ModuleStyle } from "../interfaces";

const QUIET_ZONE_MODULES = 4;
const DOT_DIAMETER = 0.8;

export interface QRRenderOptions {
	width: number;
	moduleStyle: ModuleStyle;
	foregroundColor: string;
	backgroundColor: string;
}

const normalizeHexColor = (color: string, fallback: string): string =>
	/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(color) ? color : fallback;

const isFinderModule = (row: number, column: number, size: number): boolean =>
	(row < 7 && column < 7) || (row < 7 && column >= size - 7) || (row >= size - 7 && column < 7);

const getColors = (options: QRRenderOptions) => ({
	foreground: normalizeHexColor(options.foregroundColor, "#000000"),
	background: normalizeHexColor(options.backgroundColor, "#ffffff"),
});

export const renderQRToCanvas = (
	canvas: HTMLCanvasElement,
	qrCode: QRCodeData,
	options: QRRenderOptions,
): void => {
	const context = canvas.getContext("2d");
	if (!context) throw new Error("Canvas rendering is not supported in this browser");

	const moduleCount = qrCode.modules.size;
	const totalModules = moduleCount + QUIET_ZONE_MODULES * 2;
	const moduleSize = options.width / totalModules;
	const { foreground, background } = getColors(options);

	canvas.width = options.width;
	canvas.height = options.width;
	canvas.style.width = `${options.width}px`;
	canvas.style.height = `${options.width}px`;

	context.clearRect(0, 0, options.width, options.width);
	context.fillStyle = background;
	context.fillRect(0, 0, options.width, options.width);
	context.fillStyle = foreground;

	for (let row = 0; row < moduleCount; row += 1) {
		for (let column = 0; column < moduleCount; column += 1) {
			if (!qrCode.modules.get(row, column)) continue;

			const x = (column + QUIET_ZONE_MODULES) * moduleSize;
			const y = (row + QUIET_ZONE_MODULES) * moduleSize;
			const useDot = options.moduleStyle === "dots" && !isFinderModule(row, column, moduleCount);

			if (useDot) {
				context.beginPath();
				context.arc(
					x + moduleSize / 2,
					y + moduleSize / 2,
					(moduleSize * DOT_DIAMETER) / 2,
					0,
					2 * Math.PI,
				);
				context.fill();
			} else {
				context.fillRect(x, y, moduleSize, moduleSize);
			}
		}
	}
};

export const renderQRToSVG = (qrCode: QRCodeData, options: QRRenderOptions): string => {
	const moduleCount = qrCode.modules.size;
	const totalModules = moduleCount + QUIET_ZONE_MODULES * 2;
	const { foreground, background } = getColors(options);
	const squares: string[] = [];
	const dots: string[] = [];

	for (let row = 0; row < moduleCount; row += 1) {
		for (let column = 0; column < moduleCount; column += 1) {
			if (!qrCode.modules.get(row, column)) continue;

			const x = column + QUIET_ZONE_MODULES;
			const y = row + QUIET_ZONE_MODULES;
			const useDot = options.moduleStyle === "dots" && !isFinderModule(row, column, moduleCount);

			if (useDot) {
				dots.push(`<circle cx="${x + 0.5}" cy="${y + 0.5}" r="${DOT_DIAMETER / 2}"/>`);
			} else {
				squares.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
			}
		}
	}

	return [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.width}" viewBox="0 0 ${totalModules} ${totalModules}" role="img">`,
		`<rect width="${totalModules}" height="${totalModules}" fill="${background}"/>`,
		`<g fill="${foreground}" shape-rendering="crispEdges">${squares.join("")}</g>`,
		dots.length ? `<g fill="${foreground}">${dots.join("")}</g>` : "",
		"</svg>",
	].join("");
};
