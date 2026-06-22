export const initNavigation = (): void => {
	const button = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
	const navigation = document.querySelector<HTMLElement>("[data-mobile-navigation]");
	if (!button || !navigation) return;

	const setOpen = (isOpen: boolean, restoreFocus = false): void => {
		button.setAttribute("aria-expanded", String(isOpen));
		button.setAttribute(
			"aria-label",
			isOpen ? (button.dataset.closeLabel ?? "") : (button.dataset.openLabel ?? ""),
		);
		button.querySelector(".menu-open-icon")?.classList.toggle("hidden", isOpen);
		button.querySelector(".menu-close-icon")?.classList.toggle("hidden", !isOpen);
		navigation.hidden = !isOpen;
		if (restoreFocus) requestAnimationFrame(() => button.focus());
	};

	button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
	for (const link of navigation.querySelectorAll("a"))
		link.addEventListener("click", () => setOpen(false, true));
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true")
			setOpen(false, true);
	});
};
