import React from "react";
import { features } from "../utils";

const Features: React.FC = () => {
	return (
		<section
			id="features"
			className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300"
		>
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
						Why Choose this tool?
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Powerful features designed to make QR code generation simple, fast,
						and customizable
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.id}
								className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-slide-up"
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<div
									className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}
								>
									<Icon className={`w-8 h-8 ${feature.color}`} />
								</div>
								<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
									{feature.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>

				{/* Stats Section */}
				<div className="mt-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-12 text-center">
					<h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
						Trusted by Thousands
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="text-center">
							<div className="text-4xl font-bold text-white mb-2">10,000+</div>
							<div className="text-blue-100">QR Codes Generated</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-white mb-2">50+</div>
							<div className="text-blue-100">Countries</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-white mb-2">99.9%</div>
							<div className="text-blue-100">Uptime</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-white mb-2">100%</div>
							<div className="text-blue-100">Free Forever</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Features;
