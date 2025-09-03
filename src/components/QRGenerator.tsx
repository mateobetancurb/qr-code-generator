import QRCode from "qrcode";
import {
	Download,
	Palette,
	Maximize as Resize,
	Link,
	// Upload,
	// X,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import type { QROptions } from "../interfaces";
import { generateFilename, sizeMap } from "../utils";

const QRGenerator: React.FC = () => {
	const [options, setOptions] = useState<QROptions>({
		text: "https://example.com",
		size: "medium",
		foregroundColor: "#000000",
		backgroundColor: "#ffffff",
		logo: undefined,
	});
	const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
	// const [logoFile, setLogoFile] = useState<File | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	// const fileInputRef = useRef<HTMLInputElement>(null);

	const generateQRCode = async (logoDataURL?: string) => {
		if (!options.text.trim()) return;

		try {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			await QRCode.toCanvas(canvas, options.text, {
				width: sizeMap[options.size],
				margin: 2,
				color: {
					dark: options.foregroundColor,
					light: options.backgroundColor,
				},
			});

			// add logo if provided
			if (logoDataURL) {
				const logo = new Image();
				logo.onload = () => {
					const logoSize = sizeMap[options.size] * 0.2; // logo is 20% of qr code size
					const x = (canvas.width - logoSize) / 2;
					const y = (canvas.height - logoSize) / 2;

					// create a white background circle for the logo
					ctx.fillStyle = options.backgroundColor;
					ctx.beginPath();
					ctx.arc(
						canvas.width / 2,
						canvas.height / 2,
						logoSize / 2 + 8,
						0,
						2 * Math.PI
					);
					ctx.fill();

					// draw the logo
					ctx.drawImage(logo, x, y, logoSize, logoSize);

					// update the data url with the logo
					const dataURL = canvas.toDataURL("image/png");
					setQrCodeDataURL(dataURL);
				};
				logo.src = logoDataURL;
			} else {
				const dataURL = canvas.toDataURL("image/png");
				setQrCodeDataURL(dataURL);
			}
		} catch (error) {
			console.error("Error generating QR code:", error);
		}
	};

	// const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	const file = event.target.files?.[0];
	// 	if (file && file.type.startsWith("image/")) {
	// 		setLogoFile(file);
	// 		const reader = new FileReader();
	// 		reader.onload = (e) => {
	// 			const logoDataURL = e.target?.result as string;
	// 			setOptions({ ...options, logo: logoDataURL });
	// 		};
	// 		reader.readAsDataURL(file);
	// 	}
	// };

	// const removeLogo = () => {
	// 	setLogoFile(null);
	// 	setOptions({ ...options, logo: undefined });
	// 	if (fileInputRef.current) {
	// 		fileInputRef.current.value = "";
	// 	}
	// };

	useEffect(() => {
		generateQRCode(options.logo);
	}, [options]);

	const downloadQR = (format: "png" | "svg") => {
		const filename = generateFilename(options.text);
		if (format === "png" && qrCodeDataURL) {
			const link = document.createElement("a");
			link.download = `${filename}.png`;
			link.href = qrCodeDataURL;
			link.click();
		} else if (format === "svg") {
			QRCode.toString(options.text, {
				type: "svg",
				width: sizeMap[options.size],
				margin: 2,
				color: {
					dark: options.foregroundColor,
					light: options.backgroundColor,
				},
			}).then((svg) => {
				const blob = new Blob([svg], { type: "image/svg+xml" });
				const link = document.createElement("a");
				link.download = `${filename}.svg`;
				link.href = URL.createObjectURL(blob);
				link.click();
				URL.revokeObjectURL(link.href);
			});
		}
	};

	return (
		<section
			id="generator"
			className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
		>
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
						QR Code Generator
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Customize your QR code with different sizes, colors, and download
						formats
					</p>
				</div>

				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
						{/* controls */}
						<div className="space-y-6">
							<div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
								<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
									<Link className="w-5 h-5 mr-2 text-green-500" />
									Content
								</h3>
								<div className="space-y-4">
									<div>
										<label
											htmlFor="text"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											Text or URL
										</label>
										<textarea
											id="text"
											value={options.text}
											onChange={(e) =>
												setOptions({ ...options, text: e.target.value })
											}
											className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
											rows={3}
											placeholder="Enter text or URL to generate QR code"
										/>
									</div>
								</div>
							</div>

							{/* <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
								<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
									<Upload className="w-5 h-5 mr-2 text-green-500" />
									Brand Logo
								</h3>
								<div className="space-y-4">
									{!logoFile ? (
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												Upload Logo (Optional)
											</label>
											<div
												onClick={() => fileInputRef.current?.click()}
												className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 dark:hover:border-green-400 cursor-pointer transition-all duration-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												<div className="text-center">
													<Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
													<p className="text-sm text-gray-600 dark:text-gray-300">
														Click to upload your logo
													</p>
													<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
														PNG, JPG, or SVG (max 5MB)
													</p>
												</div>
											</div>
											<input
												ref={fileInputRef}
												type="file"
												accept="image/*"
												onChange={handleLogoUpload}
												className="hidden"
											/>
										</div>
									) : (
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												Uploaded Logo
											</label>
											<div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
												<img
													src={options.logo}
													alt="Logo preview"
													className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
												/>
												<div className="flex-1">
													<p className="text-sm font-medium text-gray-800 dark:text-white truncate">
														{logoFile.name}
													</p>
													<p className="text-xs text-gray-500 dark:text-gray-400">
														{(logoFile.size / 1024).toFixed(1)} KB
													</p>
												</div>
												<button
													onClick={removeLogo}
													className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
												>
													<X className="w-4 h-4" />
												</button>
											</div>
											<button
												onClick={() => fileInputRef.current?.click()}
												className="mt-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200"
											>
												Change logo
											</button>
											<input
												ref={fileInputRef}
												type="file"
												accept="image/*"
												onChange={handleLogoUpload}
												className="hidden"
											/>
										</div>
									)}
								</div>
							</div> */}
							<div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
								<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
									<Resize className="w-5 h-5 mr-2 text-green-500" />
									Size
								</h3>
								<select
									value={options.size}
									onChange={(e) =>
										setOptions({
											...options,
											size: e.target.value as
												| "small"
												| "medium"
												| "large"
												| "xlarge",
										})
									}
									className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
								>
									<option value="small">Small (200x200)</option>
									<option value="medium">Medium (300x300)</option>
									<option value="large">Large (400x400)</option>
									<option value="xlarge">Extra Large (500x500)</option>
								</select>
							</div>

							<div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
								<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
									<Palette className="w-5 h-5 mr-2 text-green-500" />
									Colors
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="foreground"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											Foreground
										</label>
										<div className="flex items-center space-x-3">
											<input
												id="foreground"
												type="color"
												value={options.foregroundColor}
												onChange={(e) =>
													setOptions({
														...options,
														foregroundColor: e.target.value,
													})
												}
												className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
											/>
											<input
												type="text"
												value={options.foregroundColor}
												onChange={(e) =>
													setOptions({
														...options,
														foregroundColor: e.target.value,
													})
												}
												className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="background"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
										>
											Background
										</label>
										<div className="flex items-center space-x-3">
											<input
												id="background"
												type="color"
												value={options.backgroundColor}
												onChange={(e) =>
													setOptions({
														...options,
														backgroundColor: e.target.value,
													})
												}
												className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
											/>
											<input
												type="text"
												value={options.backgroundColor}
												onChange={(e) =>
													setOptions({
														...options,
														backgroundColor: e.target.value,
													})
												}
												className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* preview and download */}
						<div className="space-y-6">
							<div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
								<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
									Preview
								</h3>
								<div className="flex justify-center mb-6">
									<div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
										<canvas
											ref={canvasRef}
											className="max-w-full h-auto rounded-lg shadow-md"
											style={{ display: qrCodeDataURL ? "block" : "none" }}
										/>
										{!qrCodeDataURL && (
											<div className="w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
												<span className="text-gray-500 dark:text-gray-400">
													Enter text to generate QR code
												</span>
											</div>
										)}
									</div>
								</div>

								{qrCodeDataURL && (
									<div className="flex flex-col sm:flex-row gap-4 justify-center">
										<button
											onClick={() => downloadQR("png")}
											className="flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:cursor-pointer"
										>
											<Download className="w-5 h-5 mr-2" />
											Download PNG
										</button>
										<button
											onClick={() => downloadQR("svg")}
											className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:cursor-pointer"
										>
											<Download className="w-5 h-5 mr-2" />
											Download SVG
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default QRGenerator;
