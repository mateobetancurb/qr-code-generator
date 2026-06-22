import { describe, expect, it, vi } from "vitest";
import { ImageUploadValidationError, loadImageFile, MAX_IMAGE_BYTES } from "./imageUpload";

describe("loadImageFile", () => {
	it("rejects unsupported and oversized files before decoding", async () => {
		await expect(
			loadImageFile(new File(["svg"], "logo.svg", { type: "image/svg+xml" })),
		).rejects.toMatchObject({ reason: "type" });
		await expect(
			loadImageFile(
				new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], "large.png", { type: "image/png" }),
			),
		).rejects.toMatchObject({ reason: "size" });
	});

	it("returns decoded dimensions and the local data URL", async () => {
		class LoadedImage extends EventTarget {
			naturalWidth = 240;
			naturalHeight = 120;
			set src(_value: string) {
				queueMicrotask(() => this.dispatchEvent(new Event("load")));
			}
		}
		vi.stubGlobal("Image", LoadedImage);
		const result = await loadImageFile(new File(["png"], "logo.png", { type: "image/png" }));

		expect(result.dataUrl).toMatch(/^data:image\/png;base64,/);
		expect(result.width).toBe(240);
		expect(result.height).toBe(120);
	});

	it("reports image decode failures", async () => {
		class BrokenImage extends EventTarget {
			set src(_value: string) {
				queueMicrotask(() => this.dispatchEvent(new Event("error")));
			}
		}
		vi.stubGlobal("Image", BrokenImage);

		await expect(
			loadImageFile(new File(["broken"], "logo.webp", { type: "image/webp" })),
		).rejects.toBeInstanceOf(ImageUploadValidationError);
	});
});
