import { DarkModeProvider } from "./context/DarkMode";
import { LocaleProvider, useLocale } from "./context/Locale";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QRGenerator from "./components/QRGenerator";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

function App() {
	return (
		<DarkModeProvider>
			<LocaleProvider>
				<AppContent />
			</LocaleProvider>
		</DarkModeProvider>
	);
}

function AppContent() {
	const { t } = useLocale();

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
			<a
				href="#main-content"
				className="fixed left-4 top-2 z-[100] -translate-y-20 rounded-lg bg-white px-4 py-3 font-semibold text-blue-700 shadow-lg transition-transform focus:translate-y-0 dark:bg-gray-900 dark:text-blue-300"
			>
				{t.header.skipToContent}
			</a>
			<Header />
			<main id="main-content" tabIndex={-1}>
				<Hero />
				<QRGenerator />
				<Features />
				<HowItWorks />
				<FAQ />
			</main>
			<Footer />
		</div>
	);
}

export default App;
