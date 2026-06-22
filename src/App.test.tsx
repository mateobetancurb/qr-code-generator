import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
	it("renders complete factual content and crawlable section links", () => {
		const { container } = render(<App />);

		expect(screen.getByRole("heading", { name: /generate yourqr code instantly/i })).toBeVisible();
		expect(screen.getByRole("heading", { name: "QR Code Generator" })).toBeVisible();
		expect(screen.getByRole("heading", { name: /why choose this tool/i })).toBeVisible();
		expect(screen.getByRole("heading", { name: /how to create a qr code/i })).toBeVisible();
		expect(screen.getByRole("heading", { name: /qr code generator questions/i })).toBeVisible();
		expect(screen.getByText(/all qr codes generated locally/i)).toBeVisible();
		expect(screen.queryByText("10,000+")).not.toBeInTheDocument();
		expect(screen.queryByText("99.9%")).not.toBeInTheDocument();

		expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute("href", "#generator");

		const desktopNav = container.querySelector("nav.hidden.md\\:flex");
		expect(
			within(desktopNav as HTMLElement).getByRole("link", { name: "Features" }),
		).toHaveAttribute("href", "#features");
		expect(
			within(desktopNav as HTMLElement).getByRole("link", { name: "How it works" }),
		).toHaveAttribute("href", "#how-it-works");

		const footer = screen.getByRole("contentinfo");
		expect(within(footer).getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "#faq");
	});

	it("renders Spanish from its URL and exposes reciprocal language links", async () => {
		window.history.replaceState({}, "", "/es/");
		const user = userEvent.setup();
		const { container } = render(<App />);

		await waitFor(() =>
			expect(screen.getByRole("heading", { name: "Generador de códigos QR" })).toBeVisible(),
		);
		expect(screen.getAllByRole("link", { name: "EN" })[0]).toHaveAttribute("href", "/");
		expect(screen.getAllByRole("link", { name: "ES" })[0]).toHaveAttribute("href", "/es/");
		expect(document.documentElement).toHaveAttribute("lang", "es");

		const desktopNav = container.querySelector("nav.hidden.md\\:flex");
		expect(desktopNav).not.toBeNull();
		const themeButton = within(desktopNav as HTMLElement)
			.getAllByRole("button")
			.at(-1);
		await user.click(themeButton as HTMLElement);
		await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
	});

	it("exposes skip navigation and named icon controls", () => {
		render(<App />);

		expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
			"href",
			"#main-content",
		);
		expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
		expect(screen.getAllByRole("button", { name: "Switch to dark mode" })).toHaveLength(2);
		expect(screen.getByRole("link", { name: "Mateo Betancur on GitHub" })).toBeVisible();
	});

	it("only exposes mobile navigation links while the disclosure is open", async () => {
		const user = userEvent.setup();
		render(<App />);
		const menuButton = screen.getByRole("button", { name: "Open navigation menu" });

		expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).toBeNull();
		await user.click(menuButton);
		expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
		expect(menuButton).toHaveAttribute("aria-expanded", "true");

		await user.keyboard("{Escape}");
		await waitFor(() =>
			expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).toBeNull(),
		);
		expect(menuButton).toHaveFocus();
	});
});
