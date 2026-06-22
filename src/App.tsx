import { DarkModeProvider } from "./context/DarkMode";
import { LocaleProvider } from "./context/Locale";
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
				<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
					<Header />
					<main>
						<Hero />
						<QRGenerator />
						<Features />
						<HowItWorks />
						<FAQ />
					</main>
					<Footer />
				</div>
			</LocaleProvider>
		</DarkModeProvider>
	);
}

export default App;
