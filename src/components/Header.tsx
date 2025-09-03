import React, { useState } from "react";
import { QrCode, Moon, Sun, Menu, X } from "lucide-react";
import { useDarkMode } from "../context/DarkMode";

const Header: React.FC = () => {
	const { isDarkMode, toggleDarkMode } = useDarkMode();
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
						<div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
							<QrCode className="w-6 h-6 text-white" />
						</div>
						<span className="text-xl font-bold text-gray-800 dark:text-white">
							QRGen
						</span>
					</div>

					{/* desktop nav */}
					<nav className="hidden md:flex items-center space-x-8">
						<button
							onClick={() => scrollToSection("home")}
							className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
						>
							Home
						</button>
						<button
							onClick={() => scrollToSection("generator")}
							className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
						>
							Generate QR
						</button>
						<button
							onClick={() => scrollToSection("features")}
							className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
						>
							Features
						</button>
						<button
							onClick={() => scrollToSection("contact")}
							className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
						>
							Contact
						</button>
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
					</nav>

					{/* mobile menu button */}
					<div className="md:hidden flex items-center space-x-2">
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
				{isMenuOpen && (
					<div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
						<nav className="flex flex-col space-y-4">
							<button
								onClick={() => scrollToSection("home")}
								className="text-left text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
							>
								Home
							</button>
							<button
								onClick={() => scrollToSection("generator")}
								className="text-left text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
							>
								Generate QR
							</button>
							<button
								onClick={() => scrollToSection("features")}
								className="text-left text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
							>
								Features
							</button>
							<button
								onClick={() => scrollToSection("contact")}
								className="text-left text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
							>
								Contact
							</button>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
