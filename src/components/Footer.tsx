import React from "react";
import { QrCode, Github, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<footer
			id="contact"
			className="bg-gray-900 dark:bg-black text-white transition-colors duration-300"
		>
			<div className="container mx-auto px-4 py-16">
				<div className="md:flex md:justify-between">
					{/* brand */}
					<div className="lg:col-span-2">
						<div className="flex items-center space-x-2 mb-4">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
								<QrCode className="w-6 h-6 text-white" />
							</div>
							<span className="text-2xl font-bold">QRGenerator</span>
						</div>
						<p className="text-gray-300 mb-6 max-w-md leading-relaxed">
							Generate beautiful, customizable QR codes instantly. Fast, free,
							and privacy-focused. Perfect for businesses, events, and personal
							use
						</p>
						<div className="flex space-x-4 mb-5 md:mb-0">
							<a
								href="https://github.com/mateobetancurb"
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
							>
								<Github className="w-5 h-5" />
							</a>
							<a
								href="https://twitter.com/mateobetancurb"
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
							>
								<Twitter className="w-5 h-5" />
							</a>
							<a
								href="https://linkedin.com/in/mateobetancurb"
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
							>
								<Linkedin className="w-5 h-5" />
							</a>
						</div>
					</div>

					{/* quick links */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<button
									onClick={() => scrollToSection("home")}
									className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:cursor-pointer"
								>
									Home
								</button>
							</li>
							<li>
								<button
									onClick={() => scrollToSection("generator")}
									className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:cursor-pointer"
								>
									QR Generator
								</button>
							</li>
							<li>
								<button
									onClick={() => scrollToSection("features")}
									className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:cursor-pointer"
								>
									Features
								</button>
							</li>
						</ul>
					</div>
				</div>

				{/* bottom bar */}
				<div className="border-t border-gray-800 mt-12 pt-8">
					<div className="flex flex-col md:flex-row items-center justify-between">
						<div className="flex flex-col items-center">
							<div className="flex items-center text-gray-400 mb-4 md:mb-0">
								<span>© {new Date().getFullYear()} QRGenerator</span>
							</div>
							<p className="text-gray-400 mb-4 md:mb-0">
								Made with 💙 for the community by Mateo
							</p>
						</div>
						<p className="text-gray-400">
							All QR codes generated locally in your browser
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
