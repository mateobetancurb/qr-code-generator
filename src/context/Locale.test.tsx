import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { LocaleProvider, useLocale } from "./Locale";

const wrapper = ({ children }: { children: ReactNode }) => (
	<LocaleProvider>{children}</LocaleProvider>
);

const addDescriptionMeta = () => {
	const meta = document.createElement("meta");
	meta.name = "description";
	document.head.append(meta);
	return meta;
};

describe("LocaleProvider", () => {
	it("restores a locale and updates document metadata", async () => {
		localStorage.setItem("locale", "es");
		const meta = addDescriptionMeta();
		const { result } = renderHook(() => useLocale(), { wrapper });

		expect(result.current.locale).toBe("es");
		await waitFor(() => expect(document.documentElement).toHaveAttribute("lang", "es"));
		expect(document.title).toBe(result.current.t.meta.title);
		expect(meta).toHaveAttribute("content", result.current.t.meta.description);

		act(() => result.current.setLocale("en"));

		expect(result.current.locale).toBe("en");
		expect(localStorage.getItem("locale")).toBe("en");
	});

	it("detects Spanish browsers and defaults other languages to English", () => {
		vi.spyOn(window.navigator, "language", "get").mockReturnValue("es-CO");
		const spanish = renderHook(() => useLocale(), { wrapper });
		expect(spanish.result.current.locale).toBe("es");
		spanish.unmount();

		vi.spyOn(window.navigator, "language", "get").mockReturnValue("fr-FR");
		const english = renderHook(() => useLocale(), { wrapper });
		expect(english.result.current.locale).toBe("en");
	});

	it("ignores invalid stored locale values", () => {
		localStorage.setItem("locale", "invalid");
		vi.spyOn(window.navigator, "language", "get").mockReturnValue("en-US");

		const { result } = renderHook(() => useLocale(), { wrapper });
		expect(result.current.locale).toBe("en");
	});

	it("rejects use outside its provider", () => {
		vi.spyOn(console, "error").mockImplementation(() => undefined);
		expect(() => renderHook(() => useLocale())).toThrow(
			"useLocale must be used within a LocaleProvider",
		);
	});
});
