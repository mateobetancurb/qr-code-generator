import { renderHook, waitFor } from "@testing-library/react";
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
	it("uses the Spanish URL and updates document metadata", async () => {
		window.history.replaceState({}, "", "/es/");
		const meta = addDescriptionMeta();
		const { result } = renderHook(() => useLocale(), { wrapper });

		expect(result.current.locale).toBe("es");
		await waitFor(() => expect(document.documentElement).toHaveAttribute("lang", "es"));
		expect(document.title).toBe(result.current.t.meta.title);
		expect(meta).toHaveAttribute("content", result.current.t.meta.description);
	});

	it("keeps the root URL in English regardless of browser or stored preference", () => {
		localStorage.setItem("locale", "es");
		vi.spyOn(window.navigator, "language", "get").mockReturnValue("es-CO");
		const english = renderHook(() => useLocale(), { wrapper });
		expect(english.result.current.locale).toBe("en");
	});

	it("recognizes Spanish routes below the locale prefix", () => {
		window.history.replaceState({}, "", "/es/ayuda");
		const { result } = renderHook(() => useLocale(), { wrapper });
		expect(result.current.locale).toBe("es");
	});

	it("rejects use outside its provider", () => {
		vi.spyOn(console, "error").mockImplementation(() => undefined);
		expect(() => renderHook(() => useLocale())).toThrow(
			"useLocale must be used within a LocaleProvider",
		);
	});
});
