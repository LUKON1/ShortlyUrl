import { useState, useEffect } from "react";
import { generateQRDataUrl } from "../../utils/qrHelper";

function Qrgen({ shortUrl, qrContainerRef }) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const generate = async () => {
      if (shortUrl) {
        const dataUrl = await generateQRDataUrl(shortUrl);
        if (isMounted) {
          setQrCodeDataUrl(dataUrl);
        }
      }
    };
    generate();
    return () => {
      isMounted = false;
    };
  }, [shortUrl]);

  if (!qrCodeDataUrl) return null;
  return (
    <div ref={qrContainerRef} className="relative flex flex-col items-center">
      <img
        src={qrCodeDataUrl}
        alt="QR"
        className="user-select-all h-64 w-64 rounded-4xl border-5 border-rose-300 object-contain dark:border-[#00a6f4]"
      />
    </div>
  );
}

export default Qrgen;
