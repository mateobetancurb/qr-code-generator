import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
	it("renders the complete application and navigates between sections", async () => {
		const user = userEvent.setup();
		const { container } = render(<App />);

		expect(screen.getByRole("heading", { name: /generate yourqr code instantly/i })).toBeVisible();
		expect(screen.getByRole("heading", { name: "QR Code Generator" })).toBeVisible();
		expect(screen.getByRole("heading", { name: /why choose this tool/i })).toBeVisible();
		expect(screen.getByText(/all qr codes generated locally/i)).toBeVisible();

		await user.click(screen.getByRole("button", { name: "Get Started" }));
		expect(document.getElementById("generator")?.scrollIntoView).toHaveBeenCalled();

		const desktopNav = container.querySelector("nav.hidden.md\\:flex");
		for (const button of within(desktopNav as HTMLElement)
			.getAllByRole("button")
			.slice(0, 4)) {
			await user.click(button);
		}

		const footer = screen.getByRole("contentinfo");
		for (const button of within(footer).getAllByRole("button")) {
			await user.click(button);
		}
	});

	it("switches language and persists dark mode", async () => {
		const user = userEvent.setup();
		const { container } = render(<App />);

		await user.click(screen.getAllByRole("button", { name: "ES" })[0]);
		await waitFor(() =>
			expect(screen.getByRole("heading", { name: "Generador de códigos QR" })).toBeVisible(),
		);
		expect(localStorage.getItem("locale")).toBe("es");

		const desktopNav = container.querySelector("nav.hidden.md\\:flex");
		expect(desktopNav).not.toBeNull();
		const themeButton = within(desktopNav as HTMLElement)
			.getAllByRole("button")
			.at(-1);
		await user.click(themeButton as HTMLElement);
		await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
	});
});
