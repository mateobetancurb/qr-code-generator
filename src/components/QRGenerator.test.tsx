import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "../context/Locale";
import QRGenerator from "./QRGenerator";

const renderGenerator = () => render(<QRGenerator />, { wrapper: LocaleProvider });

describe("QRGenerator", () => {
	it("generates and customizes a QR preview from user input", async () => {
		const user = userEvent.setup();
		renderGenerator();

		expect(screen.getByText("Enter text to generate QR code")).toBeVisible();
		await user.type(screen.getByLabelText("Text or URL"), "https://example.com");

		await waitFor(() => expect(screen.getByRole("button", { name: "Download PNG" })).toBeVisible());
		expect(screen.getByRole("button", { name: "Download SVG" })).toBeVisible();

		await user.selectOptions(screen.getByRole("combobox"), "large");
		await user.click(screen.getByRole("button", { name: "Dots" }));
		expect(screen.getByRole("button", { name: "Dots" })).toHaveAttribute("aria-pressed", "true");
		expect(document.querySelector("canvas")).toHaveAttribute("width", "400");
	});

	it("downloads PNG and SVG using a content-derived filename", async () => {
		const user = userEvent.setup();
		const click = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => undefined);
		renderGenerator();

		await user.type(screen.getByLabelText("Text or URL"), "https://example.com/path");
		await user.click(await screen.findByRole("button", { name: "Download PNG" }));
		await user.click(screen.getByRole("button", { name: "Download SVG" }));

		expect(click).toHaveBeenCalledTimes(2);
		expect(URL.createObjectURL).toHaveBeenCalledOnce();
		expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
	});

	it("clears the preview when content becomes blank", async () => {
		const user = userEvent.setup();
		renderGenerator();
		const input = screen.getByLabelText("Text or URL");

		await user.type(input, "test");
		expect(await screen.findByRole("button", { name: "Download PNG" })).toBeVisible();
		await user.clear(input);

		await waitFor(() => expect(screen.queryByRole("button", { name: "Download PNG" })).toBeNull());
		expect(screen.getByText("Enter text to generate QR code")).toBeVisible();
	});
});
