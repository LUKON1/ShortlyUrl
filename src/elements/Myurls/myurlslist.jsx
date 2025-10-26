import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";

function Urlslist({ urls, notificationRef, getMyUrls, isLoading }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const displayedUrls = useMemo(() => {
        return searchTerm
            ? urls.filter((urlItem) => urlItem.url.toLowerCase().includes(searchTerm.toLowerCase()))
            : urls;
    }, [searchTerm, urls]);

    return (
        <>
            <div className="flex w-full flex-col items-center">
                <>
                    <div className="flex w-full max-w-5xl flex-row items-center h-12 mb-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                            placeholder={t("myurls.search")}
                            className="w-full max-w-5xl rounded-lg h-full rounded-r-none border-2 border-sky-400 dark:border-sky-500 px-3 text-lg focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500"
                        />
                        <button
                            onClick={getMyUrls}
                            className="rounded-lg rounded-l-none border-2 border-l-0 h-full w-12 border-sky-400 dark:border-sky-500 p-1 bg-sky-400 dark:bg-sky-500 hover:bg-sky-500 dark:hover:bg-sky-600 transition-colors"
                            type="button"
                        >
                            <img
                                className="hover:cursor-pointer dark:invert"
                                src="/src/assets/reload.svg"
                                alt={t("myurls.refresh")}
                            />
                        </button>
                    </div>
                    {isLoading ? (
                        <div className="flex grow items-center justify-center text-2xl text-rose-900 dark:text-rose-400">
                            {t("myurls.loading")}
                        </div>
                    ) : (
                      <>
                        {displayedUrls.length > 0 ? (<ul className="w-full max-w-5xl">
                            {displayedUrls.map((urlItem) => (
                                <li
                                    key={urlItem._id}
                                    className="mx-2 mb-4 rounded-lg bg-white dark:bg-slate-800 p-4 shadow-lg border border-gray-200 dark:border-slate-700 sm:p-6 lg:mx-0 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-rose-700 dark:text-rose-400 transition-colors select-all hover:text-rose-600 dark:hover:text-rose-300 sm:text-3xl md:text-4xl">
                                            {`${import.meta.env.VITE_BASE_URL}/${urlItem.shortCode}`}
                                        </span>
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
                                            className="flex h-12 items-center rounded-lg bg-rose-300 dark:bg-rose-500 p-3 text-base font-extrabold text-white dark:text-slate-900 shadow-md transition-all duration-200 ease-out hover:bg-rose-400 dark:hover:bg-rose-600 hover:shadow-lg active:bg-rose-500 dark:active:bg-rose-700 sm:h-14 sm:p-4 sm:text-lg md:h-16 md:text-xl"
                                        >
                                            {t("myurls.copy")}
                                        </button>
                                    </div>
                                    <p className="mt-1 text-base text-gray-600 dark:text-gray-400 sm:text-lg md:text-xl">
                                        {urlItem.url}
                                    </p>
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
                                            <span className="text-base text-gray-600 dark:text-gray-400 sm:text-lg md:text-xl">
                                                {formatDate(urlItem.createdAt)} --{" "}
                                                {formatDate(urlItem.expiredAt)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-lg font-extrabold text-gray-700 dark:text-gray-300 sm:text-xl md:text-2xl">
                                                {t("myurls.clicks")} {urlItem.clicks}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>):(<p className="text-xl text-rose-900 dark:text-rose-400">{t("myurls.nourls")}</p>)}
                      </>
                    )}
                </>
            </div>
        </>
    );
}
export default Urlslist;
