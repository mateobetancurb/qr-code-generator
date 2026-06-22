import type { Translation } from "../types";

export const es: Translation = {
	meta: {
		title: "Generador de códigos QR gratis | Personaliza y descarga",
		description:
			"Crea códigos QR personalizados para enlaces y texto gratis. Elige colores, tamaños y patrones, y descarga tus archivos en formato PNG o SVG al instante.",
	},
	header: {
		skipToContent: "Saltar al contenido principal",
		home: "Inicio de QRGenerator",
		language: "Idioma",
		switchToDark: "Cambiar al modo oscuro",
		switchToLight: "Cambiar al modo claro",
	},
	generator: {
		kicker: "Privado. Rápido. Tuyo.",
		title: "Crea tu código QR",
		subtitle:
			"Añade el contenido, personaliza el diseño y descarga un código QR listo para usar en segundos.",
		content: "Contenido",
		contentHint: "Tu código QR se actualiza mientras escribes.",
		textOrUrl: "Texto o URL",
		placeholder: "https://ejemplo.com o cualquier texto",
		customize: "Personalizar",
		customizeHint: "Tamaño, patrón y colores",
		size: "Tamaño",
		sizeSmall: "Pequeño (200 × 200)",
		sizeMedium: "Mediano (300 × 300)",
		sizeLarge: "Grande (400 × 400)",
		sizeXlarge: "Extra grande (500 × 500)",
		pattern: "Patrón",
		patternSquare: "Cuadrados",
		patternDots: "Puntos",
		colors: "Colores",
		foreground: "Primer plano",
		foregroundHex: "Color hexadecimal de primer plano",
		background: "Fondo",
		backgroundHex: "Color hexadecimal de fondo",
		preview: "Vista previa",
		livePreview: "En vivo",
		emptyPreview: "Tu código QR aparecerá aquí",
		previewReady: "La vista previa del código QR está lista",
		previewLabel: "Vista previa del código QR generado",
		generationError:
			"No se pudo generar el código QR. Revisa el contenido y los colores e inténtalo de nuevo.",
		downloadPng: "Descargar PNG",
		downloadSvg: "Descargar SVG",
	},
	trust: {
		label: "Por qué usar QRGenerator",
		items: [
			{ icon: "check", title: "Uso gratuito", description: "Sin límites ni tarifas" },
			{ icon: "check", title: "Sin cuenta", description: "Empieza de inmediato" },
			{
				icon: "shield",
				title: "Procesamiento local",
				description: "Tus datos permanecen en tu dispositivo",
			},
		],
	},
	faq: {
		heading: "Preguntas frecuentes",
		subheading: "Lo esencial sobre privacidad, formatos de archivo y escaneo confiable.",
		items: [
			{
				question: "¿Mi contenido se sube a algún servidor?",
				answer:
					"No. Los códigos QR se generan localmente en tu navegador, así que el texto ingresado no sale de tu dispositivo.",
			},
			{
				question: "¿Debo descargar PNG o SVG?",
				answer:
					"PNG funciona bien para sitios web, documentos y compartir. SVG conserva la nitidez a cualquier tamaño y es ideal para impresión o diseño.",
			},
			{
				question: "¿Cómo mantengo fácil de escanear mi código QR?",
				answer:
					"Usa un contraste fuerte entre los colores de primer plano y fondo. Prueba el archivo con más de una cámara antes de publicarlo.",
			},
		],
	},
	footer: {
		copyright: "© {year} QRGenerator",
		localProcessing: "Códigos QR generados localmente en tu navegador",
	},
};
