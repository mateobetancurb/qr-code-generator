import React, { createContext, useContext, useState, useEffect } from "react";

interface DarkModeContextType {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
	undefined
);

export const useDarkMode = () => {
	const context = useContext(DarkModeContext);
	if (context === undefined) {
		throw new Error("useDarkMode must be used within a DarkModeProvider");
	}
	return context;
};

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		// Initialize based on localStorage or system preference
		if (typeof window !== "undefined") {
			const savedMode = localStorage.getItem("darkMode");
			if (savedMode !== null) {
				return JSON.parse(savedMode);
			}
			// Check system preference if no saved mode
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return false;
	});

	// Apply theme class immediately on mount and when isDarkMode changes
	useEffect(() => {
		if (typeof window !== "undefined") {
			if (isDarkMode) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}
	}, [isDarkMode]);

	// Save to localStorage when isDarkMode changes
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
		}
	}, [isDarkMode]);

	const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
	};

	return (
		<DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
			{children}
		</DarkModeContext.Provider>
	);
};
