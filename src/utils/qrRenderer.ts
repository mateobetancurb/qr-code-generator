import type { QRCode as QRCodeData } from "qrcode";
import type { ModuleStyle } from "../interfaces";

const QUIET_ZONE_MODULES = 4;
const DOT_DIAMETER = 1;
const DEFAULT_IMAGE_SIZE = 0.2;
const IMAGE_PAD_GAP = 0.04;

export interface QRImage {
	dataUrl: string;
	source: CanvasImageSource;
	width: number;
	height: number;
}

export interface QRRenderOptions {
	width: number;
	moduleStyle: ModuleStyle;
	foregroundColor: string;
	backgroundColor: string;
	image?: QRImage;
	imageSize?: number;
	imageRadius?: number;
	imageBackgroundColor?: string;
}

const normalizeHexColor = (color: string, fallback: string): string =>
	/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(color) ? color : fallback;

const isFinderModule = (row: number, column: number, size: number): boolean =>
	(row < 7 && column < 7) || (row < 7 && column >= size - 7) || (row >= size - 7 && column < 7);

const getColors = (options: QRRenderOptions) => ({
	foreground: normalizeHexColor(options.foregroundColor, "#000000"),
	background: normalizeHexColor(options.backgroundColor, "#ffffff"),
});

const clamp = (value: number, minimum: number, maximum: number): number =>
	Math.min(Math.max(value, minimum), maximum);

const getImageLayout = (
	width: number,
	image: QRImage,
	imageSize = DEFAULT_IMAGE_SIZE,
	imageRadius = 0,
) => {
	const round = (value: number): number => Number(value.toFixed(4));
	const sizeRatio = clamp(imageSize, 0.1, 0.3);
	const radiusRatio = clamp(imageRadius, 0, 0.5);
	const boxSize = width * sizeRatio;
	const padSize = width * (sizeRatio + IMAGE_PAD_GAP);
	const scale = Math.min(boxSize / image.width, boxSize / image.height);
	const imageWidth = image.width * scale;
	const imageHeight = image.height * scale;

	return {
		imageX: round((width - imageWidth) / 2),
		imageY: round((width - imageHeight) / 2),
		imageWidth: round(imageWidth),
		imageHeight: round(imageHeight),
		imageRadius: round(Math.min(imageWidth, imageHeight) * radiusRatio),
		padX: round((width - padSize) / 2),
		padY: round((width - padSize) / 2),
		padSize: round(padSize),
		padRadius: round(width * 0.02),
	};
};

const escapeAttribute = (value: string): string =>
	value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

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

	if (options.image) {
		const layout = getImageLayout(
			options.width,
			options.image,
			options.imageSize,
			options.imageRadius,
		);
		if (options.imageBackgroundColor !== undefined) {
			context.fillStyle = normalizeHexColor(options.imageBackgroundColor, background);
			context.beginPath();
			context.roundRect(layout.padX, layout.padY, layout.padSize, layout.padSize, layout.padRadius);
			context.fill();
		}
		if (layout.imageRadius) {
			context.save();
			context.beginPath();
			context.roundRect(
				layout.imageX,
				layout.imageY,
				layout.imageWidth,
				layout.imageHeight,
				layout.imageRadius,
			);
			context.clip();
		}
		context.drawImage(
			options.image.source,
			layout.imageX,
			layout.imageY,
			layout.imageWidth,
			layout.imageHeight,
		);
		if (layout.imageRadius) context.restore();
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
	const imageMarkup = options.image
		? (() => {
				const layout = getImageLayout(
					totalModules,
					options.image,
					options.imageSize,
					options.imageRadius,
				);
				const clipPath = layout.imageRadius
					? `<defs><clipPath id="qr-image-clip"><rect x="${layout.imageX}" y="${layout.imageY}" width="${layout.imageWidth}" height="${layout.imageHeight}" rx="${layout.imageRadius}"/></clipPath></defs>`
					: "";
				const clipAttribute = layout.imageRadius ? ' clip-path="url(#qr-image-clip)"' : "";
				const imageBackground =
					options.imageBackgroundColor !== undefined
						? `<rect x="${layout.padX}" y="${layout.padY}" width="${layout.padSize}" height="${layout.padSize}" rx="${layout.padRadius}" fill="${normalizeHexColor(options.imageBackgroundColor, background)}"/>`
						: "";
				return [
					imageBackground,
					clipPath,
					`<image href="${escapeAttribute(options.image.dataUrl)}" x="${layout.imageX}" y="${layout.imageY}" width="${layout.imageWidth}" height="${layout.imageHeight}" preserveAspectRatio="xMidYMid meet"${clipAttribute}/>`,
				].join("");
			})()
		: "";

	return [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.width}" viewBox="0 0 ${totalModules} ${totalModules}" role="img">`,
		`<rect width="${totalModules}" height="${totalModules}" fill="${background}"/>`,
		`<g fill="${foreground}" shape-rendering="crispEdges">${squares.join("")}</g>`,
		dots.length ? `<g fill="${foreground}">${dots.join("")}</g>` : "",
		imageMarkup,
		"</svg>",
	].join("");
};
