const updateThemeControls = (isDark: boolean): void => {
	for (const button of document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]")) {
		button.setAttribute(
			"aria-label",
			isDark ? (button.dataset.lightLabel ?? "") : (button.dataset.darkLabel ?? ""),
		);
		button.querySelector(".theme-moon")?.classList.toggle("hidden", isDark);
		button.querySelector(".theme-sun")?.classList.toggle("hidden", !isDark);
	}
};

export const initTheme = (): void => {
	const isDark = document.documentElement.classList.contains("dark");
	updateThemeControls(isDark);
	for (const button of document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]")) {
		button.addEventListener("click", () => {
			const nextIsDark = !document.documentElement.classList.contains("dark");
			document.documentElement.classList.toggle("dark", nextIsDark);
			localStorage.setItem("darkMode", String(nextIsDark));
			updateThemeControls(nextIsDark);
		});
	}
};
