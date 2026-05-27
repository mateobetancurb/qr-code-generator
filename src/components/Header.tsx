import React, { useState } from "react";
import { QrCode, Moon, Sun, Menu, X } from "lucide-react";
import { useDarkMode } from "../context/DarkMode";
import { useLocale } from "../context/Locale";
import type { Locale } from "../i18n/types";

const LanguageToggle: React.FC = () => {
	const { locale, setLocale } = useLocale();

	const buttonClass = (lang: Locale) =>
		`px-2 py-1 text-sm font-medium transition-colors duration-200 hover:cursor-pointer ${
			locale === lang
				? "text-blue-500 dark:text-blue-400"
				: "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
		}`;

	return (
		<div className="flex items-center gap-1" role="group" aria-label="Language">
			<button
				type="button"
				onClick={() => setLocale("en")}
				className={buttonClass("en")}
				aria-current={locale === "en" ? "true" : undefined}
			>
				EN
			</button>
			<span className="text-gray-300 dark:text-gray-600">|</span>
			<button
				type="button"
				onClick={() => setLocale("es")}
				className={buttonClass("es")}
				aria-current={locale === "es" ? "true" : undefined}
			>
				ES
			</button>
		</div>
	);
};

const Header: React.FC = () => {
	const { isDarkMode, toggleDarkMode } = useDarkMode();
	const { t } = useLocale();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		setIsMenuOpen(false);
	};

	return (
		<header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 transition-all duration-300">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
							<QrCode className="w-6 h-6 text-white" />
						</div>
						<span className="text-xl font-bold text-gray-800 dark:text-white">QRGenerator</span>
					</div>

					{/* desktop nav */}
					<nav className="hidden md:flex items-center space-x-8">
						<button
							onClick={() => scrollToSection("home")}
							className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 hover:cursor-pointer"
						>
							{t.header.home}
						</button>
						<button
							onClick={() => scrollToSection("generator")}
							className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 hover:cursor-pointer"
						>
							{t.header.generateQr}
						</button>
						<button
							onClick={() => scrollToSection("features")}
							className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 hover:cursor-pointer"
						>
							{t.header.features}
						</button>
						<button
							onClick={() => scrollToSection("contact")}
							className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 hover:cursor-pointer"
						>
							{t.header.contact}
						</button>
						<LanguageToggle />
						<button
							onClick={toggleDarkMode}
							className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:cursor-pointer"
						>
							{isDarkMode ? (
								<Sun className="w-5 h-5 text-yellow-500" />
							) : (
								<Moon className="w-5 h-5 text-gray-600" />
							)}
						</button>
					</nav>

					{/* mobile menu button */}
					<div className="md:hidden flex items-center space-x-2">
						<LanguageToggle />
						<button
							onClick={toggleDarkMode}
							className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
						>
							{isDarkMode ? (
								<Sun className="w-5 h-5 text-yellow-500" />
							) : (
								<Moon className="w-5 h-5 text-gray-600" />
							)}
						</button>
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
						>
							{isMenuOpen ? (
								<X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
							) : (
								<Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
							)}
						</button>
					</div>
				</div>

				{/* mobile menu */}
				<div
					className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-200 dark:border-gray-700 ${
						isMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
					}`}
				>
					<div className="py-4">
						<nav className="flex flex-col space-y-4">
							<button
								onClick={() => scrollToSection("home")}
								className="text-left text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
							>
								{t.header.home}
							</button>
							<button
								onClick={() => scrollToSection("generator")}
								className="text-left text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
							>
								{t.header.generateQr}
							</button>
							<button
								onClick={() => scrollToSection("features")}
								className="text-left text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
							>
								{t.header.features}
							</button>
							<button
								onClick={() => scrollToSection("contact")}
								className="text-left text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
							>
								{t.header.contact}
							</button>
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
