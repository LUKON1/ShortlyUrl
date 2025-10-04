import { QRCode } from "react-qr-code";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

function Qrgen({ ShortUrl, qrContainerRef, notificationRef }) {
	const { t } = useTranslation();
	const [pngUrl, setPngUrl] = useState(null);
	const isConverting = useRef(false);

	useEffect(() => {
		// Очищаем предыдущий URL
		return () => {
			if (pngUrl) {
				URL.revokeObjectURL(pngUrl);
			}
		};
	}, [pngUrl]);

	useEffect(() => {
		if (!ShortUrl) {
			// Если нет URL, очищаем состояние
			if (pngUrl) {
				URL.revokeObjectURL(pngUrl);
				setPngUrl(null);
			}
			return;
		}

		// Сбрасываем флаг конвертации
		isConverting.current = false;

		const convertSvgToPng = () => {
			if (isConverting.current || !qrContainerRef?.current) return;

			isConverting.current = true;

			// Находим SVG элемент
			const svgElement = qrContainerRef.current.querySelector("svg");
			if (!svgElement) {
				isConverting.current = false;
				return;
			}

			// Получаем размеры
			const width = svgElement.getAttribute("width") || 256;
			const height = svgElement.getAttribute("height") || 256;

			// Преобразуем SVG в строку
			const svgString = new XMLSerializer().serializeToString(svgElement);

			// Создаём canvas
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");

			// Создаём изображение из SVG
			const img = new Image();
			img.src = URL.createObjectURL(
				new Blob([svgString], { type: "image/svg+xml" })
			);

			img.onload = () => {
				// Рисуем SVG на canvas
				ctx.drawImage(img, 0, 0, width, height);

				// Преобразуем canvas в PNG
				const newPngUrl = canvas.toDataURL("image/png");
				setPngUrl(newPngUrl);

				// Освобождаем память
				URL.revokeObjectURL(img.src);
				isConverting.current = false;
			};

			img.onerror = () => {
				notificationRef.current?.addNotification(
					"Ошибка при загрузке QR",
					3000
				);
				URL.revokeObjectURL(img.src);
				isConverting.current = false;
			};
		};

		// Запускаем конвертацию с небольшой задержкой
		const timer = setTimeout(convertSvgToPng, 100);

		return () => {
			clearTimeout(timer);
		};
	}, [ShortUrl, qrContainerRef, notificationRef]);

	if (!ShortUrl) return null;

	return (
		<div
			ref={qrContainerRef}
			className="flex flex-col items-center relative"
		>
			{/* Всегда рендерим SVG для генерации, но делаем его невидимым */}
			<div className="invisible absolute">
				<QRCode
					value={ShortUrl}
					size={256}
					bgColor={"#fff1f2"}
					fgColor={"#881337"}
					level="M"
				/>
			</div>

			{/* Показываем PNG когда он готов */}
			{pngUrl ? (
				<img
					src={pngUrl}
					alt="QR код"
					className="w-64 h-64 object-contain user-select-all"
				/>
			) : (
				// Показываем placeholder пока генерируется PNG
				<div className="w-64 h-64 flex items-center justify-center bg-rose-50 rounded-lg">
					<span className="text-rose-300">Downloading...</span>
				</div>
			)}
		</div>
	);
}

export default Qrgen;
