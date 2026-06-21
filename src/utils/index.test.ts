import { describe, expect, it } from "vitest";
import { generateFilename, sizeMap } from "./index";

describe("generateFilename", () => {
	it.each([
		["", "qrcode"],
		["   ", "qrcode"],
		["https://www.example.com/path", "example"],
		["https://subdomain.example.co/path", "subdomain"],
		["Hello, QR World!", "hello-qr-world"],
		["--- Multiple   separators ---", "multiple-separators"],
		["🎉", "qrcode"],
	])("turns %j into %j", (input, expected) => {
		expect(generateFilename(input)).toBe(expected);
	});

	it("limits plain-text filenames to 30 characters", () => {
		expect(generateFilename("a".repeat(50))).toBe("a".repeat(30));
	});
});

describe("sizeMap", () => {
	it("maps every size option to its pixel width", () => {
		expect(sizeMap).toEqual({ small: 200, medium: 300, large: 400, xlarge: 500 });
	});
});
