import { expect, test, type Download, type Page } from "@playwright/test";
import jsQR from "jsqr";
import { PNG } from "pngjs";

const downloadToBuffer = async (download: Download): Promise<Buffer> => {
	const stream = await download.createReadStream();
	const chunks: Buffer[] = [];
	for await (const chunk of stream) chunks.push(Buffer.from(chunk));
	return Buffer.concat(chunks);
};

const decodePNG = (buffer: Buffer): string => {
	const image = PNG.sync.read(buffer);
	const result = jsQR(new Uint8ClampedArray(image.data), image.width, image.height);
	expect(result, "downloaded QR code should be decodable").not.toBeNull();
	return result?.data ?? "";
};

const rasterizeSVG = async (page: Page, svg: Buffer): Promise<Buffer> => {
	const source = `data:image/svg+xml;base64,${svg.toString("base64")}`;
	await page.setContent(
		`<style>html,body{margin:0}img{display:block}</style><img id="qr" src="${source}" alt="QR code">`,
	);
	const image = page.locator("#qr");
	await expect(image).toBeVisible();
	return image.screenshot();
};

const generateAndDownload = async (
	page: Page,
	content: string,
	expectedFilename: string,
): Promise<void> => {
	await page.goto("/");
	await page.getByLabel("Text or URL").fill(content);
	await page.locator("select").selectOption("large");
	await page.getByRole("button", { name: "Dots" }).click();
	await page.getByLabel("Foreground hex color").fill("#123456");
	await page.getByLabel("Background hex color").fill("#fefefe");

	const pngPromise = page.waitForEvent("download");
	await page.getByRole("button", { name: "Download PNG" }).click();
	const pngDownload = await pngPromise;
	const png = await downloadToBuffer(pngDownload);

	expect(pngDownload.suggestedFilename()).toBe(`${expectedFilename}.png`);
	expect(png.subarray(1, 4).toString()).toBe("PNG");
	expect(decodePNG(png)).toBe(content);

	const svgPromise = page.waitForEvent("download");
	await page.getByRole("button", { name: "Download SVG" }).click();
	const svgDownload = await svgPromise;
	const svg = await downloadToBuffer(svgDownload);

	expect(svgDownload.suggestedFilename()).toBe(`${expectedFilename}.svg`);
	expect(svg.toString()).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
	expect(decodePNG(await rasterizeSVG(page, svg))).toBe(content);
};

test.describe("QR generation and downloads", () => {
	test("downloads decodable URL QR codes as PNG and SVG", async ({ page }) => {
		await generateAndDownload(page, "https://example.com/testing?source=e2e", "example");
	});

	test("preserves Unicode content in downloaded QR codes", async ({ page }) => {
		await generateAndDownload(page, "QR prueba ñ 🚀", "qr-prueba");
	});
});

test.describe("localized SEO", () => {
	for (const locale of [
		{
			path: "/",
			lang: "en",
			title: "Free QR Code Generator | Customize & Download",
			canonical: "https://qr-code-generator-2pn.pages.dev/",
			heading: /create your qr code/i,
		},
		{
			path: "/es/",
			lang: "es",
			title: "Generador de códigos QR gratis | Personaliza y descarga",
			canonical: "https://qr-code-generator-2pn.pages.dev/es/",
			heading: /crea tu código qr/i,
		},
	]) {
		test(`${locale.path} exposes localized crawl metadata and content`, async ({ page }) => {
			await page.goto(locale.path);

			await expect(page).toHaveTitle(locale.title);
			await expect(page.locator("html")).toHaveAttribute("lang", locale.lang);
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", locale.canonical);
			await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
				"href",
				"https://qr-code-generator-2pn.pages.dev/",
			);
			await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
				"href",
				"https://qr-code-generator-2pn.pages.dev/es/",
			);
			await expect(page.getByRole("heading", { level: 1, name: locale.heading })).toHaveCount(1);
			const structuredData = page.locator('script[type="application/ld+json"]');
			await expect(structuredData).toHaveCount(1);
			const graph = JSON.parse((await structuredData.textContent()) ?? "{}")["@graph"];
			expect(graph.map((item: { "@type": string }) => item["@type"])).toEqual([
				"WebSite",
				"WebApplication",
			]);
			await expect(page.getByRole("link", { name: "EN", exact: true }).first()).toHaveAttribute(
				"href",
				"/",
			);
			await expect(page.getByRole("link", { name: "ES", exact: true }).first()).toHaveAttribute(
				"href",
				"/es/",
			);
		});
	}

	test("publishes crawl and social assets", async ({ request }) => {
		const robots = await request.get("/robots.txt");
		expect(robots.ok()).toBe(true);
		expect(await robots.text()).toContain(
			"Sitemap: https://qr-code-generator-2pn.pages.dev/sitemap.xml",
		);

		const sitemap = await request.get("/sitemap.xml");
		expect(sitemap.ok()).toBe(true);
		const sitemapXml = await sitemap.text();
		expect(sitemapXml).toContain("https://qr-code-generator-2pn.pages.dev/");
		expect(sitemapXml).toContain("https://qr-code-generator-2pn.pages.dev/es/");

		const socialCard = await request.get("/qr-code-social-card.png");
		expect(socialCard.ok()).toBe(true);
		expect(socialCard.headers()["content-type"]).toBe("image/png");
	});

	test("renders localized content without client JavaScript", async ({ browser }) => {
		const context = await browser.newContext({ javaScriptEnabled: false });
		const page = await context.newPage();
		await page.goto("/es/");
		await expect(page.getByRole("heading", { level: 1, name: /crea tu código qr/i })).toBeVisible();
		await expect(page.getByRole("heading", { name: "Contenido", exact: true })).toBeVisible();
		await expect(page.getByRole("heading", { name: /preguntas frecuentes/i })).toBeVisible();
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			"href",
			"https://qr-code-generator-2pn.pages.dev/es/",
		);
		await context.close();
	});

	test("moves immediately from empty preview to ready downloads", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("[data-empty-preview]")).toContainText(
			"Your QR code will appear here",
		);
		await expect(page.getByRole("button", { name: "Download PNG" })).toBeHidden();

		await page.getByLabel("Text or URL").fill("https://example.com");
		await expect(page.getByLabel("Generated QR code preview")).toBeVisible();
		await expect(page.getByRole("button", { name: "Download PNG" })).toBeVisible();
		await expect(page.getByRole("button", { name: "Download SVG" })).toBeVisible();
	});

	test("switches language without reloading or losing generator state and scroll", async ({
		page,
	}) => {
		await page.goto("/");
		await page.getByLabel("Text or URL").fill("QR persistido ñ");
		await page.locator("[data-qr-size]").selectOption("large");
		await page.locator('[data-module-style="dots"]').click();
		await page.locator('[data-color-text="foreground"]').fill("#123456");
		await page.locator('[data-color-text="background"]').fill("#fefefe");
		await page.evaluate(() => window.scrollTo({ top: 480, behavior: "instant" as ScrollBehavior }));
		const scrollBefore = await page.evaluate(() => window.scrollY);

		await page
			.getByRole("link", { name: "ES", exact: true })
			.evaluate((link: HTMLAnchorElement) => link.click());
		await expect(page).toHaveURL(/\/es\/$/);
		await expect(page.locator("html")).toHaveAttribute("lang", "es");
		await expect(page.getByRole("heading", { level: 1, name: /crea tu código qr/i })).toBeVisible();
		await expect(page.locator("[data-qr-text]")).toHaveValue("QR persistido ñ");
		await expect(page.locator("[data-qr-size]")).toHaveValue("large");
		await expect(page.locator('[data-module-style="dots"]')).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		await expect(page.locator('[data-color-text="foreground"]')).toHaveValue("#123456");
		await expect(page.locator('[data-color-text="background"]')).toHaveValue("#fefefe");
		await expect(page.locator("[data-qr-canvas]")).toBeVisible();
		expect(await page.evaluate(() => performance.getEntriesByType("navigation").length)).toBe(1);
		expect(
			Math.abs((await page.evaluate(() => window.scrollY)) - scrollBefore),
		).toBeLessThanOrEqual(2);

		await page
			.getByRole("link", { name: "EN", exact: true })
			.evaluate((link: HTMLAnchorElement) => link.click());
		await expect(page).toHaveURL(/\/$/);
		await expect(page.locator("[data-qr-text]")).toHaveValue("QR persistido ñ");
	});

	test("preserves explicit dark and light themes across language changes", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("button", { name: "Switch to dark mode" }).click();
		await expect(page.locator("html")).toHaveClass(/dark/);

		await page
			.getByRole("link", { name: "ES", exact: true })
			.evaluate((link: HTMLAnchorElement) => link.click());
		await expect(page).toHaveURL(/\/es\/$/);
		await expect(page.locator("html")).toHaveClass(/dark/);
		await expect(page.getByRole("button", { name: "Cambiar al modo claro" })).toBeVisible();

		await page.getByRole("button", { name: "Cambiar al modo claro" }).click();
		await expect(page.locator("html")).not.toHaveClass(/dark/);
		await page
			.getByRole("link", { name: "EN", exact: true })
			.evaluate((link: HTMLAnchorElement) => link.click());
		await expect(page).toHaveURL(/\/$/);
		await expect(page.locator("html")).not.toHaveClass(/dark/);
		await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
	});
});
