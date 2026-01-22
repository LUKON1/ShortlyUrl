import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";
import UrlAnalyticsChart from "./UrlAnalyticsChart";
import AppLoader from "../shared/AppLoader";
import UrlCard from "../shared/UrlCard";
import useAxiosPrivate from "../../utils/useAxiosPrivate";

function Urlslist({ urls, notificationRef, getMyUrls, updateUrl, removeUrl, isLoading }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [searchTerm, setSearchTerm] = useState("");
  const [openAnalyticsId, setOpenAnalyticsId] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const displayedUrls = useMemo(() => {
    const filteredUrls = searchTerm
      ? urls.filter((urlItem) => urlItem.url.toLowerCase().includes(searchTerm.toLowerCase()))
      : urls;

    // Оставляем все элементы, включая удаляемые, для корректной анимации
    return filteredUrls;
  }, [searchTerm, urls]);

  const toggleAnalytics = (id) => {
    setOpenAnalyticsId(openAnalyticsId === id ? null : id);
  };

  const handleToggleActive = async (urlId) => {
    try {
      const response = await axiosPrivate.patch(`/myurls/toggle/${urlId}`);
      if (updateUrl && response.data) {
        updateUrl(response.data);
      } else {
        await getMyUrls();
      }
    } catch (err) {
      console.error("Failed to toggle URL status:", err);
      notificationRef.current?.addNotification(t("myurls.loaderr"), 3000);
    }
  };

  const handleUpdateTitle = useCallback(
    async (urlId, title) => {
      try {
        const response = await axiosPrivate.patch(`/myurls/update-title/${urlId}`, {
          title: title,
        });

        if (updateUrl && response.data) {
          updateUrl(response.data);
        } else {
          await getMyUrls();
        }
      } catch (err) {
        console.error("Failed to update URL title:", err);
        throw err;
      }
    },
    [axiosPrivate, updateUrl, getMyUrls]
  );

  const handleUpdateUrl = useCallback(
    async (urlId, newUrl) => {
      try {
        const response = await axiosPrivate.patch(`/myurls/update-url/${urlId}`, {
          url: newUrl,
        });

        if (updateUrl && response.data) {
          updateUrl(response.data);
        } else {
          await getMyUrls();
        }
      } catch (err) {
        console.error("Failed to update URL:", err);
        throw err;
      }
    },
    [axiosPrivate, updateUrl, getMyUrls]
  );

  const handleDelete = useCallback(
    async (urlId) => {
      // Добавляем ID в список удаляемых для предотвращения перерисовки
      setDeletingIds((prev) => new Set([...prev, urlId]));

      try {
        await axiosPrivate.delete(`/myurls/${urlId}`);

        // Элемент будет удален автоматически через onAnimationComplete

        notificationRef.current?.addNotification(t("myurls.deleteSuccess"), 2000);
      } catch (err) {
        console.error("Failed to delete URL:", err);
        // Удаляем из списка удаляемых при ошибке
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(urlId);
          return newSet;
        });
        notificationRef.current?.addNotification(t("myurls.deleteError"), 3000);
      }
    },
    [axiosPrivate, removeUrl, getMyUrls, t, notificationRef]
  );

  return (
    <>
      <div className="flex w-full flex-col items-center" style={{ contain: "layout style" }}>
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
              className="h-full w-12 touch-manipulation rounded-lg rounded-l-none border-2 border-l-0 border-sky-500 bg-sky-500 p-1 transition-colors hover:bg-sky-600 dark:border-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700"
              type="button"
            >
              <svg fill="#FFFFFF" viewBox="0 0 35 31.8" className="hover:cursor-pointer">
                <use href="#reload"></use>
              </svg>
            </button>
          </div>
          {isLoading ? (
            <div className="flex min-h-[50vh] flex-col justify-center">
              <div className="flex items-center justify-center">
                <AppLoader />
              </div>
            </div>
          ) : (
            <>
              {displayedUrls.length > 0 ? (
                <motion.ul
                  className="mx-auto w-full max-w-7xl px-0"
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    layout: {
                      duration: 0.4,
                      ease: "easeOut",
                    },
                  }}
                >
                  <AnimatePresence mode="sync">
                    {displayedUrls.map((urlItem, index) => (
                      <motion.li
                        key={urlItem._id}
                        className={openAnalyticsId !== urlItem._id ? "mb-8" : ""}
                        style={{ willChange: "transform, opacity" }}
                        initial={{ opacity: 0, y: 100 }}
                        animate={deletingIds.has(urlItem._id) ? "exit" : "enter"}
                        variants={{
                          enter: { opacity: 1, x: 0, y: 0 },
                          exit: { opacity: 0, x: 5000, y: 0 },
                        }}
                        transition={{
                          ease: [0.25, 0.46, 0.45, 0.94],
                          delay: deletingIds.has(urlItem._id) ? 0 : index * 0.2,
                        }}
                        onAnimationComplete={(definition) => {
                          if (definition === "exit" && deletingIds.has(urlItem._id)) {
                            if (removeUrl) {
                              removeUrl(urlItem._id);
                            } else {
                              getMyUrls();
                            }
                            setDeletingIds((prev) => {
                              const newSet = new Set(prev);
                              newSet.delete(urlItem._id);
                              return newSet;
                            });
                          }
                        }}
                      >
                        <UrlCard
                          mode="myurls"
                          urlData={urlItem}
                          onToggleAnalytics={() => toggleAnalytics(urlItem._id)}
                          onToggleActive={() => handleToggleActive(urlItem._id)}
                          onDelete={() => handleDelete(urlItem._id)}
                          onUpdateTitle={handleUpdateTitle}
                          onUpdateUrl={handleUpdateUrl}
                          t={t}
                          notificationRef={notificationRef}
                        />
                        <AnimatePresence mode="wait">
                          {openAnalyticsId === urlItem._id && (
                            <motion.div
                              className="relative z-10 mt-2 mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-800"
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 20, scale: 0.95 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.25, 0.46, 0.45, 0.94],
                              }}
                            >
                              <UrlAnalyticsChart urlId={urlItem._id} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        Нет URL-адресов
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Создайте вашу первую сокращенную ссылку
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => navigate("/")}
                          className="inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
                        >
                          Создать новую
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      </div>
    </>
  );
}
export default Urlslist;
