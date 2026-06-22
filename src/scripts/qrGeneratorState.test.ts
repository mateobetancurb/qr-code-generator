import { describe, expect, it, vi } from "vitest";
import { readQRGeneratorState, writeQRGeneratorState } from "./qrGeneratorState";

const state = {
	version: 1 as const,
	text: "https://example.com",
	size: "large" as const,
	moduleStyle: "dots" as const,
	foregroundColor: "#123456",
	backgroundColor: "#fefefe",
	customizationOpen: true,
};

describe("QR generator state", () => {
	it("round-trips valid session state", () => {
		writeQRGeneratorState(state);
		expect(readQRGeneratorState()).toEqual(state);
	});

	it("rejects malformed, unsupported, and invalid state", () => {
		for (const value of [
			"not json",
			JSON.stringify({ ...state, version: 2 }),
			JSON.stringify({ ...state, size: "huge" }),
			JSON.stringify({ ...state, foregroundColor: "red" }),
		]) {
			sessionStorage.setItem("qr-generator-state", value);
			expect(readQRGeneratorState()).toBeNull();
		}
	});

	it("continues when storage is unavailable", () => {
		vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
			throw new DOMException("blocked");
		});
		expect(readQRGeneratorState()).toBeNull();

		vi.restoreAllMocks();
		vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new DOMException("blocked");
		});
		expect(() => writeQRGeneratorState(state)).not.toThrow();
	});
});
