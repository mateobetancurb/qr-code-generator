import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTranslation } from "../i18n/getTranslation";
import type { Locale, Translation } from "../i18n/types";

const LOCALE_STORAGE_KEY = "locale";

function readStoredLocale(): Locale | null {
	if (typeof window === "undefined") return null;
	const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
	if (raw === "en" || raw === "es") return raw;
	return null;
}

function detectBrowserLocale(): Locale {
	if (typeof window === "undefined") return "en";
	return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

function getInitialLocale(): Locale {
	const stored = readStoredLocale();
	if (stored !== null) return stored;
	return detectBrowserLocale();
}

interface LocaleContextType {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: Translation;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
	const context = useContext(LocaleContext);
	if (context === undefined) {
		throw new Error("useLocale must be used within a LocaleProvider");
	}
	return context;
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

	const setLocale = (next: Locale) => {
		setLocaleState(next);
		if (typeof window !== "undefined") {
			localStorage.setItem(LOCALE_STORAGE_KEY, next);
		}
	};

	const t = useMemo(() => getTranslation(locale), [locale]);

	useEffect(() => {
		if (typeof document === "undefined") return;
		document.documentElement.lang = locale === "es" ? "es" : "en";
		document.title = t.meta.title;
		const meta = document.querySelector('meta[name="description"]');
		if (meta) {
			meta.setAttribute("content", t.meta.description);
		}
	}, [locale, t]);

	return (
		<LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
	);
};
