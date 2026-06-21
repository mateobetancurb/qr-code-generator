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
	await page.getByLabel("Foreground").fill("#123456");
	await page.getByLabel("Background").fill("#fefefe");

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
