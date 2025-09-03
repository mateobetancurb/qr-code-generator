import React from "react";
import { ArrowRight, Zap } from "lucide-react";

const Hero: React.FC = () => {
	const scrollToGenerator = () => {
		const element = document.getElementById("generator");
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<section
			id="home"
			className="relative min-h-screen overflow-hidden flex items-center justify-center pt-20"
		>
			{/* animated background gradients */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500"></div>
			<div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-100/30 to-transparent dark:from-transparent dark:via-blue-900/10 dark:to-transparent animate-pulse"></div>

			{/* floating gradient orbs */}
			<div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-sky-400/20 rounded-full blur-3xl animate-float"></div>
			<div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-300/15 to-cyan-300/15 rounded-full blur-3xl animate-float-delayed"></div>
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-sky-200/10 to-blue-200/10 rounded-full blur-3xl animate-pulse"></div>

			<div className="container mx-auto px-4 text-center">
				<div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
					{/* badge */}
					<div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-sky-100 dark:from-blue-900/40 dark:to-sky-900/40 backdrop-blur-sm rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-slide-up border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
						<Zap className="w-4 h-4 mr-2" />
						Fast & Reliable QR Generation
					</div>

					{/* headline */}
					<h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up animation-delay-100">
						<span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
							Generate Your
						</span>
						<span className="bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 bg-clip-text text-transparent block animate-gradient">
							QR Code Instantly
						</span>
					</h1>

					{/* subtext */}
					<p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-200 backdrop-blur-sm">
						Create custom QR codes for your business, events, or personal use.
						Fast, free, and with full customization options including colors and
						sizes.
					</p>

					{/* cta button */}
					<button
						onClick={scrollToGenerator}
						className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 hover:from-blue-600 hover:via-sky-600 hover:to-blue-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-300 overflow-hidden"
					>
						<div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<span className="relative z-10 flex items-center">
							Get Started
							<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
						</span>
					</button>

					{/* stats */}
					<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up animation-delay-400">
						<div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
							<div className="text-3xl font-bold text-gray-800 dark:text-white">
								10K+
							</div>
							<div className="text-gray-600 dark:text-gray-300">
								QR Codes Generated
							</div>
						</div>
						<div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
							<div className="text-3xl font-bold text-gray-800 dark:text-white">
								100%
							</div>
							<div className="text-gray-600 dark:text-gray-300">
								Free to Use
							</div>
						</div>
						<div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
							<div className="text-3xl font-bold text-gray-800 dark:text-white">
								0s
							</div>
							<div className="text-gray-600 dark:text-gray-300">
								Generation Time
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
