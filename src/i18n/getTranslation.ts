import type { Locale, Translation } from "./types";
import { en } from "./locales/en";
import { es } from "./locales/es";

const translations: Record<Locale, Translation> = {
	en,
	es,
};

export function getTranslation(locale: Locale): Translation {
	return translations[locale];
}
