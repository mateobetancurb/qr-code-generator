import { describe, expect, it } from "vitest";
import { initTheme } from "./theme";

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
});
