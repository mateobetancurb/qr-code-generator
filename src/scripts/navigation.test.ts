import { describe, expect, it, vi } from "vitest";
import { initNavigation } from "./navigation";

const renderNavigation = () => {
	document.body.innerHTML = `<button data-menu-toggle aria-expanded="false" data-open-label="Open" data-close-label="Close"><span class="menu-open-icon"></span><span class="menu-close-icon hidden"></span></button><div data-mobile-navigation hidden><a href="#target">Target</a></div>`;
	return {
		button: document.querySelector<HTMLButtonElement>("button")!,
		navigation: document.querySelector<HTMLElement>("[data-mobile-navigation]")!,
	};
};

describe("initNavigation", () => {
	it("opens, closes, and restores focus with Escape", () => {
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
			callback(0);
			return 1;
		});
		const { button, navigation } = renderNavigation();
		initNavigation();
		button.click();
		expect(button).toHaveAttribute("aria-expanded", "true");
		expect(button).toHaveAttribute("aria-label", "Close");
		expect(navigation).not.toHaveAttribute("hidden");

		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
		expect(navigation).toHaveAttribute("hidden");
		expect(button).toHaveFocus();
	});

	it("closes after navigation and safely handles absent markup", () => {
		const { button, navigation } = renderNavigation();
		initNavigation();
		button.click();
		navigation.querySelector("a")?.click();
		expect(button).toHaveAttribute("aria-expanded", "false");
		document.body.replaceChildren();
		expect(() => initNavigation()).not.toThrow();
	});
});
