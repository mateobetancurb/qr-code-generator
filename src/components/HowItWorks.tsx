import { Download, Palette, TextCursorInput } from "lucide-react";
import { useLocale } from "../context/Locale";

const stepIcons = [TextCursorInput, Palette, Download];

const HowItWorks = () => {
	const { t } = useLocale();

	return (
		<section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-800">
			<div className="container mx-auto px-4">
				<div className="text-center mb-14">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
						{t.howItWorks.heading}
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						{t.howItWorks.subheading}
					</p>
				</div>
				<ol className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{t.howItWorks.steps.map((step, index) => {
						const Icon = stepIcons[index];
						return (
							<li key={step.title} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
								<div className="flex items-center justify-between mb-6">
									<div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
										<Icon aria-hidden="true" className="w-7 h-7 text-blue-600 dark:text-blue-300" />
									</div>
									<span className="text-4xl font-bold text-blue-100 dark:text-gray-700">
										{index + 1}
									</span>
								</div>
								<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
									{step.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
									{step.description}
								</p>
							</li>
						);
					})}
				</ol>
			</div>
		</section>
	);
};

export default HowItWorks;
