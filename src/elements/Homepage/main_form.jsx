import { useState, useEffect, useRef, useCallback } from "react";
import CopyButton from "./copy_button.jsx";
import SubmitButton from "./submit_button.jsx";
import Qrgen from "./qr_gen.jsx";
import LoadQR_Button from "./loadQR_Button.jsx";
import Notifications from "../shared/messagewindow.jsx";
import { useTranslation } from "react-i18next";
import { containsMyDomain } from "../../utils/containsMyDomain.js";
import axios from "../../api/axios.js";
import useAuth from "../../utils/useAuth.js";
import useAxiosPrivate from "../../utils/useAxiosPrivate.js";

function ShortenerForm() {
    const API_SHORTER = "/cut/shorter";
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { t } = useTranslation();
    const { auth } = useAuth();
    const userId = auth?.userId;

    const axiosPrivate = useAxiosPrivate();

    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

    const notificationRef = useRef();
    const inputRef = useRef();
    const urlTimeOptions = [
        { value: 2592000, label: t("homepage.urlopt.urtime.month") },
        { value: 604800, label: t("homepage.urlopt.urtime.week") },
        { value: 86400, label: t("homepage.urlopt.urtime.day") },
        { value: 3600, label: t("homepage.urlopt.urtime.hour") }
    ];
    const [urlTime, setUrlTime] = useState(urlTimeOptions[0].value);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            if (!url) {
                notificationRef.current?.addNotification(t("message.urlblank"), 3000);
                return;
            }

            try {
                if (containsMyDomain(url)) {
                    throw new Error();
                }
                setIsLoading(true);

                const currentAxiosInstance = userId ? axiosPrivate : axios;

                const response = await currentAxiosInstance.post(
                    API_SHORTER,
                    JSON.stringify({
                        url: url,
                        urlTime: urlTime
                    }),
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const shortCode = response?.data?.shortCode;
                if (shortCode.length !== 7) {
                    throw new Error();
                }

                const shortUrl = `${BASE_URL}/${shortCode}`;
                setShortUrl(shortUrl);
                setQrCodeDataUrl(response?.data?.qrCodeDataUrl);
            } catch (error) {
                notificationRef.current?.addNotification(t("message.urlcuterror"), 3000);
            } finally {
                setIsLoading(false);
            }
        },
        [urlTime, url, userId, axiosPrivate, axios]
    );

    return (
        <div>
            <Notifications ref={notificationRef} />
            <form
                onSubmit={handleSubmit}
                className="flex flex-col transition-all duration-200 ease-out"
            >
                <div className="mb-6 flex flex-col items-center gap-40 md:mb-18 md:flex-row md:gap-6">
                    <div className="felx relative flex-col">
                        {url && (
                            <button className="absolute z-10 p-1" onClick={() => setUrl("")} type="button">
                                <img
                                    className="h-full w-8 hover:cursor-pointer lg:w-10 dark:invert"
                                    src="/src/assets/cross.svg"
                                    alt="X"
                                />
                            </button>
                        )}
                        <input
                            ref={inputRef}
                            className="text-1xl lg:w-[70vw h-16 w-3xs max-w-5xl rounded-lg border-2 border-sky-400 dark:border-sky-500 p-2 text-center transition-all duration-200 ease-out md:w-[55vw] md:text-2xl lg:h-20 lg:text-3xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:outline-none"
                            type="url"
                            value={url}
                            onChange={(e) => {
                                const url = e?.target.value;
                                setUrl(url);
                            }}
                            placeholder={t("homepage.placeholder")}
                        />
                        <div className="absolute mt-2.5 flex w-full flex-col justify-center gap-x-2.5 gap-y-6 rounded-lg border-2 border-sky-400 dark:border-sky-500 bg-white dark:bg-slate-800 shadow-md px-1 py-2 text-xs focus:outline-none md:flex-row md:text-lg lg:gap-x-10 lg:text-2xl text-gray-900 dark:text-gray-100">
                            <div className="flex flex-row justify-between md:justify-normal md:gap-2">
                                <p>{t("homepage.urlopt.urtime.liftimeword")}</p>
                                <select
                                    className="w-30 text-center md:w-20 lg:w-35 bg-rose-100 dark:bg-slate-700 rounded px-2 py-1 border border-sky-400 dark:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                    value={urlTime}
                                    onChange={(e) => {
                                        setUrlTime(Number(e?.target.value));
                                    }}
                                >
                                    {urlTimeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <SubmitButton isLoading={isLoading} />
                </div>

                {shortUrl && (
                    <div className="mb-30 flex flex-col items-center">
                        <div className="mb-30 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-6">
                            <div className="text-1xl lg:w-[70vw box-border flex h-16 w-3xs max-w-5xl flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-slate-800 p-2 text-center transition-all duration-200 ease-out md:w-[55vw] md:text-2xl lg:h-20 lg:text-3xl shadow-lg text-green-700 dark:text-green-300 font-semibold">
                                <span className="select-all">{shortUrl}</span>
                            </div>
                            <div className="transition-all duration-200 ease-out">
                                <CopyButton shortUrl={shortUrl} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 transition-all duration-200 ease-out md:flex-col-reverse md:gap-8">
                            <Qrgen qrCodeDataUrl={qrCodeDataUrl} />
                            <LoadQR_Button qrCodeDataUrl={qrCodeDataUrl} url={url} />
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
export default ShortenerForm;
