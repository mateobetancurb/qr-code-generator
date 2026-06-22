import { describe, expect, it, vi } from "vitest";
import { initLanguageNavigation } from "./languageNavigation";

describe("language navigation", () => {
	it("restores scroll after a plain language-switch navigation", () => {
		document.body.innerHTML = '<a data-language-link href="/es/">ES</a>';
		document.querySelector("a")?.addEventListener("click", (event) => event.preventDefault());
		Object.defineProperty(window, "scrollX", { configurable: true, value: 12 });
		Object.defineProperty(window, "scrollY", { configurable: true, value: 480 });
		const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
		initLanguageNavigation();

		document
			.querySelector<HTMLAnchorElement>("a")
			?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
		document.dispatchEvent(new Event("astro:after-swap"));
		expect(scrollTo).toHaveBeenCalledWith({ left: 12, top: 480, behavior: "instant" });

		scrollTo.mockClear();
		document
			.querySelector<HTMLAnchorElement>("a")
			?.dispatchEvent(
				new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ctrlKey: true }),
			);
		document.dispatchEvent(new Event("astro:after-swap"));
		expect(scrollTo).not.toHaveBeenCalled();
	});
});
