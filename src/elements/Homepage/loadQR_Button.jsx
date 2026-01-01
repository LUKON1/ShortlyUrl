import { useTranslation } from "react-i18next";

function LoadQR_Button({ qrCodeDataUrl, url }) {
    const { t } = useTranslation();

    const handleLoadQR = () => {
        if (!qrCodeDataUrl) {
            return;
        }

        const urlFullDomain = new URL(url);
        const urlMainDomain = urlFullDomain.hostname;
        const domainParts = urlMainDomain.split(".");
        const baseDomain = domainParts.slice(-2).join(".");

        const link = document.createElement("a");
        link.href = qrCodeDataUrl;
        link.download = `${baseDomain}-QRcode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <button
                onClick={handleLoadQR}
                type="button"
                className="touch-manipulation transition-all duration-200 ease-out hover:bg-rose-400 dark:hover:bg-rose-600 active:bg-rose-500 dark:active:bg-rose-700 bg-rose-300 dark:bg-rose-500 shadow-lg hover:shadow-xl h-16 lg:h-20 w-64 text-1xl md:text-2xl lg:text-3xl p-4 rounded-lg text-slate-900 dark:text-white font-extrabold"
            >
                {t("homepage.downloadqr")}
            </button>
        </div>
    );
}

export default LoadQR_Button;
