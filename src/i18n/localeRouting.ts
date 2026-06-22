import type { Locale } from "./types";

export const localePath: Record<Locale, string> = {
	en: "/",
	es: "/es/",
};

export const getLocaleFromPathname = (pathname: string): Locale =>
	pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
