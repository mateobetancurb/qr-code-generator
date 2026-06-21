import { describe, expect, it } from "vitest";
import { getTranslation } from "./getTranslation";

describe("getTranslation", () => {
	it("returns complete English and Spanish translation sets", () => {
		expect(getTranslation("en").generator.title).toBe("QR Code Generator");
		expect(getTranslation("es").generator.title).toBe("Generador de códigos QR");
		expect(getTranslation("en").features.cards).toHaveLength(6);
		expect(getTranslation("es").features.cards).toHaveLength(6);
	});
});
