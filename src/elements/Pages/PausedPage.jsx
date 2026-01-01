import { useTranslation } from "react-i18next";
import HiddenSVGIcons from "../shared/HiddenSVGIcons";
function PausedPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full items-center justify-center bg-gray-50 px-4 dark:bg-slate-900">
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-lg dark:bg-slate-800">
        <div className="mb-8 h-32 w-32">
          <svg viewBox="0 0 24 24" className="text-red-500 dark:text-red-400">
            <use href="#blocked"></use>
          </svg>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-red-600 sm:text-3xl md:text-4xl dark:text-red-400">
          {t("paused.title", "Link Paused")}
        </h1>
        <p className="mb-8 text-base text-gray-600 sm:text-lg dark:text-gray-400">
          {t(
            "paused.message",
            "This shortened link has been paused by the owner and is temporarily unavailable."
          )}
        </p>
        <a
          href="/"
          className="inline-flex touch-manipulation items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
        >
          {t("paused.home", "Go Home")}
        </a>
      </div>
    </div>
  );
}

export default PausedPage;
