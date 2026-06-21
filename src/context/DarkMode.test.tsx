import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { DarkModeProvider, useDarkMode } from "./DarkMode";

const wrapper = ({ children }: { children: ReactNode }) => (
	<DarkModeProvider>{children}</DarkModeProvider>
);

describe("DarkModeProvider", () => {
	it("restores and persists a stored preference", async () => {
		localStorage.setItem("darkMode", "true");
		const { result } = renderHook(() => useDarkMode(), { wrapper });

		expect(result.current.isDarkMode).toBe(true);
		await waitFor(() => expect(document.documentElement).toHaveClass("dark"));

		act(() => result.current.toggleDarkMode());

		expect(result.current.isDarkMode).toBe(false);
		await waitFor(() => expect(document.documentElement).not.toHaveClass("dark"));
		expect(localStorage.getItem("darkMode")).toBe("false");
	});

	it("uses the system preference when nothing is stored", () => {
		vi.mocked(window.matchMedia).mockReturnValue({
			matches: true,
		} as MediaQueryList);

		const { result } = renderHook(() => useDarkMode(), { wrapper });

		expect(result.current.isDarkMode).toBe(true);
	});

	it("rejects use outside its provider", () => {
		vi.spyOn(console, "error").mockImplementation(() => undefined);
		expect(() => renderHook(() => useDarkMode())).toThrow(
			"useDarkMode must be used within a DarkModeProvider",
		);
	});
});
