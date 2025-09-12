import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Urlslist() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { t } = useTranslation();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/myurls/`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      setUrls(data);
    } catch (error) {
      setError(`Ошибка загрузки: ${response.status}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={fetchUrls}
        className="transition-all duration-200 ease-out
           hover:bg-rose-400 active:bg-rose-500 bg-rose-300
            shadow-md hover:shadow-lg h-12
            lg:h-16  text-1xl md:text-2xl
            p-4  rounded-md text-rose-950 font-extrabold
            max-w-5xl mb-4   flex items-center justify-center w-full"
      >
        {t("myurls.refresh")}
      </button>

      {loading && <p className="text-xl text-rose-700">Loading...</p>}
      {error && <p className="text-xl text-red-700">{error}</p>}
      {!loading && !error && urls.length === 0 && (
        <p className="text-xl text-rose-700">{t("myurls.nourls")}</p>
      )}
      {!loading && !error && urls.length > 0 && (
        <ul className="w-full max-w-5xl">
          {urls.map((url) => (
            <li
              key={url.shortUrl}
              className="bg-rose-100 rounded-md shadow-md p-4 mb-4 mx-2 lg:mx-0"
            >
              <div className="flex justify-between items-center">
                <span className="select-all text-2xl font-bold text-rose-800 hover:text-rose-600 transition-colors">
                  {url.shortUrl}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(url.shortUrl);
                  }}
                  className="transition-all duration-200 ease-out
                     hover:bg-rose-400 active:bg-rose-500 bg-rose-300
                      shadow-md hover:shadow-lg h-10
                       text-1xl md:text-xl 
                      p-2 rounded-md text-rose-950 font-extrabold flex items-center"
                >
                  {t("myurls.copy")}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">{url.longUrl}</p>
              <div className="flex justify-between mt-2">
                <p className="text-gray-700">
                  {t("myurls.lifetime")} {url.urlTime}
                </p>
                <p className="text-gray-700">
                  {t("myurls.clicks")} {url.urlClicks}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Urlslist;
