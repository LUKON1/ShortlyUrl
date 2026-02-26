import { useTranslation } from "react-i18next";
import { generateQRDataUrl } from "../../utils/qrHelper";

function LoadQR_Button({ shortUrl, url }) {
  const { t } = useTranslation();

  const handleLoadQR = async () => {
    if (!shortUrl) {
      return;
    }

    const dataUrl = await generateQRDataUrl(shortUrl);
    if (!dataUrl) return;

    const urlFullDomain = new URL(url);
    const urlMainDomain = urlFullDomain.hostname;
    const domainParts = urlMainDomain.split(".");
    const baseDomain = domainParts.slice(-2).join(".");

    const link = document.createElement("a");
    link.href = dataUrl;
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
        className="text-1xl h-16 w-64 touch-manipulation rounded-lg bg-blue-400 p-4 font-extrabold text-white shadow-lg transition-all duration-200 ease-out hover:bg-blue-500 hover:shadow-xl active:bg-blue-600 md:text-2xl lg:h-20 lg:text-3xl dark:bg-rose-500 dark:text-white dark:hover:bg-rose-600 dark:active:bg-rose-700"
      >
        {t("homepage.downloadqr")}
      </button>
    </div>
  );
}

export default LoadQR_Button;
