import { describe, expect, it, vi } from "vitest";
import { getPreferredTheme, initTheme, resolveTheme } from "./theme";

const renderButton = () => {
	document.body.innerHTML = `<button data-theme-toggle data-dark-label="Dark" data-light-label="Light"><span class="theme-moon"></span><span class="theme-sun hidden"></span></button>`;
	return document.querySelector<HTMLButtonElement>("button")!;
};

describe("initTheme", () => {
	it("reflects and persists theme changes", () => {
		const button = renderButton();
		initTheme();
		expect(button).toHaveAttribute("aria-label", "Dark");

		button.click();
		expect(document.documentElement).toHaveClass("dark");
		expect(button).toHaveAttribute("aria-label", "Light");
		expect(localStorage.getItem("darkMode")).toBe("true");

		button.click();
		expect(document.documentElement).not.toHaveClass("dark");
		expect(localStorage.getItem("darkMode")).toBe("false");
	});

	it("initializes controls from the existing document theme", () => {
		document.documentElement.classList.add("dark");
		const button = renderButton();
		initTheme();
		expect(button.querySelector(".theme-moon")).toHaveClass("hidden");
		expect(button.querySelector(".theme-sun")).not.toHaveClass("hidden");
	});

	it("gives valid saved choices precedence and otherwise uses the system preference", () => {
		expect(resolveTheme("true", false)).toBe(true);
		expect(resolveTheme("false", true)).toBe(false);
		expect(resolveTheme(null, true)).toBe(true);
		expect(resolveTheme("invalid", false)).toBe(false);
	});

	it("applies the saved theme to incoming documents before they are swapped", () => {
		renderButton();
		initTheme();
		const incomingDark = document.implementation.createHTMLDocument();
		localStorage.setItem("darkMode", "true");
		const darkEvent = new Event("astro:before-swap");
		Object.defineProperty(darkEvent, "newDocument", { value: incomingDark });
		document.dispatchEvent(darkEvent);
		expect(incomingDark.documentElement.classList.contains("dark")).toBe(true);

		const incomingLight = document.implementation.createHTMLDocument();
		localStorage.setItem("darkMode", "false");
		const lightEvent = new Event("astro:before-swap");
		Object.defineProperty(lightEvent, "newDocument", { value: incomingLight });
		document.dispatchEvent(lightEvent);
		expect(incomingLight.documentElement.classList.contains("dark")).toBe(false);
	});

	it("falls back to the system preference when storage is unavailable", () => {
		vi.spyOn(localStorage, "getItem").mockImplementation(() => {
			throw new DOMException("blocked");
		});
		expect(getPreferredTheme()).toBe(false);
	});
});
