import { useLocale } from "../context/Locale";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
	const { t } = useLocale();

	return (
		<section id="faq" className="py-20 bg-white dark:bg-gray-900">
			<div className="container mx-auto px-4 max-w-4xl">
				<div className="text-center mb-12">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
						{t.faq.heading}
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300">{t.faq.subheading}</p>
				</div>
				<div className="space-y-4">
					{t.faq.items.map((item) => (
						<details
							key={item.question}
							className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6"
						>
							<summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg text-lg font-semibold text-gray-800 dark:text-white">
								<span>{item.question}</span>
								<ChevronDown
									aria-hidden="true"
									className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
								/>
							</summary>
							<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{item.answer}</p>
						</details>
					))}
				</div>
			</div>
		</section>
	);
};

export default FAQ;
