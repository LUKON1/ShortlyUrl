import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
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
import TimeDropdown from "./time_dropdown.jsx";

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
    { value: 3600, label: t("homepage.urlopt.urtime.hour") },
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
            urlTime: urlTime,
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
    <>
      <Notifications ref={notificationRef} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-15 transition-all duration-200 ease-out md:gap-0 lg:gap-1.5"
      >
        <div className="mb-6 flex flex-col items-center gap-24 md:mb-18 md:flex-row md:gap-6">
          <div className="relative flex flex-col">
            {url && (
              <button
                className="absolute z-10 touch-manipulation p-1"
                onClick={() => setUrl("")}
                type="button"
              >
                <img
                  className="h-full w-8 hover:cursor-pointer lg:w-10 dark:invert"
                  src="/src/assets/cross.svg"
                  alt="X"
                />
              </button>
            )}
            <motion.input
              ref={inputRef}
              className="text-1xl h-16 w-3xs max-w-5xl rounded-lg border-2 border-sky-400 bg-white p-2 text-center text-gray-900 shadow-md transition-all duration-200 ease-out will-change-transform focus:ring-2 focus:ring-sky-500 focus:outline-none md:w-[55vw] md:text-2xl lg:h-20 lg:w-[70vw] lg:text-3xl dark:border-sky-500 dark:bg-slate-800 dark:text-gray-100 dark:focus:ring-sky-400"
              initial={{ opacity: 0, transform: "translateY(100px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              type="url"
              value={url}
              onChange={(e) => {
                const url = e?.target.value;
                setUrl(url);
              }}
              placeholder={t("homepage.placeholder")}
            />
            <motion.div
              className="absolute top-full left-0 mt-2.5 flex w-full flex-col items-center justify-center gap-4 rounded-xl border border-sky-100 bg-white/95 px-4 py-2 shadow-sm backdrop-blur-sm md:flex-row md:justify-between md:gap-8 dark:border-slate-700 dark:bg-slate-800/95"
              style={{ zIndex: 100 }}
              initial={{ opacity: 0, transform: "translateY(100px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            >
              <div className="flex w-full items-center justify-center gap-3 md:w-auto md:justify-start">
                <p className="text-sm font-medium text-gray-600 md:text-base dark:text-gray-300">
                  {t("homepage.urlopt.urtime.liftimeword")}
                </p>
                <TimeDropdown
                  value={urlTime}
                  onChange={setUrlTime}
                  options={urlTimeOptions}
                  className="min-w-[140px]"
                />
              </div>
            </motion.div>
          </div>
          <SubmitButton isLoading={isLoading} />
        </div>

        {shortUrl && (
          <div className="mb-30 flex flex-col items-center">
            <div className="mb-30 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-6">
              <motion.div
                className="text-1xl box-border flex h-16 w-3xs max-w-5xl flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-green-500 bg-green-50 p-2 text-center font-semibold text-green-700 shadow-lg will-change-transform md:w-[55vw] md:text-2xl lg:h-20 lg:w-[70vw] lg:text-3xl dark:border-green-400 dark:bg-slate-800 dark:text-green-300"
                initial={{ opacity: 0, transform: "translateY(100px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              >
                <span className="select-all">{shortUrl}</span>
              </motion.div>
              <motion.div
                className="transition-all duration-200 ease-out will-change-transform"
                initial={{ opacity: 0, transform: "translateY(100px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              >
                <CopyButton shortUrl={shortUrl} />
              </motion.div>
            </div>
            <motion.div
              className="flex flex-col gap-5 will-change-transform md:flex-col-reverse md:gap-8"
              initial={{ opacity: 0, transform: "translateY(100px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <Qrgen qrCodeDataUrl={qrCodeDataUrl} />
              <LoadQR_Button qrCodeDataUrl={qrCodeDataUrl} url={url} />
            </motion.div>
          </div>
        )}
      </form>
    </>
  );
}
export default ShortenerForm;
