import { expect, test } from "@playwright/test";

for (const viewport of [
	{ name: "desktop", width: 1440, height: 1100 },
	{ name: "mobile", width: 375, height: 900 },
]) {
	for (const theme of ["light", "dark"] as const) {
		test(`${viewport.name} ${theme} workspace matches its visual baseline`, async ({ page }) => {
			await page.setViewportSize(viewport);
			await page.addInitScript((darkMode) => {
				localStorage.setItem("darkMode", String(darkMode));
			}, theme === "dark");
			await page.goto("/");
			await page.getByLabel("Text or URL").fill("https://example.com");
			await expect(page).toHaveScreenshot(`${viewport.name}-${theme}.png`, {
				fullPage: true,
				animations: "disabled",
			});
		});
	}
}
