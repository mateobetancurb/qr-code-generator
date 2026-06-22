import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const locale of [
	{ path: "/", name: "English" },
	{ path: "/es/", name: "Spanish" },
]) {
	for (const theme of ["light", "dark"] as const) {
		test(`${locale.name} page has no detectable accessibility violations in ${theme} mode`, async ({
			page,
		}) => {
			await page.addInitScript((darkMode) => {
				localStorage.setItem("darkMode", String(darkMode));
			}, theme === "dark");
			await page.goto(locale.path);

			const results = await new AxeBuilder({ page }).analyze();
			expect(results.violations).toEqual([]);
		});
	}
}

test("skip link moves keyboard focus to the main content", async ({ page }) => {
	await page.goto("/");
	await page.keyboard.press("Tab");
	const skipLink = page.getByRole("link", { name: "Skip to main content" });
	await expect(skipLink).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(page.getByRole("main")).toBeFocused();
});

test("mobile customization is a keyboard-operable disclosure with logical focus order", async ({
	page,
}) => {
	await page.setViewportSize({ width: 375, height: 667 });
	await page.goto("/");
	const disclosure = page.locator("[data-customization]");
	const summary = disclosure.locator("summary");
	await expect(disclosure).not.toHaveAttribute("open");
	await summary.focus();
	await page.keyboard.press("Enter");
	await expect(disclosure).toHaveAttribute("open", "");
	await page.keyboard.press("Tab");
	await expect(page.getByRole("combobox", { name: "Size" })).toBeFocused();
	const results = await new AxeBuilder({ page }).analyze();
	expect(results.violations).toEqual([]);
});

test("FAQ disclosures and generator controls remain keyboard accessible", async ({ page }) => {
	await page.goto("/");
	const firstQuestion = page.locator("#faq summary").first();
	await firstQuestion.focus();
	await page.keyboard.press("Enter");
	await expect(firstQuestion.locator("xpath=..")).toHaveAttribute("open", "");

	await expect(page.getByRole("combobox", { name: "Size" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Square" })).toHaveAttribute(
		"aria-pressed",
		"true",
	);
	await expect(page.getByLabel("Foreground hex color")).toBeVisible();
});

test("page reflows without horizontal scrolling at 320 CSS pixels", async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 800 });
	await page.goto("/");
	const dimensions = await page.evaluate(() => ({
		clientWidth: document.documentElement.clientWidth,
		scrollWidth: document.documentElement.scrollWidth,
	}));
	expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});

test("reduced-motion preference minimizes transitions and animations", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/");
	const motion = await page.getByRole("button", { name: /dark mode/ }).evaluate((element) => {
		const style = getComputedStyle(element);
		return {
			animationDuration: parseFloat(style.animationDuration),
			transitionDuration: parseFloat(style.transitionDuration),
		};
	});
	expect(motion.animationDuration).toBeLessThan(0.001);
	expect(motion.transitionDuration).toBeLessThan(0.001);
});
