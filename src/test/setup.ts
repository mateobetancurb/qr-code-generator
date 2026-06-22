import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";

const storage = new Map<string, string>();
const localStorageMock: Storage = {
	get length() {
		return storage.size;
	},
	clear: () => storage.clear(),
	getItem: (key) => storage.get(key) ?? null,
	key: (index) => [...storage.keys()][index] ?? null,
	removeItem: (key) => storage.delete(key),
	setItem: (key, value) => storage.set(key, String(value)),
};

Object.defineProperty(globalThis, "localStorage", {
	configurable: true,
	value: localStorageMock,
});

const createCanvasContext = (): CanvasRenderingContext2D =>
	({
		arc: vi.fn(),
		beginPath: vi.fn(),
		clearRect: vi.fn(),
		fill: vi.fn(),
		fillRect: vi.fn(),
		fillStyle: "#000000",
		roundRect: vi.fn(),
		drawImage: vi.fn(),
		save: vi.fn(),
		clip: vi.fn(),
		restore: vi.fn(),
	}) as unknown as CanvasRenderingContext2D;

beforeEach(() => {
	localStorage.clear();
	sessionStorage.clear();
	window.history.replaceState({}, "", "/");
	Object.defineProperty(window, "matchMedia", {
		configurable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			addListener: vi.fn(),
			removeListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});

	vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() =>
		createCanvasContext(),
	);
	vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
		"data:image/png;base64,dGVzdA==",
	);
	Object.defineProperty(Element.prototype, "scrollIntoView", {
		configurable: true,
		value: vi.fn(),
	});
	Object.defineProperty(URL, "createObjectURL", {
		configurable: true,
		value: vi.fn(() => "blob:test"),
	});
	Object.defineProperty(URL, "revokeObjectURL", {
		configurable: true,
		value: vi.fn(),
	});
});

afterEach(() => {
	document.body.replaceChildren();
	document.documentElement.className = "";
	vi.restoreAllMocks();
});
