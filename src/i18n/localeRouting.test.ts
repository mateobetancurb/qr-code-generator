import { describe, expect, it } from "vitest";
import { getLocaleFromPathname, localePath } from "./localeRouting";

describe("locale routing", () => {
	it("maps canonical locale paths", () => {
		expect(localePath).toEqual({ en: "/", es: "/es/" });
	});

	it("derives Spanish only from the Spanish path segment", () => {
		expect(getLocaleFromPathname("/es")).toBe("es");
		expect(getLocaleFromPathname("/es/")).toBe("es");
		expect(getLocaleFromPathname("/es/ayuda")).toBe("es");
		expect(getLocaleFromPathname("/essential")).toBe("en");
		expect(getLocaleFromPathname("/")).toBe("en");
	});
});
