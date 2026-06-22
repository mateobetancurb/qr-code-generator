import type { ModuleStyle, QROptions } from "../interfaces";

type QRSize = QROptions["size"];

const STORAGE_KEY = "qr-generator-state";
const HEX_COLOR = /^#[\da-f]{6}$/i;
const sizes = new Set<QRSize>(["small", "medium", "large", "xlarge"]);
const moduleStyles = new Set<ModuleStyle>(["square", "dots"]);

export interface QRGeneratorState extends QROptions {
	version: 1;
	customizationOpen: boolean;
}

const isQRGeneratorState = (value: unknown): value is QRGeneratorState => {
	if (!value || typeof value !== "object") return false;
	const state = value as Record<string, unknown>;
	return (
		state.version === 1 &&
		typeof state.text === "string" &&
		typeof state.size === "string" &&
		sizes.has(state.size as QRSize) &&
		typeof state.moduleStyle === "string" &&
		moduleStyles.has(state.moduleStyle as ModuleStyle) &&
		typeof state.foregroundColor === "string" &&
		HEX_COLOR.test(state.foregroundColor) &&
		typeof state.backgroundColor === "string" &&
		HEX_COLOR.test(state.backgroundColor) &&
		typeof state.customizationOpen === "boolean"
	);
};

export const readQRGeneratorState = (): QRGeneratorState | null => {
	try {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (!stored) return null;
		const state: unknown = JSON.parse(stored);
		return isQRGeneratorState(state) ? state : null;
	} catch {
		return null;
	}
};

export const writeQRGeneratorState = (state: QRGeneratorState): void => {
	if (!isQRGeneratorState(state)) return;
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// Persistence is optional; the generator remains usable without storage.
	}
};
