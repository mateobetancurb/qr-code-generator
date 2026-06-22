import React, { createContext, useContext, useEffect, useMemo } from "react";
import { getTranslation } from "../i18n/getTranslation";
import { getLocaleFromPathname } from "../i18n/localeRouting";
import type { Locale, Translation } from "../i18n/types";

interface LocaleContextType {
	locale: Locale;
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
	const locale = getLocaleFromPathname(
		typeof window === "undefined" ? "/" : window.location.pathname,
	);

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

	return <LocaleContext.Provider value={{ locale, t }}>{children}</LocaleContext.Provider>;
};
