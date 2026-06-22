interface LanguageNavigationState {
	initialized: boolean;
	pendingScroll: { x: number; y: number } | null;
}

const stateKey = "__qrLanguageNavigation";

const getState = (): LanguageNavigationState => {
	const target = window as typeof window & { [stateKey]?: LanguageNavigationState };
	return (target[stateKey] ??= { initialized: false, pendingScroll: null });
};

const isPlainPrimaryClick = (event: MouseEvent): boolean =>
	event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

export const initLanguageNavigation = (): void => {
	const state = getState();
	if (state.initialized) return;
	state.initialized = true;

	document.addEventListener(
		"click",
		(event) => {
			if (!(event instanceof MouseEvent) || !isPlainPrimaryClick(event)) return;
			const target =
				event.target instanceof Element ? event.target.closest("[data-language-link]") : null;
			if (!(target instanceof HTMLAnchorElement)) return;
			const destination = new URL(target.href, window.location.href);
			if (
				destination.origin !== window.location.origin ||
				destination.href === window.location.href
			)
				return;
			state.pendingScroll = { x: window.scrollX, y: window.scrollY };
		},
		{ capture: true },
	);

	document.addEventListener("astro:after-swap", () => {
		if (!state.pendingScroll) return;
		const { x, y } = state.pendingScroll;
		state.pendingScroll = null;
		window.scrollTo({ left: x, top: y, behavior: "instant" as ScrollBehavior });
	});
};
