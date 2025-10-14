import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

function Qrgen({ ShortUrl, qrContainerRef, notificationRef }) {
	const { t } = useTranslation();
	const [pngUrl, setPngUrl] = useState(null);
	const tempSvgContainerRef = useRef(null);
	const isConverting = useRef(false);

	useEffect(() => {
		return () => {
			if (pngUrl) {
				URL.revokeObjectURL(pngUrl);
			}
		};
	}, [pngUrl]);

	useEffect(() => {
		if (!ShortUrl) {
			if (pngUrl) {
				URL.revokeObjectURL(pngUrl);
				setPngUrl(null);
			}
			return;
		}

		isConverting.current = false;

		const convertSvgToPng = () => {
			if (isConverting.current || !tempSvgContainerRef?.current) return;

			isConverting.current = true;

			const svgElement = tempSvgContainerRef.current.querySelector("svg");
			if (!svgElement) {
				isConverting.current = false;
				return;
			}

			const width = svgElement.getAttribute("width") || 256;
			const height = svgElement.getAttribute("height") || 256;

			const svgString = new XMLSerializer().serializeToString(svgElement);

			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");

			const img = new Image();
			img.src = URL.createObjectURL(
				new Blob([svgString], { type: "image/svg+xml" })
			);

			img.onload = () => {
				ctx.drawImage(img, 0, 0, width, height);

				const newPngUrl = canvas.toDataURL("image/png");
				setPngUrl(newPngUrl);

				URL.revokeObjectURL(img.src);
				isConverting.current = false;
			};

			img.onerror = () => {
				notificationRef.current?.addNotification(
					t("message.qrdownloaderror"),
					3000
				);
				URL.revokeObjectURL(img.src);
				isConverting.current = false;
			};
		};

		const timer = setTimeout(convertSvgToPng, 100);

		return () => {
			clearTimeout(timer);
		};
	}, [ShortUrl, notificationRef]);

	if (!ShortUrl) return null;

	return (
		<div
			ref={qrContainerRef}
			className="flex flex-col items-center relative"
		>
			<div ref={tempSvgContainerRef} className="invisible absolute">
				<QRCodeSVG
					value={ShortUrl}
					size={256}
					bgColor={"#fff1f2"}
					fgColor={"#881337"}
					level="M"
				/>
			</div>

			{pngUrl ? (
				<img
					src={pngUrl}
					alt="QR код"
					className="w-64 h-64 object-contain user-select-all"
				/>
			) : (
				<div className="w-64 h-64 flex items-center justify-center bg-rose-50 rounded-lg">
					<span className="text-rose-300">Downloading...</span>
				</div>
			)}
		</div>
	);
}

export default Qrgen;
