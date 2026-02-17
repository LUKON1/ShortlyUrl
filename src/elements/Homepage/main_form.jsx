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
import crossIcon from "../../assets/cross.svg";

function ShortenerForm() {
  const API_SHORTER = "/cut/shorter";
  const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
  const { t } = useTranslation();
  const { auth } = useAuth();
  const userId = auth?.userId;

  const axiosPrivate = useAxiosPrivate();

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [isAliasOpen, setIsAliasOpen] = useState(false);

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
            customAlias: customAlias ? customAlias : undefined,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const shortCode = response?.data?.shortCode;

        // Save anonymous link if user is not logged in
        if (!userId) {
          const anonymousLinks = JSON.parse(localStorage.getItem("anonymousLinks") || "[]");
          if (!anonymousLinks.includes(shortCode)) {
            anonymousLinks.push(shortCode);
            localStorage.setItem("anonymousLinks", JSON.stringify(anonymousLinks));
          }
        }

        const shortUrl = `${BASE_URL}/${shortCode}`;
        setShortUrl(shortUrl);
        setQrCodeDataUrl(response?.data?.qrCodeDataUrl);
      } catch (error) {
        if (!error?.response) {
          notificationRef.current?.addNotification(t("message.servererror"), 3000);
        } else if (error.response?.status === 429) {
          notificationRef.current?.addNotification(
            error.response.data.error || t("message.ratelimit"),
            5000
          );
        } else if (error.response?.status === 400) {
          notificationRef.current?.addNotification(
            error.response.data.error || t("message.invalidurl"),
            3000
          );
        } else if (error.response?.status === 409) {
          notificationRef.current?.addNotification(
            error.response.data.error || t("message.conflicterror"),
            3000
          );
        } else {
          notificationRef.current?.addNotification(t("message.urlcuterror"), 3000);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [urlTime, url, userId, axiosPrivate, axios, customAlias]
  );

  return (
    <>
      <Notifications ref={notificationRef} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 transition-all duration-200 ease-out md:gap-0 lg:gap-1.5"
      >
        <div className="mb-6 flex flex-col items-center gap-6 md:mb-18 md:flex-row md:gap-6">
          <div className="relative flex flex-col items-center">
            {url && (
              <button
                className="absolute top-1 left-1 z-10 flex cursor-pointer touch-manipulation items-center justify-center rounded-full p-0.5 md:top-2"
                onClick={() => setUrl("")}
                type="button"
              >
                <img
                  className="h-6 w-6 opacity-40 transition-opacity hover:opacity-100 dark:invert"
                  src={crossIcon}
                  alt="X"
                />
              </button>
            )}
            <motion.input
              ref={inputRef}
              className="text-1xl h-16 w-3xs max-w-5xl rounded-lg border-2 border-sky-400 bg-white p-2 text-center text-gray-900 shadow-md transition-none! focus:ring-2 focus:ring-sky-500 focus:outline-none md:w-[55vw] md:text-2xl lg:h-20 lg:w-[70vw] lg:text-3xl dark:border-sky-500 dark:bg-slate-800 dark:text-gray-100 dark:focus:ring-sky-400"
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
              className="motion-safe mt-6 flex w-3xs flex-col items-center justify-center gap-4 rounded-lg border border-sky-100 bg-white/95 px-4 py-2 shadow-sm backdrop-blur-sm md:absolute md:top-full md:left-0 md:mt-2.5 md:w-full md:min-w-130 md:flex-row md:justify-center md:gap-8 dark:border-slate-700 dark:bg-slate-800/95"
              style={{ zIndex: 100 }}
              initial={{ opacity: 0, transform: "translateY(100px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            >
              <div className="flex w-full items-center justify-center gap-3 md:w-auto">
                <p className="text-sm font-medium text-gray-600 md:text-base dark:text-gray-300">
                  {t("homepage.urlopt.urtime.liftimeword")}
                </p>
                <TimeDropdown
                  value={urlTime}
                  onChange={setUrlTime}
                  options={urlTimeOptions}
                  className="min-w-35"
                />
              </div>
              <div className="hidden h-4 w-px bg-sky-200 md:block dark:bg-slate-600"></div>
              {/* Alias section */}
              <div className="relative flex w-full items-center md:w-auto">
                {/* Close button - absolute, left of input */}
                {isAliasOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAliasOpen(false);
                      setCustomAlias("");
                    }}
                    className="absolute -left-5.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 text-gray-400 transition-colors hover:text-gray-600 md:-left-7 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <img
                      className="h-6 w-6 opacity-40 hover:opacity-100 dark:invert"
                      src={crossIcon}
                      alt="Close"
                    />
                  </button>
                )}
                <div
                  className={`flex flex-1 items-center overflow-hidden rounded-md border bg-sky-50/50 md:min-w-48 ${
                    isAliasOpen
                      ? "border-sky-300 dark:border-sky-700"
                      : "cursor-pointer border-sky-200 hover:border-sky-300 dark:border-slate-600 dark:hover:border-sky-700"
                  } dark:bg-slate-900/60`}
                  onClick={() => !isAliasOpen && setIsAliasOpen(true)}
                >
                  <span className="shrink-0 border-r border-sky-200 bg-sky-100/80 px-2 py-1.5 text-xs font-medium text-sky-700 select-none dark:border-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
                    {window.location.host}/
                  </span>
                  {!isAliasOpen ? (
                    <span className="px-2 py-1.5 text-sm text-gray-400 italic select-none dark:text-gray-500">
                      {t("homepage.urlopt.aliasPlaceholder")}
                    </span>
                  ) : (
                    <>
                      <input
                        type="text"
                        autoFocus
                        value={customAlias}
                        onChange={(e) =>
                          setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))
                        }
                        placeholder={t("homepage.urlopt.aliasPlaceholder")}
                        className="w-full min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder-gray-500"
                        maxLength={30}
                      />
                      {/* Character counter */}
                      <span
                        className={`mr-2 shrink-0 text-xs opacity-60 select-none ${
                          customAlias.length > 0 && customAlias.length < 4
                            ? "text-amber-500 dark:text-amber-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {customAlias.length}/30
                      </span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          <SubmitButton isLoading={isLoading} />
        </div>

        {shortUrl && (
          <div className="mb-30 flex flex-col items-center">
            <div className="mb-30 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-6">
              <motion.div
                className="text-1xl box-border flex h-16 w-3xs max-w-5xl flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-green-500 bg-green-50 p-2 text-center font-semibold text-green-700 shadow-lg transition-none! md:w-[55vw] md:text-2xl lg:h-20 lg:w-[70vw] lg:text-3xl dark:border-green-400 dark:bg-slate-800 dark:text-green-300"
                initial={{ opacity: 0, transform: "translateY(100px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              >
                <span className="select-all">{shortUrl}</span>
              </motion.div>
              <motion.div
                className="motion-safe"
                initial={{ opacity: 0, transform: "translateY(100px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              >
                <CopyButton shortUrl={shortUrl} />
              </motion.div>
            </div>
            <motion.div
              className="motion-safe flex flex-col gap-5 md:flex-col-reverse md:gap-8"
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
