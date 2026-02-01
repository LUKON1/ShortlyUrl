import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";

function TopUrlsList({ topUrls }) {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
        {t("dashboard.topUrls")}
      </h3>
      {topUrls.length === 0 ? (
        <p className="py-4 text-center text-gray-600 dark:text-gray-400">{t("dashboard.noData")}</p>
      ) : (
        <div className="space-y-4">
          {topUrls.map((url, index) => (
            <motion.div
              key={url.shortCode}
              className="motion-safe flex items-center gap-4 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                background: isDark
                  ? "linear-gradient(135deg, rgb(51 65 85) 0%, rgb(30 41 59) 100%)" // slate-700 to slate-800
                  : "linear-gradient(135deg, rgb(248 250 252) 0%, rgb(239 246 255) 100%)", // sky-50 to blue-50
              }}
              whileHover={{
                background: isDark
                  ? "linear-gradient(135deg, rgb(30 41 59) 0%, rgb(15 23 42) 100%)" // slate-800 to slate-900
                  : "linear-gradient(135deg, rgb(239 246 255) 0%, rgb(219 234 254) 100%)", // blue-50 to sky-50
                scale: 1.02,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1,
                backgroundColor: { duration: 0.2, ease: "easeOut" },
                scale: { duration: 0.2, ease: "easeOut" },
              }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-sky-400 to-blue-500 text-sm font-bold text-white dark:from-sky-500 dark:to-blue-600">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900 dark:text-gray-100">
                  {`${import.meta.env.VITE_BASE_URL || window.location.origin}/${url.shortCode}`}
                </p>
                <p className="truncate text-sm text-gray-600 dark:text-gray-400">{url.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-600 dark:text-rose-400">
                  {url.clicks}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t("myurls.clicks")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopUrlsList;
