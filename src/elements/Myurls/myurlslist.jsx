import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";
import axios from "../../api/axios";
import Notifications from "../shared/messagewindow";
function Urlslist() {
  const API_MYURLS = "/myurls"
  const { t } = useTranslation();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const notificationRef = useRef();

  const displayedUrls = useMemo(() => {
    return searchTerm
      ? urls.filter((url) =>
        url.longUrl.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : urls;
  }, [searchTerm, urls]);


  useEffect(() => {
    fetchUrls();
  }, []);


  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_MYURLS);
      const data = await response?.data;
      setUrls(data);
    } catch (error) {
      console.log("ошибка запроса")
      notificationRef.current?.addNotification(t("myurls.loaderr"), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Notifications ref={notificationRef}/>
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

      {loading ? (
        <div className="flex justify-center mt-20 w-full max-w-5xl  min-h-[100vh]">
          <p className="text-4xl font-bold text-rose-700">
            {t("myurls.loading")}
          </p>
        </div>
      ) : urls.length === 0 ? (
        <div className="flex justify-center mt-20 w-full max-w-5xl  min-h-[100vh]">
          <p className="text-4xl font-bold text-rose-700">
            {t("myurls.nourls")}
          </p>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            placeholder={t("myurls.search")}
            className="mb-4 p-3 border border-gray-300 rounded-md w-full max-w-5xl text-lg"
          />
          <ul className="w-full max-w-5xl">
            {displayedUrls.map((url) => (
              
              <li
                key={url.id}
                className="bg-rose-100 rounded-md shadow-md p-4 sm:p-6 mb-4 mx-2 lg:mx-0"
              >
                <div className="flex justify-between items-center">
                  <span className="select-all text-2xl sm:text-3xl md:text-4xl font-bold text-rose-800 hover:text-rose-600 transition-colors">
                    {url.shortUrl}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(url.shortUrl);
                    }}
                    className="transition-all duration-200 ease-out
                       hover:bg-rose-400 active:bg-rose-500 bg-rose-300
                        shadow-md hover:shadow-lg h-12 sm:h-14 md:h-16
                        text-base sm:text-lg md:text-xl
                        p-3 sm:p-4 rounded-md text-rose-950 font-extrabold flex items-center"
                  >
                    {t("myurls.copy")}
                  </button>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-gray-500 mt-1">
                  {url.longUrl}
                </p>
                <div className="flex justify-between mt-2">
                  <div
                    className={`py-2  px-6 -ml-4 -mb-4 sm:-mb-6 rounded-tr-4xl sm:-ml-6 md:-ml-6 font-extrabold ${
                      dayjs(url.expiredAt).isAfter(dayjs())
                        ? "bg-green-300 text-green-900"
                        : "bg-red-300 text-red-900"
                    } `}
                  >
                    <p className="text-lg sm:text-xl md:text-2xl">
                      {dayjs(url.expiredAt).isAfter(dayjs())
                        ? t("myurls.isexpiredF")
                        : t("myurls.isexpiredT")}
                    </p>
                    <span className="text-base sm:text-lg md:text-xl text-gray-500">
                      {formatDate(url.createdAt)} -- {formatDate(url.expiredAt)}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-extrabold">
                      {t("myurls.clicks")} {url.urlClicks}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
    </>
  );
}
export default Urlslist;