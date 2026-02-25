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
import SettingsPanel from "./SettingsPanel.jsx";
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
  const [utm, setUtm] = useState({ source: "", medium: "", campaign: "", term: "", content: "" });

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

        let finalUrl = url;
        try {
          // Add UTM tags to finalUrl if they exist
          const parsedUrl = new URL(finalUrl);

          if (utm.source) parsedUrl.searchParams.set("utm_source", utm.source);
          if (utm.medium) parsedUrl.searchParams.set("utm_medium", utm.medium);
          if (utm.campaign) parsedUrl.searchParams.set("utm_campaign", utm.campaign);
          if (utm.term) parsedUrl.searchParams.set("utm_term", utm.term);
          if (utm.content) parsedUrl.searchParams.set("utm_content", utm.content);

          finalUrl = parsedUrl.toString();
        } catch (e) {
          console.error("Invalid URL format for UTM appending", e);
          // If URL cannot be parsed, let it be just the string, the backend will validate it
        }

        setIsLoading(true);

        const currentAxiosInstance = userId ? axiosPrivate : axios;

        const response = await currentAxiosInstance.post(
          API_SHORTER,
          JSON.stringify({
            url: finalUrl,
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
    [urlTime, url, userId, axiosPrivate, axios, customAlias, utm]
  );

  return (
    <>
      <Notifications ref={notificationRef} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Top row: input left + submit button right (desktop) */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto] md:items-start md:gap-6">
          {/* Left column: input + settings */}
          <div className="flex flex-col items-center gap-4 md:max-w-6xl md:min-w-[40vw] md:items-stretch lg:min-w-[55vw]">
            {/* Input */}
            <div className="relative flex flex-col items-center md:items-stretch">
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
                className="text-1xl h-16 w-3xs rounded-lg border-2 border-sky-400 bg-white p-2 text-center text-gray-900 shadow-md transition-none! focus:ring-2 focus:ring-sky-500 focus:outline-none md:h-16 md:w-full md:text-2xl lg:h-20 lg:text-3xl dark:border-sky-500 dark:bg-slate-800 dark:text-gray-100 dark:focus:ring-sky-400"
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
            </div>

            {/* Submit button - mobile only, between input and settings */}
            <div className="block md:hidden">
              <SubmitButton isLoading={isLoading} />
            </div>

            {/* Settings panel */}
            <motion.div
              className="motion-safe w-3xs md:w-full"
              initial={{ opacity: 0, transform: "translateY(100px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            >
              <SettingsPanel
                urlTime={urlTime}
                setUrlTime={setUrlTime}
                urlTimeOptions={urlTimeOptions}
                customAlias={customAlias}
                setCustomAlias={setCustomAlias}
                utm={utm}
                setUtm={setUtm}
              />
            </motion.div>
          </div>

          {/* Submit button - desktop only, right column */}
          <div className="hidden md:block">
            <SubmitButton isLoading={isLoading} />
          </div>
        </div>

        {/* Result: short URL + copy + QR */}
        {shortUrl && (
          <div className="mb-30 flex flex-col items-center">
            <div className="mb-30 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-6">
              <motion.div
                className="text-1xl box-border flex h-16 w-3xs flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-green-500 bg-green-50 p-2 text-center font-semibold text-green-700 shadow-lg transition-none! md:max-w-6xl md:min-w-[40vw] md:items-stretch md:text-2xl lg:h-20 lg:min-w-[55vw] lg:text-3xl dark:border-green-400 dark:bg-slate-800 dark:text-green-300"
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
