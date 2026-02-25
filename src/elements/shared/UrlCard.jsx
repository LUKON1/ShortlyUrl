import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";
import ConfirmModal from "./ConfirmModal";
import UtmBuilder from "../Homepage/utm_builder";

function UrlCard({
  urlData,
  mode,
  onCopy,
  onShare,
  onDownloadQR,
  onToggleAnalytics,
  onToggleActive,
  onDelete,
  onUpdateTitle,
  onUpdateUrl,
  t,
  notificationRef,
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [editUrl, setEditUrl] = useState("");
  const [isEditingUtm, setIsEditingUtm] = useState(false);

  // Extract UTMs from current URL
  let initialUtms = { source: "", medium: "", campaign: "", term: "", content: "" };
  try {
    const parsed = new URL(urlData.url);
    initialUtms = {
      source: parsed.searchParams.get("utm_source") || "",
      medium: parsed.searchParams.get("utm_medium") || "",
      campaign: parsed.searchParams.get("utm_campaign") || "",
      term: parsed.searchParams.get("utm_term") || "",
      content: parsed.searchParams.get("utm_content") || "",
    };
  } catch (e) {}

  const [utmData, setUtmData] = useState(initialUtms);
  const hasAnyUtm = Object.values(initialUtms).some((val) => val.trim() !== "");

  const DONT_ASK_DELETE_KEY = "dontAskDeleteConfirmation";

  const checkDontAskAgain = () => {
    return sessionStorage.getItem(DONT_ASK_DELETE_KEY) === "true";
  };

  const handleDeleteClick = () => {
    if (checkDontAskAgain()) {
      // Если пользователь выбрал "больше не спрашивать", удаляем сразу
      if (onDelete) {
        onDelete();
      }
    } else {
      // Показываем модальное окно
      setIsDeleteModalOpen(true);
    }
  };

  const handleDontAskAgainChange = (checked) => {
    if (checked) {
      sessionStorage.setItem(DONT_ASK_DELETE_KEY, "true");
    } else {
      sessionStorage.removeItem(DONT_ASK_DELETE_KEY);
    }
  };

  const handleEditTitleClick = () => {
    if (isEditingTitle) {
      // Сохранить при повторном нажатии
      handleSaveTitle();
    } else {
      // Начать редактирование
      setEditTitle(urlData.title || "");
      setIsEditingTitle(true);
    }
  };

  const handleSaveTitle = async () => {
    if (editTitle.length > 24) {
      notificationRef.current?.addNotification(t("shared.titleTooLong"), 3000);
      return;
    }

    // Валидация: удаляем потенциально опасные символы и лишние пробелы
    const sanitizedTitle = editTitle
      .trim()
      .replace(/[<>]/g, "") // Удаляем угловые скобки
      .replace(/javascript:/gi, "") // Удаляем javascript: схемы
      .replace(/on\w+=/gi, "") // Удаляем обработчики событий
      .replace(/[<>'"&]/g, "") // Удаляем HTML-спецсимволы
      .slice(0, 24); // Ограничиваем до 24 символов

    try {
      if (onUpdateTitle) {
        await onUpdateTitle(urlData._id, sanitizedTitle || null);
      }
      setIsEditingTitle(false);
      notificationRef.current?.addNotification(t("shared.titleUpdated"), 2000);
    } catch (error) {
      notificationRef.current?.addNotification(t("shared.titleUpdateError"), 3000);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setEditTitle("");
    }
  };

  const handleEditUrlClick = () => {
    if (isEditingUrl) {
      // Сохранить при повторном нажатии
      handleSaveUrl();
    } else {
      // Начать редактирование
      setEditUrl(urlData.url);
      setIsEditingUrl(true);
    }
  };

  const handleSaveUrl = async () => {
    const trimmedUrl = editUrl.trim();
    if (!trimmedUrl) {
      notificationRef.current?.addNotification(t("shared.urlInvalid"), 3000);
      return;
    }

    try {
      if (onUpdateUrl) {
        await onUpdateUrl(urlData._id, trimmedUrl);
      }
      setIsEditingUrl(false);
      notificationRef.current?.addNotification(t("shared.urlUpdated"), 2000);
    } catch (error) {
      notificationRef.current?.addNotification(t("shared.urlUpdateError"), 3000);
    }
  };

  const handleUrlKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveUrl();
    } else if (e.key === "Escape") {
      setIsEditingUrl(false);
      setEditUrl("");
    }
  };

  const handleSaveUtm = async () => {
    try {
      const parsedUrl = new URL(urlData.url);

      // Update or delete search params
      ["source", "medium", "campaign", "term", "content"].forEach((key) => {
        if (utmData[key]) {
          parsedUrl.searchParams.set(`utm_${key}`, utmData[key]);
        } else {
          parsedUrl.searchParams.delete(`utm_${key}`);
        }
      });

      const newUrl = parsedUrl.toString();
      if (newUrl !== urlData.url && onUpdateUrl) {
        await onUpdateUrl(urlData._id, newUrl);
        notificationRef.current?.addNotification(
          t("shared.urlUpdated") || "UTM tags updated",
          2000
        );
      }
      setIsEditingUtm(false);
    } catch (e) {
      notificationRef.current?.addNotification(
        t("shared.urlUpdateError") || "Error updating UTM tags",
        3000
      );
    }
  };

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-all duration-200 hover:shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-800"
      style={{ willChange: "transform, opacity, background-color, border-color, color" }}
    >
      <div className="mb-4 flex flex-col gap-4 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex w-full min-w-0 flex-col sm:max-w-[60%] md:max-w-[65%]">
          {mode === "myurls" && (
            <div className="xs:mb-1.5 xs:gap-1 mb-1.5 flex items-center gap-1 sm:mb-2 sm:gap-2">
              {isEditingTitle ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    className="xs:h-8 xs:px-2 xs:py-1 xs:text-sm h-8 w-full min-w-25 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-semibold text-gray-800 focus:border-sky-500 focus:outline-none sm:h-9 sm:max-w-50 sm:min-w-30 sm:px-3 sm:py-1 sm:text-lg dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 dark:focus:border-sky-400"
                    placeholder={t("shared.enterTitle")}
                    maxLength={24}
                    autoFocus
                  />
                  <button
                    style={{ transition: "var(--transition-bg)" }}
                    onClick={handleEditTitleClick}
                    className="xs:h-8 xs:w-8 xs:px-1 xs:py-1 flex h-8 w-8 cursor-pointer touch-manipulation items-center justify-center rounded-md bg-sky-500 px-1 py-1 text-white hover:bg-sky-600 sm:h-9 sm:w-9 sm:px-2 sm:py-1 dark:bg-sky-500 dark:hover:bg-sky-400"
                    title={t("shared.save")}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      className="xs:h-3 xs:w-3 h-3 w-3 sm:h-4 sm:w-4"
                    >
                      <use href="#redact"></use>
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  {urlData.title ? (
                    <span className="xs:h-8 xs:px-2 xs:py-1 xs:text-lg inline-block h-8 w-full rounded-md border border-gray-200 px-2 py-1 text-lg font-extrabold text-gray-700 sm:h-9 sm:w-fit sm:min-w-20 sm:px-3 sm:py-1 sm:text-xl dark:border-slate-600 dark:text-gray-100">
                      {urlData.title}
                    </span>
                  ) : (
                    <span className="xs:h-8 xs:px-2 xs:py-1 xs:text-sm inline-block h-8 w-full truncate rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-500 sm:h-9 sm:w-50 sm:px-3 sm:py-1 sm:text-lg dark:border-slate-600 dark:text-gray-400">
                      {t("shared.titlePlaceholder")}
                    </span>
                  )}
                  <button
                    onClick={handleEditTitleClick}
                    style={{ transition: "var(--transition-bg)" }}
                    className={`xs:h-8 xs:w-8 xs:px-1 xs:py-1 flex h-8 w-8 cursor-pointer touch-manipulation items-center justify-center rounded-md px-1 py-1 sm:h-9 sm:w-9 sm:px-2 sm:py-1 ${
                      urlData.title
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-600 dark:text-gray-200 dark:hover:bg-slate-500"
                        : "bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400"
                    }`}
                    title={urlData.title ? t("shared.editTitle") : t("shared.addTitle")}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      className="xs:h-3 xs:w-3 h-3 w-3 sm:h-4 sm:w-4"
                    >
                      <use href="#redact"></use>
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
          {/* URL block - short + long unified */}
          <div className="mt-1.5 overflow-hidden rounded-xl border border-gray-200/80 bg-gray-50/50 dark:border-slate-700/60 dark:bg-slate-900/30">
            {/* Short URL row */}
            <div
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${urlData.shortCode}`);
                notificationRef.current?.addNotification(t("homepage.copied") || "Copied!", 2000);
              }}
              className="group flex cursor-pointer items-center border-b border-gray-200/80 transition-colors hover:bg-sky-50/60 dark:border-slate-700/60 dark:hover:bg-sky-900/20"
              title={t("myurls.copy")}
            >
              <span
                className="notranslate shrink-0 border-r border-gray-200/80 bg-sky-100/60 px-3 py-2 text-sm font-medium text-sky-700/80 dark:border-slate-700/60 dark:bg-sky-900/40 dark:text-sky-500"
                translate="no"
              >
                {window.location.origin.replace(/^https?:\/\//, "")}/
              </span>
              <span
                className="notranslate flex-1 px-3 py-2 text-base font-bold text-sky-600 dark:text-sky-300"
                translate="no"
              >
                {urlData.shortCode}
              </span>
              <div className="flex shrink-0 items-center justify-center px-3 transition-opacity">
                <svg
                  className="h-4 w-4 text-sky-500 dark:text-sky-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              {mode === "share" && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = urlData.url;
                  }}
                  className="mr-3 flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-green-600 bg-green-500 p-1.5 dark:bg-green-700"
                  title={t("shared.visitSite")}
                >
                  <svg fill="#FFFFFF" viewBox="0 0 15 15" className="h-3.5 w-3.5">
                    <use href="#arrow"></use>
                  </svg>
                </motion.div>
              )}
            </div>
            {/* Long URL row */}
            {isEditingUrl ? (
              <div className="flex items-center gap-2 px-3 py-2">
                <svg
                  className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  onKeyDown={handleUrlKeyDown}
                  className="w-full truncate bg-transparent py-1.5 text-sm text-gray-600 focus:outline-none dark:text-gray-300"
                  placeholder={t("shared.enterUrl")}
                  autoFocus
                />
                <button
                  onClick={handleEditUrlClick}
                  className="mr-1 flex shrink-0 cursor-pointer items-center justify-center rounded-md bg-sky-500 p-1.5 text-white hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400"
                  title={t("shared.save")}
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="group flex items-center">
                <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
                  <svg
                    className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{urlData.url}</p>
                </div>
                {mode === "myurls" && (
                  <button
                    onClick={handleEditUrlClick}
                    className="mr-3 flex shrink-0 cursor-pointer items-center justify-center rounded-md p-1 text-gray-400 transition-all hover:bg-sky-100 hover:text-sky-600 dark:text-gray-500 dark:hover:bg-slate-700 dark:hover:text-sky-400"
                    title={t("shared.editUrl")}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 transition-transform group-hover:scale-110"
                    >
                      <use href="#redact"></use>
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
          {/* UTM Display & Edit Section */}
          <div className="relative mt-2 flex flex-col gap-2">
            {!isEditingUtm && hasAnyUtm && (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-sky-100 bg-sky-50/40 px-3 py-2 dark:border-slate-600/50 dark:bg-slate-700/30">
                <span className="mr-1 flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  UTM
                </span>
                {initialUtms.source && (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                    source: {initialUtms.source}
                  </span>
                )}
                {initialUtms.medium && (
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-sm font-medium text-green-700 ring-1 ring-green-600/20 ring-inset dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
                    medium: {initialUtms.medium}
                  </span>
                )}
                {initialUtms.campaign && (
                  <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-sm font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/30">
                    cmp: {initialUtms.campaign}
                  </span>
                )}
                {initialUtms.term && (
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-sm font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30">
                    term: {initialUtms.term}
                  </span>
                )}
                {initialUtms.content && (
                  <span className="inline-flex items-center rounded-md bg-pink-50 px-2.5 py-1 text-sm font-medium text-pink-700 ring-1 ring-pink-700/10 ring-inset dark:bg-pink-400/10 dark:text-pink-400 dark:ring-pink-400/30">
                    cnt: {initialUtms.content}
                  </span>
                )}
              </div>
            )}

            {/* Share mode: show "no UTM" label when none present */}
            {mode === "share" && !hasAnyUtm && (
              <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-slate-700/60 dark:bg-slate-800/50">
                <svg
                  className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {t("homepage.utm.none")}
                </span>
              </div>
            )}

            {mode === "myurls" && !isEditingUtm && (
              <button
                onClick={() => setIsEditingUtm(true)}
                className="flex w-max items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-100 hover:text-sky-700 dark:border-sky-800/60 dark:bg-sky-900/40 dark:text-sky-400 dark:hover:bg-sky-900/60 dark:hover:text-sky-300"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {hasAnyUtm ? (
                    <use href="#redact"></use>
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  )}
                </svg>
                {hasAnyUtm ? t("homepage.utm.edit") : t("homepage.utm.add")}
              </button>
            )}

            {isEditingUtm && (
              <div className="mt-2 w-full rounded-lg border border-sky-200 bg-sky-50/50 p-3 shadow-inner sm:p-4 dark:border-slate-600 dark:bg-slate-900/50">
                <UtmBuilder utmData={utmData} onChange={setUtmData} />
                <div className="mt-4 flex justify-end gap-2 text-sm">
                  <button
                    onClick={() => {
                      setUtmData(initialUtms);
                      setIsEditingUtm(false);
                    }}
                    className="rounded-md px-3 py-1.5 font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    onClick={handleSaveUtm}
                    className="rounded-md bg-sky-500 px-3 py-1.5 font-medium text-white transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                  >
                    {t("shared.save")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:flex-row-reverse sm:gap-2">
          {mode === "myurls" && (
            <>
              {/* Share Button */}
              <motion.button
                whileHover={{ scale: 1.14 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/share/${urlData._id}`);
                  notificationRef.current?.addNotification(t("shared.shareLinkCopied"), 2000);
                }}
                className="flex h-7 w-7 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-transparent bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:border-sky-600 dark:bg-sky-600"
                title={t("myurls.share")}
              >
                <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                  <use href="#share"></use>
                </svg>
              </motion.button>
              {/* QR Button */}
              <motion.button
                whileHover={{ scale: 1.14 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                type="button"
                className="flex h-7 w-7 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-transparent bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:border-sky-600 dark:bg-sky-600"
                onClick={() => {
                  const urlFullDomain = new URL(urlData.url);
                  const urlMainDomain = urlFullDomain.hostname;
                  const domainParts = urlMainDomain.split(".");
                  const baseDomain = domainParts.slice(-2).join(".");
                  const link = document.createElement("a");
                  link.href = urlData.qrCodeDataUrl;
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
              </motion.button>
              {/* Copy button */}
              <motion.button
                whileHover={{ scale: 1.14 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/${urlData.shortCode}`);
                  notificationRef.current?.addNotification(t("homepage.copied"), 2000);
                }}
                className="flex h-7 w-7 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-transparent bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:border-sky-600 dark:bg-sky-600"
                title={t("myurls.copy")}
              >
                <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                  <use href="#clipboard"></use>
                </svg>
              </motion.button>
              {/* chart button */}
              <motion.button
                whileHover={{ scale: 1.14 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                onClick={onToggleAnalytics}
                className="flex h-7 w-7 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-transparent bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:border-sky-600 dark:bg-sky-600"
                title={t("myurls.viewAnalytics")}
              >
                <svg fill="#FFFFFF" viewBox="0 0 16 16" className="p-1">
                  <use href="#chart"></use>
                </svg>
              </motion.button>
            </>
          )}
          {mode === "share" && (
            <>
              {/* Download QR Button */}
              <motion.button
                whileHover={{ scale: 1.14 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                type="button"
                className="flex h-7 w-7 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-transparent bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:border-sky-600 dark:bg-sky-600"
                onClick={() => {
                  const urlFullDomain = new URL(urlData.url);
                  const urlMainDomain = urlFullDomain.hostname;
                  const domainParts = urlMainDomain.split(".");
                  const baseDomain = domainParts.slice(-2).join(".");
                  const link = document.createElement("a");
                  link.href = urlData.qrCodeDataUrl;
                  link.download = `${baseDomain}-QRcode.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                title={t("shared.downloadQR")}
              >
                <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                  <use href="#qrcode"></use>
                </svg>
              </motion.button>
              {/* Copy button */}
              <motion.button
                whileHover={{ scale: 1.14 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                onClick={onCopy}
                className="flex h-7 w-7 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-transparent bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:border-sky-600 dark:bg-sky-600"
                title={t("shared.copy")}
              >
                <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                  <use href="#clipboard"></use>
                </svg>
              </motion.button>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 shadow-md sm:gap-2 sm:px-4 sm:py-2 dark:text-white ${
            urlData.isActive === false
              ? "border-gray-600 bg-gray-500 text-white dark:border-gray-500 dark:bg-gray-600"
              : dayjs(urlData.expiredAt).isAfter(dayjs())
                ? "border-green-600 bg-green-500 text-white dark:border-green-600 dark:bg-green-700"
                : "border border-transparent bg-red-300 text-white dark:border-red-500 dark:bg-red-500"
          } `}
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
            {urlData.isActive === false ? (
              <use href="#cross" />
            ) : dayjs(urlData.expiredAt).isAfter(dayjs()) ? (
              <use href="#check" />
            ) : (
              <use href="#cross" />
            )}
          </svg>
          <div>
            <p className="text-base font-semibold sm:text-lg md:text-xl">
              {urlData.isActive === false
                ? t("myurls.paused")
                : dayjs(urlData.expiredAt).isAfter(dayjs())
                  ? t("shared.active")
                  : t("shared.expired")}
            </p>
            <span className="text-sm text-white sm:text-base md:text-lg">
              {formatDate(urlData.createdAt)} — {formatDate(urlData.expiredAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:flex-row-reverse sm:gap-4">
          <div
            className="flex h-6 w-auto flex-row items-center gap-0.5 rounded-xl border border-transparent bg-sky-500 px-2 sm:h-7 sm:gap-1 md:h-12 dark:border-sky-600 dark:bg-sky-600"
            title="Clicks"
          >
            <svg
              fill="#FFFFFF"
              className="min-h-6 min-w-6 p-1 sm:h-7 sm:w-7 md:h-12 md:w-12"
              viewBox="0 0 48 48"
            >
              <use href="#clicks"></use>
            </svg>
            <p className="text-base font-extrabold text-white sm:text-lg md:text-xl">
              {urlData.clicks}
            </p>
          </div>
          {mode === "myurls" && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {onToggleActive && (
                <motion.button
                  whileHover={{ scale: 1.14 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                  onClick={onToggleActive}
                  className={`flex h-7 w-7 cursor-pointer touch-manipulation items-center justify-center rounded-xl sm:h-9 sm:w-9 md:h-12 md:w-12 ${
                    urlData.isActive !== false
                      ? "border border-transparent bg-red-300 dark:border-red-500 dark:bg-red-500"
                      : "border border-transparent bg-sky-500 dark:border-sky-600 dark:bg-sky-600"
                  }`}
                  title={urlData.isActive !== false ? t("myurls.pause") : t("myurls.resume")}
                >
                  <svg
                    fill="#FFFFFF"
                    viewBox="0 0 24 24"
                    className={urlData.isActive !== false ? "p-1" : "p-0.5"}
                  >
                    {urlData.isActive !== false ? (
                      <use href="#pause"></use>
                    ) : (
                      <use href="#play"></use>
                    )}
                  </svg>
                </motion.button>
              )}
              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.14 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                  onClick={handleDeleteClick}
                  className="flex h-7 w-7 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-transparent bg-red-300 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:border-red-500 dark:bg-red-500"
                  title={t("myurls.delete")}
                >
                  <svg
                    fill="#FFFFFF"
                    viewBox="-3 -2 24 24"
                    preserveAspectRatio="xMinYMin"
                    className="p-1"
                  >
                    <path d="M6 2V1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-.133l-.68 10.2a3 3 0 0 1-2.993 2.8H5.826a3 3 0 0 1-2.993-2.796L2.137 7H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4zm10 2H2v1h14V4zM4.141 7l.687 10.068a1 1 0 0 0 .998.932h6.368a1 1 0 0 0 .998-.934L13.862 7h-9.72zM7 8a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z" />
                  </svg>
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
      {mode === "myurls" && onDelete && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            onDelete();
          }}
          title={t("myurls.confirmDelete")}
          message={t("myurls.confirmDeleteMessage")}
          confirmText={t("myurls.delete")}
          cancelText={t("modal.deleteProfile.cancelBtn")}
          type="danger"
          showDontAskAgain={true}
          onDontAskAgainChange={handleDontAskAgainChange}
        />
      )}
    </div>
  );
}

export default UrlCard;
