import React, { useEffect, useRef, useState } from "react";
import { QrCode, Moon, Sun, Menu, X } from "lucide-react";
import { useDarkMode } from "../context/DarkMode";
import { useLocale } from "../context/Locale";
import { localePath } from "../i18n/localeRouting";
import type { Locale } from "../i18n/types";

const LanguageToggle: React.FC = () => {
	const { locale, t } = useLocale();

	const buttonClass = (lang: Locale) =>
		`min-h-6 min-w-6 px-2 py-1 text-sm font-medium transition-colors duration-200 hover:cursor-pointer ${
			locale === lang
				? "text-blue-700 dark:text-blue-300"
				: "text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300"
		}`;

	return (
		<div className="flex items-center gap-1" role="group" aria-label={t.header.language}>
			<a
				href={localePath.en}
				className={buttonClass("en")}
				lang="en"
				aria-current={locale === "en" ? "page" : undefined}
			>
				EN
			</a>
			<span aria-hidden="true" className="text-gray-300 dark:text-gray-600">
				|
			</span>
			<a
				href={localePath.es}
				className={buttonClass("es")}
				lang="es"
				aria-current={locale === "es" ? "page" : undefined}
			>
				ES
			</a>
		</div>
	);
};

const Header: React.FC = () => {
	const { isDarkMode, toggleDarkMode } = useDarkMode();
	const { t } = useLocale();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement>(null);

	const closeMenu = (restoreFocus = false) => {
		setIsMenuOpen(false);
		if (restoreFocus) requestAnimationFrame(() => menuButtonRef.current?.focus());
	};

	useEffect(() => {
		if (!isMenuOpen) return;
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") closeMenu(true);
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isMenuOpen]);
	const sectionLinkClass =
		"text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200";

	return (
		<header className="fixed w-full top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<a href="#home" className="flex items-center space-x-2" aria-label={t.header.home}>
						<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
							<QrCode aria-hidden="true" className="w-6 h-6 text-white" />
						</div>
						<span className="text-xl font-bold text-gray-800 dark:text-white">QRGenerator</span>
					</a>

					{/* desktop nav */}
					<nav
						aria-label={t.header.primaryNavigation}
						className="hidden md:flex items-center space-x-8"
					>
						<a href="#home" className={sectionLinkClass}>
							{t.header.home}
						</a>
						<a href="#generator" className={sectionLinkClass}>
							{t.header.generateQr}
						</a>
						<a href="#features" className={sectionLinkClass}>
							{t.header.features}
						</a>
						<a href="#how-it-works" className={sectionLinkClass}>
							{t.header.howItWorks}
						</a>
						<a href="#faq" className={sectionLinkClass}>
							{t.header.faq}
						</a>
						<LanguageToggle />
						<button
							type="button"
							onClick={toggleDarkMode}
							aria-label={isDarkMode ? t.header.switchToLight : t.header.switchToDark}
							className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:cursor-pointer"
						>
							{isDarkMode ? (
								<Sun aria-hidden="true" className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
							) : (
								<Moon aria-hidden="true" className="w-5 h-5 text-gray-700" />
							)}
						</button>
					</nav>

					{/* mobile menu button */}
					<div className="md:hidden flex items-center space-x-2">
						<LanguageToggle />
						<button
							type="button"
							onClick={toggleDarkMode}
							aria-label={isDarkMode ? t.header.switchToLight : t.header.switchToDark}
							className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
						>
							{isDarkMode ? (
								<Sun aria-hidden="true" className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
							) : (
								<Moon aria-hidden="true" className="w-5 h-5 text-gray-700" />
							)}
						</button>
						<button
							ref={menuButtonRef}
							type="button"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-expanded={isMenuOpen}
							aria-controls="mobile-navigation"
							aria-label={isMenuOpen ? t.header.closeMenu : t.header.openMenu}
							className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
						>
							{isMenuOpen ? (
								<X aria-hidden="true" className="w-6 h-6 text-gray-700 dark:text-gray-300" />
							) : (
								<Menu aria-hidden="true" className="w-6 h-6 text-gray-700 dark:text-gray-300" />
							)}
						</button>
					</div>
				</div>

				{/* mobile menu */}
				{isMenuOpen && (
					<div
						id="mobile-navigation"
						className="md:hidden mt-4 border-t border-gray-200 dark:border-gray-700"
					>
						<div className="py-4">
							<nav aria-label={t.header.mobileNavigation} className="flex flex-col space-y-4">
								<a href="#home" onClick={() => closeMenu(true)} className={sectionLinkClass}>
									{t.header.home}
								</a>
								<a href="#generator" onClick={() => closeMenu(true)} className={sectionLinkClass}>
									{t.header.generateQr}
								</a>
								<a href="#features" onClick={() => closeMenu(true)} className={sectionLinkClass}>
									{t.header.features}
								</a>
								<a
									href="#how-it-works"
									onClick={() => closeMenu(true)}
									className={sectionLinkClass}
								>
									{t.header.howItWorks}
								</a>
								<a href="#faq" onClick={() => closeMenu(true)} className={sectionLinkClass}>
									{t.header.faq}
								</a>
							</nav>
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
