import { useTranslation } from "react-i18next";

function LoadQR_Button({ qrContainerRef, notificationRef, url }) {
	const { t } = useTranslation();

	const handleLoadQR = () => {
		if (!qrContainerRef?.current) {
			notificationRef.current?.addNotification(
				t("message.qrdownloaderror"),
				3000
			);
			return;
		}

		const svgElement = qrContainerRef.current.querySelector("svg");

		if (!svgElement) {
			notificationRef.current?.addNotification(
				t("message.qrdownloading"),
				3000
			);
			return;
		}

		const svgString = new XMLSerializer().serializeToString(svgElement);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		const svgSize = svgElement.getBoundingClientRect();
		canvas.width = svgSize.width * 2; // Увеличиваем разрешение для лучшего качества
		canvas.height = svgSize.height * 2;

		img.onload = () => {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			const urlFullDomain = new URL(url);
			const urlMainDomain = urlFullDomain.hostname;
			const domainParts = urlMainDomain.split(".");
			const baseDomain = domainParts.slice(-2).join(".");

			const link = document.createElement("a");
			link.href = canvas.toDataURL("image/png");
			link.download = `${baseDomain}-QRcode.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			URL.revokeObjectURL(img.src);
		};

		img.onerror = () => {
			notificationRef.current?.addNotification(
				t("message.qrdownloaderror"),
				3000
			);
			URL.revokeObjectURL(img.src);
		};

		img.src = URL.createObjectURL(new Blob([svgString], { type: "image/svg+xml" }));
	};

	return (
		<div>
			<button
				onClick={handleLoadQR}
				type="button"
				className="bg-rose-300 text-rose-950 hover:bg-rose-400 active:bg-rose-500
        transition duration-300 ease-in-out
        rounded-md h-16 lg:h-20 w-64 flex items-center justify-center
        shadow-md hover:shadow-lg 
        text-1xl md:text-2xl lg:text-3xl font-extrabold"
			>
				{t("homepage.downloadqr")}
			</button>
		</div>
	);
}

export default LoadQR_Button;
