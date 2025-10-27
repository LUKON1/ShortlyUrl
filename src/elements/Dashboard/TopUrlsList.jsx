import { useTranslation } from "react-i18next";

function TopUrlsList({ topUrls }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t("dashboard.topUrls")}
      </h3>
      {topUrls.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-4">
          {t("dashboard.noData")}
        </p>
      ) : (
        <div className="space-y-4">
          {topUrls.map((url, index) => (
            <div
              key={url.shortCode}
              className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 dark:from-sky-500 dark:to-blue-600 text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {`${import.meta.env.VITE_BASE_URL}/${url.shortCode}`}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {url.url}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-rose-500 dark:text-rose-400">
                  {url.clicks}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t("myurls.clicks")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopUrlsList;
