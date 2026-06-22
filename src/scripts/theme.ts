interface ThemeNavigationState {
	initialized: boolean;
}

const navigationStateKey = "__qrThemeNavigation";

export const resolveTheme = (savedMode: string | null, prefersDark: boolean): boolean => {
	if (savedMode === "true") return true;
	if (savedMode === "false") return false;
	return prefersDark;
};

export const getPreferredTheme = (): boolean => {
	let savedMode: string | null = null;
	try {
		savedMode = localStorage.getItem("darkMode");
	} catch {
		// Fall back to the operating-system preference when storage is unavailable.
	}
	return resolveTheme(savedMode, window.matchMedia("(prefers-color-scheme: dark)").matches);
};

export const applyTheme = (target: Document, isDark: boolean): void => {
	target.documentElement.classList.toggle("dark", isDark);
};

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

const initThemeNavigation = (): void => {
	const target = window as typeof window & { [navigationStateKey]?: ThemeNavigationState };
	const state = (target[navigationStateKey] ??= { initialized: false });
	if (state.initialized) return;
	state.initialized = true;
	document.addEventListener("astro:before-swap", (event) => {
		if (!("newDocument" in event) || !(event.newDocument instanceof Document)) return;
		applyTheme(event.newDocument, getPreferredTheme());
	});
};

export const initTheme = (): void => {
	initThemeNavigation();
	const isDark = document.documentElement.classList.contains("dark");
	updateThemeControls(isDark);
	for (const button of document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]")) {
		if (button.dataset.themeInitialized === "true") continue;
		button.dataset.themeInitialized = "true";
		button.addEventListener("click", () => {
			const nextIsDark = !document.documentElement.classList.contains("dark");
			document.documentElement.classList.toggle("dark", nextIsDark);
			localStorage.setItem("darkMode", String(nextIsDark));
			updateThemeControls(nextIsDark);
		});
	}
};
