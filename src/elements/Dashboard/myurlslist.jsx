import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";
import UrlAnalyticsChart from "./UrlAnalyticsChart";
import AppLoader from "../shared/AppLoader";

function Urlslist({ urls, notificationRef, getMyUrls, isLoading }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [openAnalyticsId, setOpenAnalyticsId] = useState(null);

  const displayedUrls = useMemo(() => {
    return searchTerm
      ? urls.filter((urlItem) => urlItem.url.toLowerCase().includes(searchTerm.toLowerCase()))
      : urls;
  }, [searchTerm, urls]);

  const toggleAnalytics = (id) => {
    setOpenAnalyticsId(openAnalyticsId === id ? null : id);
  };

  return (
    <>
      {/* svg optim */}
      <svg className="hidden">
        <symbol id="share" viewBox="0 0 24 24">
          <path
            fill="#FFFFFF"
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
          />
        </symbol>
      </svg>
      <svg className="hidden">
        <symbol id="clipboard" viewBox="0 0 24 24">
          <path
            fill="#FFFFFF"
            d="M21,8.94a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19.32.32,0,0,0-.09,0A.88.88,0,0,0,14.05,2H10A3,3,0,0,0,7,5V6H6A3,3,0,0,0,3,9V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V18h1a3,3,0,0,0,3-3V9S21,9,21,8.94ZM15,5.41,17.59,8H16a1,1,0,0,1-1-1ZM15,19a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V9A1,1,0,0,1,6,8H7v7a3,3,0,0,0,3,3h5Zm4-4a1,1,0,0,1-1,1H10a1,1,0,0,1-1-1V5a1,1,0,0,1,1-1h3V7a3,3,0,0,0,3,3h3Z"
          />
        </symbol>
      </svg>
      <svg className="hidden">
        <symbol id="qrcode" viewBox="0 0 24 24">
          <path
            fill="#FFFFFF"
            d="M9,10H4A1,1,0,0,1,3,9V4A1,1,0,0,1,4,3H9a1,1,0,0,1,1,1V9A1,1,0,0,1,9,10ZM21,9V4a1,1,0,0,0-1-1H15a1,1,0,0,0-1,1V9a1,1,0,0,0,1,1h5A1,1,0,0,0,21,9ZM10,20V15a1,1,0,0,0-1-1H4a1,1,0,0,0-1,1v5a1,1,0,0,0,1,1H9A1,1,0,0,0,10,20Z"
          />
          <path
            d="M21,14v5a2,2,0,0,1-2,2H14"
            style={{
              fill: "none",
              stroke: "#FFFFFF",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
            }}
          />
          <path
            d="M17,17H14V14h3ZM10,9V4A1,1,0,0,0,9,3H4A1,1,0,0,0,3,4V9a1,1,0,0,0,1,1H9A1,1,0,0,0,10,9Zm10,1H15a1,1,0,0,1-1-1V4a1,1,0,0,1,1-1h5a1,1,0,0,1,1,1V9A1,1,0,0,1,20,10ZM9,21H4a1,1,0,0,1-1-1V15a1,1,0,0,1,1-1H9a1,1,0,0,1,1,1v5A1,1,0,0,1,9,21Z"
            style={{
              fill: "none",
              stroke: "#FFFFFF",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
            }}
          />
        </symbol>
      </svg>
      <svg className="hidden">
        <symbol id="chart" viewBox="0 0 16 16">
          <path
            fill="#FFFFFF"
            d="M2,1 C2.51283143,1 2.93550653,1.38604429 2.9932722,1.88337975 L3,2 L3,13 L14,13 C14.5523,13 15,13.4477 15,14 C15,14.51285 14.613973,14.9355092 14.1166239,14.9932725 L14,15 L3,15 C1.94563773,15 1.08183483,14.18415 1.00548573,13.1492661 L1,13 L1,2 C1,1.44772 1.44772,1 2,1 Z M6,7 C6.51283143,7 6.93550653,7.38604429 6.9932722,7.88337975 L7,8 L7,10 C7,10.5523 6.55228,11 6,11 C5.48716857,11 5.06449347,10.613973 5.0067278,10.1166239 L5,10 L5,8 C5,7.44771 5.44772,7 6,7 Z M10,3 C10.5523,3 11,3.44772 11,4 L11,10 C11,10.5523 10.5523,11 10,11 C9.44771,11 9,10.5523 9,10 L9,4 C9,3.44772 9.44771,3 10,3 Z M14,5 C14.5523,5 15,5.44772 15,6 L15,10 C15,10.5523 14.5523,11 14,11 C13.4477,11 13,10.5523 13,10 L13,6 C13,5.44772 13.4477,5 14,5 Z"
          />
        </symbol>
      </svg>
      <svg className="hidden">
        <symbol id="clicks" viewBox="0 0 48 48">
          <rect width={48} height={48} fill="#FFFFFF" fillOpacity={0.01} />
          <path
            d="M24 4V12"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22 22L42 26L36 30L42 36L36 42L30 36L26 42L22 22Z"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M38.1421 9.85795L32.4853 15.5148"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.85787 38.1421L15.5147 32.4852"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 24H12"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.85783 9.85787L15.5147 15.5147"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
      </svg>
      <svg className="hidden">
        <symbol id="reload" viewBox="0 0 35 31.8">
          <path
            fill="#FFFFFF"
            d="M15.45 29.43c-3.62-.47 -7.16 -2.55 -9.29 -5.45 -1.65 -2.25 -2.66 -5.22 -2.66 -7.81 0 -.88 .02 -.87 -1.23 -.87 -.63 0 -.81 -.04 -.97 -.2 -.47 -.47 -.36 -.86 .57 -1.91 .32 -.36 1.32 -1.5 2.23 -2.55 1.67 -1.92 1.8 -2.05 1.92 -2.01 .17 .05 4.61 5.25 4.74 5.54 .17 .38 .03 .87 -.3 1.05 -.12 .07 -.57 .11 -1.09 .09 -1.3 -.03 -1.27 -.05 -1.27 .92 .01 1.6 .57 3.36 1.53 4.76 .46 .68 1.55 1.79 2.23 2.27 .8 .57 2.13 1.19 3.11 1.45 1.13 .31 3.17 .31 4.3 .01 1.39 -.37 2.72 -1.06 3.66 -1.89 .2 -.18 .41 -.33 .45 -.33 .09 0 2.8 3.13 2.88 3.33 .05 .14 -.79 .86 -1.86 1.57 -.76 .52 -2.57 1.33 -3.55 1.61 -1.14 .32 -2.52 .49 -3.85 .47 -.69 0 -1.38 -.03 -1.55 -.05z M26.53 19.98c-3.51 -4.02 -3.34 -3.78 -3.08 -4.28 .22 -.43 .43 -.5 1.58 -.5 .57 0 1.06 -.02 1.09 -.05 .08 -.08 -.11 -1.12 -.33 -1.9 -.89 -3.02 -3.53 -5.48 -6.64 -6.21 -1.12 -.26 -3.2 -.24 -4.25 .04 -.86 .23 -2.01 .74 -2.79 1.25 -.3 .19 -.59 .33 -.65 .3 -.22 -.1 -2.84 -3.26 -2.8 -3.37 .09 -.24 1.91 -1.37 2.89 -1.8 1.92 -.84 3.44 -1.16 5.54 -1.16 1.64 0 2.92 .19 4.28 .65 3.32 .111 5.93 3.28 7.75 6.45 .72 1.24 1.39 3.41 1.54 4.93 .04 .39 .12 .75 0.18 .79 .06 .04 .51 .08 .99 .08 .8 0 .9 .02 1.12 .25 .17 .16 .25 .35 .25 .58 0 .3 -.28 .66 -2.41 3.11 -1.33 1.52 -2.45 2.76 -2.5 2.76 -.04 0 -.84 -.87 -1.76 -1.92z"
          />
        </symbol>
      </svg>
      <div className="flex w-full flex-col items-center">
        <>
          <div className="mx-auto mb-4 flex h-12 w-full max-w-7xl flex-row items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder={t("myurls.search")}
              className="h-full w-full rounded-lg rounded-r-none border-2 border-sky-400 bg-white px-3 text-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-sky-500 dark:bg-slate-700 dark:text-gray-100"
            />
            <button
              onClick={getMyUrls}
              className="h-full w-12 rounded-lg rounded-l-none border-2 border-l-0 border-sky-400 bg-sky-400 p-1 transition-colors hover:bg-sky-500 dark:border-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600"
              type="button"
            >
              <svg fill="#FFFFFF" viewBox="0 0 35 31.8" className="hover:cursor-pointer">
                <use href="#reload"></use>
              </svg>
            </button>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <AppLoader />
            </div>
          ) : (
            <>
              {displayedUrls.length > 0 ? (
                <ul className="mx-auto w-full max-w-7xl">
                  {displayedUrls.map((urlItem, index) => (
                    <div key={urlItem._id}>
                      <li
                        className="animate-fadeinup mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-800"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex max-w-[64%] flex-col">
                            <p className="text-base font-bold text-sky-400 transition-colors select-all hover:text-sky-600 sm:text-lg md:text-xl dark:text-sky-500 dark:hover:text-sky-300">
                              {`${import.meta.env.VITE_BASE_URL}/${urlItem.shortCode}`}
                            </p>
                            <p className="mt-1 truncate text-sm text-gray-600 sm:text-base md:text-lg dark:text-gray-400">
                              {urlItem.url}
                            </p>
                          </div>
                          <div className="flex flex-row-reverse items-center gap-1.5">
                            {/* Share Button */}
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${import.meta.env.VITE_BASE_URL}/share/${urlItem.shortCode}`
                                );
                                notificationRef.current?.addNotification(
                                  t("myurls.share") + " " + t("homepage.copied"),
                                  2000
                                );
                              }}
                              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                              title={t("myurls.share")}
                            >
                              <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                                <use href="#share"></use>
                              </svg>
                            </button>
                            {/* QR Button */}
                            <button
                              type="button"
                              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                              onClick={() => {
                                const urlFullDomain = new URL(urlItem.url);
                                const urlMainDomain = urlFullDomain.hostname;
                                const domainParts = urlMainDomain.split(".");
                                const baseDomain = domainParts.slice(-2).join(".");
                                const link = document.createElement("a");
                                link.href = urlItem.qrCodeDataUrl;
                                link.download = `${baseDomain}-QRcode.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              title={t("myurls.downloadQr")}
                            >
                              <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                                <use href="#qrcode"></use>
                              </svg>
                            </button>
                            {/* Copy button */}
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${import.meta.env.VITE_BASE_URL}/${urlItem.shortCode}`
                                );
                                notificationRef.current?.addNotification(
                                  t("homepage.copied"),
                                  2000
                                );
                              }}
                              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                              title={t("myurls.copy")}
                            >
                              <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                                <use href="#clipboard"></use>
                              </svg>
                            </button>
                            {/* chart button */}
                            <button
                              onClick={() => toggleAnalytics(urlItem._id)}
                              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                              title={t("myurls.viewAnalytics")}
                            >
                              <svg fill="#FFFFFF" viewBox="0 0 16 16" className="p-1">
                                <use href="#chart"></use>
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div
                            className={`-mb-4 -ml-4 rounded-tr-4xl px-6 py-2 font-extrabold sm:-mb-6 sm:-ml-6 md:-ml-6 ${
                              dayjs(urlItem.expiredAt).isAfter(dayjs())
                                ? "bg-green-300 text-green-900"
                                : "bg-red-300 text-red-900"
                            } `}
                          >
                            <p className="text-lg sm:text-xl md:text-2xl">
                              {dayjs(urlItem.expiredAt).isAfter(dayjs())
                                ? t("myurls.isexpiredF")
                                : t("myurls.isexpiredT")}
                            </p>
                            <span className="text-base text-gray-600 sm:text-lg md:text-xl dark:text-gray-400">
                              {formatDate(urlItem.createdAt)} -- {formatDate(urlItem.expiredAt)}
                            </span>
                          </div>
                          <div
                            className="flex h-7 w-auto flex-row items-center gap-1 rounded-xl border border-sky-500 bg-sky-400 px-2 sm:h-9 md:h-12 dark:bg-sky-700"
                            title={t("myurls.clicks")}
                          >
                            <svg
                              fill="#FFFFFF"
                              className="h-7 w-7 p-1 sm:h-9 sm:w-9 md:h-12 md:w-12"
                              viewBox="0 0 48 48"
                            >
                              <use href="#clicks"></use>
                            </svg>
                            <p className="text-lg font-extrabold text-white sm:text-xl md:text-2xl">
                              {urlItem.clicks}
                            </p>
                          </div>
                        </div>
                      </li>
                      {openAnalyticsId === urlItem._id && (
                        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-800">
                          <UrlAnalyticsChart urlId={urlItem._id} />
                        </div>
                      )}
                    </div>
                  ))}
                </ul>
              ) : (
                <p className="text-xl text-rose-900 dark:text-rose-400">{t("myurls.nourls")}</p>
              )}
            </>
          )}
        </>
      </div>
    </>
  );
}
export default Urlslist;
