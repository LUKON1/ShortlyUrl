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
		try {
			// Находим img элемент внутри контейнера
			const imgElement = qrContainerRef.current.querySelector("img");
			if (!imgElement || !imgElement.src) {
				notificationRef.current?.addNotification(
					t("message.qrdownloading"),
					3000
				);
				return;
			}
			const urlFullDomain = new URL(url);
			const urlMainDomain = urlFullDomain.hostname;
			const domainParts = urlMainDomain.split(".");
			const baseDomain = domainParts.slice(-2).join(".");
			// Создаём ссылку для скачивания

			const link = document.createElement("a");
			link.href = imgElement.src;
			link.download = `${baseDomain}-QRcode.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch {
			return;
		}
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
