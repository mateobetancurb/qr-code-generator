import { describe, expect, it } from "vitest";
import { getTranslation } from "./getTranslation";

describe("getTranslation", () => {
	it("returns complete English and Spanish translation sets", () => {
		expect(getTranslation("en").generator.title).toBe("Create your QR code");
		expect(getTranslation("es").generator.title).toBe("Crea tu código QR");
		expect(getTranslation("en").trust.items).toHaveLength(3);
		expect(getTranslation("es").trust.items).toHaveLength(3);
		expect(getTranslation("en").faq.items).toHaveLength(3);
		expect(getTranslation("es").faq.items).toHaveLength(3);
	});
});
